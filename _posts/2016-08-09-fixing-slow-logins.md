---
layout: post
title: "Fixing slow logins"
date: 2016-08-09 18:00:00
tags:
- IdentityServer
- openssl
- certs
- .NET
categories: Security
twitter_text: Fixing slow logins
authors:
- Bill Boga
- Justin Rusbatch
image : https://c4.staticflickr.com/1/144/360341179_eac7b07f47_b.jpg
image_url : https://www.flickr.com/photos/v63/360341179/
image_credit: Russell Mondy
---

At Ritter Insurance Marketing, we use [IdentityServer](https://github.com/IdentityServer/IdentityServer3) as part of our authentication strategy. It works great for our current needs. However, we noticed initial logins took longer than expected. We did some quick tests to confirm one-page had a response-time 
of ~500 ms (on average). This delay was made worse when many people would login at the same time (which happens every morning). The particular page is part of Identity Server's authorize endpoint controller (i.e. `/connect/authorize`). Not really sure where to begin further debugging, we started hacking on the 
URI's query string, and noticed when removing `nonce` and `state`-keys, the response-time went down. However, the generated HTML did not contain the expected `id-token` hidden form-tag. We used this info. and traversed through the controller to see where this tag was generated and eventually ended up in the [DefaultTokenSigningService](https://github.com/IdentityServer/IdentityServer3/blob/dd07bd88f64b437b2c261cc76c71917ec5a0eb03/source/Core/Services/Default/DefaultTokenSigningService.cs) class. This is responsible for signing the [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) payload.

Before long, we realized this process involves the certificate provided to Identity Server, by the app., when it starts up. So, we pulled the certificate and looked to see if anything looked unfamiliar:

```shell
> openssl x509 -in cert.crt -text -noout
```

Two things stood out: `Signature Algorithm: sha512WithRSAEncryption` and `Public-Key: (8192 bit)`. These are overkill for our purposes (along with almost everyone else) and *definitely* contributed to the long page load-time. We fairly quickly went about issuing a new certificate at 2048-bits using SHA256 and 
confirmed login times improved (~150 ms TTFB). However, we were still curious about various bit-sizes, signature algorithms, and how long each would take. So, a quick benchmark app. was constructed using [BenchmarkDotNet](https://github.com/PerfDotNet/BenchmarkDotNet). What follows is both the source and results of running the app.

### CertSigningBenchmarks.cs

```csharp
using BenchmarkDotNet.Attributes;
using IdentityServer3.Core;
using IdentityServer3.Core.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;

namespace IdentityServerTokenGenerationBenchmarks
{
    public class CertSigningBenchmarks : IDisposable
    {
        public CertSigningBenchmarks()
        {
            var certPassword = "notsecure";

            certificate_256_2048 = new X509Certificate2("certs/idsrv-256-2048.pfx", certPassword);
            certificate_256_4096 = new X509Certificate2("certs/idsrv-256-4096.pfx", certPassword);
            certificate_256_8192 = new X509Certificate2("certs/idsrv-256-8192.pfx", certPassword);

            certificate_512_2048 = new X509Certificate2("certs/idsrv-512-2048.pfx", certPassword);
            certificate_512_4096 = new X509Certificate2("certs/idsrv-512-4096.pfx", certPassword);
            certificate_512_8192 = new X509Certificate2("certs/idsrv-512-8192.pfx", certPassword);
        }

        private readonly string payload = TokenFactory.CreateIdentityToken().CreateJwtPayload();
        private readonly X509Certificate2 certificate_256_2048;
        private readonly X509Certificate2 certificate_256_4096;
        private readonly X509Certificate2 certificate_256_8192;
        private readonly X509Certificate2 certificate_512_2048;
        private readonly X509Certificate2 certificate_512_4096;
        private readonly X509Certificate2 certificate_512_8192;

        [Benchmark(Description = "SHA256 - 2048-bit")]
        public void Sha256_2048_Bit()
        {
            var credentials = new X509SigningCredentials(certificate_256_2048);

            Sign(payload, credentials);
        }

        [Benchmark(Description = "SHA256 - 4096-bit")]
        public void Sha256_4096_Bit()
        {
            var credentials = new X509SigningCredentials(certificate_256_4096);

            Sign(payload, credentials);
        }

        [Benchmark(Description = "SHA256 - 8192-bit")]
        public void Sha256_8192_Bit()
        {
            var credentials = new X509SigningCredentials(certificate_256_8192);

            Sign(payload, credentials);
        }

        [Benchmark(Description = "SHA512 - 2048-bit")]
        public void Sha512_2048_Bit()
        {
            var credentials = new X509SigningCredentials(certificate_512_2048);

            Sign(payload, credentials);
        }

        [Benchmark(Description = "SHA512 - 4096-bit")]
        public void Sha512_4096_Bit()
        {
            var credentials = new X509SigningCredentials(certificate_512_4096);

            Sign(payload, credentials);
        }

        [Benchmark(Description = "SHA512 - 8192-bit")]
        public void Sha512_8192_Bit()
        {
            var credentials = new X509SigningCredentials(certificate_512_8192);

            Sign(payload, credentials);
        }

        /// <summary>
        /// Modified from https://github.com/IdentityServer/IdentityServer3/blob/dd07bd88f64b437b2c261cc76c71917ec5a0eb03/source/Core/Services/Default/DefaultTokenSigningService.cs#L103-L130
        /// </summary>
        /// <returns></returns>
        private static string Sign(string payload, SigningCredentials credentials)
        {
            var header = new JwtHeader(credentials);
            var jwtPayload = JwtPayload.Deserialize(payload);
            var token = new JwtSecurityToken(header, jwtPayload);
            var handler = new JwtSecurityTokenHandler();

            return handler.WriteToken(token);
        }

        private static class TokenFactory
        {
            public static Token CreateIdentityToken()
            {
                var client = new Client()
                {
                    ClientId = "test-client",
                    Flow = Flows.Implicit
                };

                var claims = new List<Claim>
                {
                    new Claim("sub", "valid")
                };

                var token = new Token(Constants.TokenTypes.IdentityToken)
                {
                    Claims = claims,
                    Client = client,
                    Lifetime = 60,
                };

                return token;
            }
        }

        public void Dispose()
        {
            certificate_256_2048.Dispose();
            certificate_256_4096.Dispose();
            certificate_256_8192.Dispose();
            certificate_512_2048.Dispose();
            certificate_512_4096.Dispose();
            certificate_512_8192.Dispose();
        }
    }
}

```

### Program.cs

```
using BenchmarkDotNet.Running;

namespace IdentityServerTokenGenerationBenchmarks
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BenchmarkRunner.Run<CertSigningBenchmarks>();
        }
    }
}

```

### project.json

```json
{
    "version": "1.0.0-*",
    "buildOptions": {
        "emitEntryPoint": true
    },
    "dependencies": {
        "BenchmarkDotNet": "0.9.8",
        "System.IdentityModel.Tokens.Jwt": "4.0.0",
        "IdentityModel": "1.11.0",
        "IdentityServer3": "2.5.1"
    },
    "frameworks": {
        "net461": {}
    }
}

```

### Results

```ini

Host Process Environment Information:
BenchmarkDotNet=v0.9.8.0
OS=Microsoft Windows NT 6.2.9200.0
Processor=Intel(R) Core(TM) i7-5600U CPU 2.60GHz, ProcessorCount=4
Frequency=2533198 ticks, Resolution=394.7579 ns, Timer=TSC
CLR=MS.NET 4.0.30319.42000, Arch=64-bit RELEASE [RyuJIT]
GC=Concurrent Workstation
JitModules=clrjit-v4.6.1080.0

Type=CertSigningBenchmarks  Mode=Throughput  GarbageCollection=Concurrent Workstation  
```

{: .table .table-striped .table-fluid}
|            Method |     Median |      Mean |  StdError |    StdDev |   Op/s |        Min |        Max |
|------------------ |----------- |---------- |---------- |---------- |------- |----------- |----------- |
| SHA256 - 2048-bit |  2.4120 ms | 2.4276 ms | 0.0164 ms | 0.0837 ms | 411.92 |  2.3309 ms |  2.6418 ms |
| SHA256 - 4096-bit | 11.4094 ms |11.4642 ms | 0.0423 ms | 0.1892 ms |  87.23 | 11.2163 ms | 11.8987 ms |
| SHA256 - 8192-bit | 79.2107 ms |81.1363 ms | 1.2031 ms | 6.1348 ms |  12.32 | 76.7397 ms |106.1459 ms |
| SHA512 - 2048-bit |  2.4356 ms | 2.4679 ms | 0.0210 ms | 0.1258 ms |  405.2 |  2.3434 ms |  2.8646 ms |
| SHA512 - 4096-bit | 11.4812 ms |11.6003 ms | 0.0923 ms | 0.4128 ms |   86.2 | 11.2208 ms | 12.9738 ms |
| SHA512 - 8192-bit | 77.9870 ms |78.2887 ms | 0.2996 ms | 1.3398 ms |  12.77 | 76.5296 ms | 81.6495 ms |

We were a bit surprised about the insignificant difference between SHA256 and SHA512. Granted, these results are coming from my dev. machine and not how the app. runs in production, they still give us a good baseline. More importantly, we now understand ***why*** the login originally took so long.
