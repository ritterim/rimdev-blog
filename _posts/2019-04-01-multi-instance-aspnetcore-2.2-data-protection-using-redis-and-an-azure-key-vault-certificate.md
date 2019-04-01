---
layout: post
title: Multi Instance ASP.NET Core 2.2 Data Protection Using Redis and an Azure Key Vault Certificate
date: 2019-04-01 10:00:00
tags:
- .NET
- asp.net
- asp.net core
categories:
- asp.net
- asp.net core
- development
twitter_text: "Multi Instance #aspnetcore 2.2 Data Protection Using #redis and an @Azure Key Vault Certificate"
authors: Ken Dale
image: https://images.unsplash.com/photo-1504253163759-c23fccaebb55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80
image_url: https://unsplash.com/photos/IM8ZyYaSW6g
image_credit: Vladimir Anikeev
---

We're in the process of upgrading our infrastructure to run our Azure Web Apps in multiple datacenter locations behind Azure Traffic Manager instances to achieve high availability. Running multiple instances without using the scale up slider means you're responsible for any server side state that needs to be shared between instances *(or, ensure that traffic always returns to the same instance repeatedly, but we don't want to do that...)*.

**With ASP.NET Core projects we need to share the data protection keys between our web application instances. That way, items that are encrypted by any instance can be decrypted by any other instance.**

For this, we've decided to use Redis for storing the key ring, while protecting the keys using a certificate retrived from Azure Key Vault. **Here's how to do it using ASP.NET Core 2.2:**

## Install packages

You'll need to install the following packages to support the code below. Try installing the latest versions of all the packages, but if you run into issues working versions here are posted for reference:

```
Microsoft.AspNetCore.DataProtection.StackExchangeRedis # Version="2.2.0"
Microsoft.Azure.KeyVault                               # Version="3.0.3"
Microsoft.Azure.Services.AppAuthentication             # Version="1.0.3"
StackExchange.Redis                                    # Version="2.0.571"
```

## Code

Now, wiring it all up in `Startup.cs`:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System;
using System.Security.Cryptography.X509Certificates;

namespace MyApplication
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }

        public IHostingEnvironment Environment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<DataProtectionConfiguration>(Configuration.GetSection("dataProtection"));

            if (Environment.IsProduction())
            {
                ConfigureRedisDataProtection(services);
            }

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        private void ConfigureRedisDataProtection(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var dataProtectionConfiguration = serviceProvider
                .GetService<IOptions<DataProtectionConfiguration>>()
                .Value;

            var azureServiceTokenProvider = new AzureServiceTokenProvider();
            var keyVaultClient = new KeyVaultClient(
                new KeyVaultClient.AuthenticationCallback(
                    azureServiceTokenProvider.KeyVaultTokenCallback));

            // GetSecretAsync rather than GetCertificationAsync
            // See: https://stackoverflow.com/a/51482569/941536
            var dataProtectionSecretBundle = keyVaultClient
                .GetSecretAsync(
                    dataProtectionConfiguration.KeyVaultBaseUrl,
                    dataProtectionConfiguration.KeyVaultCertificateName)
                .GetAwaiter()
                .GetResult();

            var dataProtectionCertificate = new X509Certificate2(
                Convert.FromBase64String(dataProtectionSecretBundle.Value));

            var redis = ConnectionMultiplexer.Connect(
                Configuration.GetConnectionString(
                    dataProtectionConfiguration.RedisConnectionStringName));

            services
                .AddDataProtection()
                .SetApplicationName(dataProtectionConfiguration.ApplicationName)
                .PersistKeysToStackExchangeRedis(redis, dataProtectionConfiguration.RedisKey)
                .ProtectKeysWithCertificate(dataProtectionCertificate);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
```

## Configuration

Some configuration is needed. Here's a class to represent the required configuration:

```csharp
namespace MyApplication
{
    public class DataProtectionConfiguration
    {
        public string ApplicationName { get; set; }

        public string KeyVaultBaseUrl { get; set; }

        public string KeyVaultCertificateName { get; set; }

        public string RedisConnectionStringName { get; set; }

        public string RedisKey { get; set; }
    }
}
```

The configuration then looks like this in JSON as `appsettings.Production.json` or similar (*update these as needed*):

```json
{
  "dataProtection": {
    "applicationName": "my-application",
    "keyVaultBaseUrl": "https://VAULT_NAME_HERE.vault.azure.net",
    "keyVaultCertificateName": "DataProtection",
    "redisConnectionStringName": "Redis",
    "redisKey": "DataProtection-Keys-my-application"
  }
}
```

## Key Vault Permissions

Since the Azure Web App is authenticating as itself **you'll need to set each web app to use a managed identity (a system-assigned identity)**. See [https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity#adding-a-system-assigned-identity](https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity#adding-a-system-assigned-identity) for more details.

After the web apps are set with managed identities, you'll need to give each web application instance access to GET secrets from the key vault.

## Required Azure Web Apps Configuration

You'll also need to set a special app setting on each of the Azure Web App instances to make this work. See [https://github.com/projectkudu/kudu/wiki/Configurable-settings#the-system-cannot-find-the-file-specified-issue-with-x509certificate2](https://github.com/projectkudu/kudu/wiki/Configurable-settings#the-system-cannot-find-the-file-specified-issue-with-x509certificate2).

```
WEBSITE_LOAD_USER_PROFILE=1
```

## Test it out

Start the app and make sure it starts up correctly. If you want to test roundtripping the encryption and decryption you can do something like this and call it:

```csharp
using System.Text;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MyApplication
{
    public class TestController : ControllerBase
    {
        private readonly IDataProtector dataProtector;

        public TestController(IDataProtectionProvider dataProtectorProvider)
        {
            this.dataProtectorProvider = dataProtectorProvider.CreateProtector("Test");
        }

        [HttpGet]
        [Route("test-data-protection")]
        public ActionResult<string> DataProtection()
        {
            var protectedBytes = DataProtector.Protect(Encoding.UTF8.GetBytes("test"));

            var unprotectedBytes = DataProtector.Unprotect(protectedBytes);
            var unprotectedString = Encoding.UTF8.GetString(unprotectedBytes);

            return unprotectedString;
        }
    }
}
```

I hope this helps on the road to high availability!
