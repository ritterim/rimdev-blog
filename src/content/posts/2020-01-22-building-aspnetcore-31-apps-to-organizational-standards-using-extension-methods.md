---
title: "Building ASP.NET Core 3.1 Apps To Organizational Standards Using Extension Methods"
slug: building-aspnetcore-31-apps-to-organizational-standards-using-extension-methods
date: 2020-01-22 14:00:00
tags:
- .NET
categories:
- development
twitter_text: "Building ASP.NET Core 3.1 Apps To Organizational Standards Using Extension Methods"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1438758886433-4875b7ad923b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/CfF-P7YCOi8
image_credit: Tommy Liu
---

We've been working through upgrading our core applications from ASP.NET full framework to ASP.NET Core. Over the years we've assembled an opinionated library for assembling full framework APIs named `RimDev.WebApi`. It includes various items to aid our team in building consistent API experiences without needing to reinvent the wheel in each repository. With migrating to ASP.NET Core 3.1 we need to keep this same functionality where it impacts responses.

As we were working through this upgrade [Khalid Abuhakmeh](/authors/khalid-abuhakmeh/) had a great idea -- rather than baking everything into methods like `.AddRimDev()` and `.UseRimDev()` we should create a collection of incremental building blocks that apps can use (or, not use). This strategy helped us get to the finish line.

Here's an example:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RimDev.AspNetCore;

namespace SampleApi
{
    public class Startup
    {
        private readonly IWebHostEnvironment env;
        private readonly IConfiguration configuration;

        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            this.env = env;
            this.configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var authPolicy = AppAuthorization.GetRitterRequireScopesAuthorizationPolicy(configuration);

            services
                .AddRouting()
                .AddApplicationInsightsWithRimDevFilters(configuration)
                .AddRimDevDistributedDataProtection(env, configuration)
                .AddRitterApiAuthentication(configuration)
                // .AddRitterCookieAuthentication(configuration)
                .AddStandardRitterConfiguration(
                    /* authPolicy: authPolicy, */
                    hostAssembly: typeof(Startup).Assembly)
                .AddEnrichers(typeof(Startup).Assembly);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app
                .UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseStandardRitterConfiguration(env)
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapGitHash(env);
                    endpoints.MapSelfInfo();
                    endpoints.MapDefaultControllerRoute();
                });
        }
    }
}
```

This strategy keeps control in the hands of application developers to include or not include certain functionality. It's also much easier to reason about and follow along if you're unfamiliar with all the facets of our typical strategies.

`AddStandardRitterConfiguration` / `UseStandardRitterConfiguration` includes things we **always** want: HTTPS, HSTS, `UseDeveloperExceptionPage()` in development, CORS, FluentValidation, returning HTTP 422 for validation failures, etc. Wondering whether we have handling for multiple instances? `AddRimDevDistributedDataProtection(env, configuration)` covers that with our typical strategy. What special endpoints might be wired up? It's visible inside `UseEndpoints`. Functionality is more discoverable this way.

## Summary

**Individual extension methods give application developers a better opportunity for success as the individiual components can be easily deconstructed as needed.**
