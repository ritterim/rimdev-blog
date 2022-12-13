---
layout: ../layouts/Post.astro
title: Performance Tests / Benchmarking for ASP.NET Core 2.2 Endpoints
date: 2018-12-26 14:00:00
tags:
- Benchmarking
- OSS
categories:
- development
twitter_text: "Performance Tests / Benchmarking for ASP.NET Core 2.2 Endpoints"
authors: Ken Dale
image: https://images.unsplash.com/photo-1431499012454-31a9601150c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=3900&q=80
image_url: https://unsplash.com/photos/p3Pj7jOYvnM
image_credit: Veri Ivanova
---

As you're building out an API it's important to keep response times in check. In many cases slowness is due to database calls, web requests, and other network operations. But, elevated response times can also be due to in-memory operations as part of the ASP.NET Core pipeline.

Using [BenchmarkDotNet](https://benchmarkdotnet.org/) we can benchmark integration tests for an ASP.NET Core 2.2 application to keep a watch on these items.

```
<!-- Benchmarks.csproj -->

<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>netcoreapp2.2</TargetFramework>
    <OutputType>Exe</OutputType>
    <ServerGarbageCollection>true</ServerGarbageCollection>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="BenchmarkDotNet" Version="0.11.3" />
    <PackageReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="2.2.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="<< TODO >>" />
  </ItemGroup>

</Project>
```

```csharp
// ResponseBenchmarks.cs

using BenchmarkDotNet.Attributes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Logging;
using SampleApi; // TODO: Change this to your API to benchmark
using System.Net.Http;
using System.Threading.Tasks;

namespace Benchmarks
{
    [InProcess]
    [MemoryDiagnoser]
    public class ResponseBenchmarks
    {
        private HttpClient client;

        [GlobalSetup]
        public void GlobalSetup()
        {
            var factory = new WebApplicationFactory<Startup>()
                .WithWebHostBuilder(configuration =>
                {
                    configuration.ConfigureLogging(logging =>
                    {
                        logging.ClearProviders();
                    });
                });

            client = factory.CreateClient();
        }

        [Benchmark]
        public Task GetResponseTime()
        {
            return client.GetAsync("/");
        }

        // More benchmarks as needed
    }
}
```

```csharp
// Program.cs

using BenchmarkDotNet.Running;

namespace Benchmarks
{
    public class Program
    {
        public static void Main()
        {
            BenchmarkRunner.Run<ResponseBenchmarks>();
        }
    }
}
```

Running this via `dotnet run -c Release` will produce something like:

```
                             | Method          |     Mean |    Error |   StdDev | Gen 0/1k Op | Gen 1/1k Op | Gen 2/1k Op | Allocated Memory/Op |
                             | --------------- | -------: | -------: | -------: | ----------: | ----------: | ----------: | ------------------: |
                             | GetResponseTime | 186.3 us | 2.586 us | 2.419 us |           - |           - |           - |             6.09 KB |
```

Happy benchmarking!
