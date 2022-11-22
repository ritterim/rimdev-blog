---
layout: ../layouts/Post.astro
title: Using ASP.NET Core Health Checks With ASP.NET Full Framework
date: 2019-02-12 13:00:00
tags:
- .NET
categories:
- development
twitter_text: "Using ASP.NET Core Health Checks With ASP.NET Full Framework"
authors: Ken Dale
image: https://images.unsplash.com/photo-1516382799247-87df95d790b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1953&q=80
image_url: https://unsplash.com/photos/d9ILr-dbEdg
image_credit: Agence Olloweb
---

[Health checks in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks) are useful for reporting the health of your ASP.NET Core web application. But, this functionality can't directly be used with ASP.NET Full Framework applications.

That's where the [`RimDev.AspNet.Diagnostics.HealthChecks`](https://www.nuget.org/packages/RimDev.AspNet.Diagnostics.HealthChecks) NuGet package steps in -- this package enables an experience similar to ASP.NET Core health checks on the full ASP.NET (non-Core) framework.

**Here's an example usage in an OWIN Startup class:**

```csharp
public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        app.UseHealthChecks(
            "/_health",
            new PingHealthCheck(
                new PingHealthCheckOptions()
                    .AddHost("localhost", 1000)));
    }
}
```

The code is open source, MIT licensed, and available at [https://github.com/ritterim/RimDev.AspNet.Diagnostics.HealthChecks](https://github.com/ritterim/RimDev.AspNet.Diagnostics.HealthChecks) -- let us know what you think!
