---
layout: ../layouts/Post.astro
title: Strongly Typed Feature Flags With ASP.NET Core 2.2
date: 2019-04-03 12:30:00
tags:
- .NET
- asp.net core
categories:
- asp.net core
- development
twitter_text: "Strongly Typed Feature Flags With ASP.NET Core 2.2"
authors: Ken Dale
image: https://images.unsplash.com/photo-1547398839-7a55748003e1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2380&q=80
image_url: https://unsplash.com/photos/WZQkwG-tXts
image_credit: Vladimir Mokry
---

Feature flags can be useful for changing the runtime behavior of an application with minimal impact. Having a UI to toggle the feature flags on and off is extra helpful, too!

That said, we built a library to enable this in a strongly typed fashion! Here's what the UI looks like:

![RimDev.AspNetCore.FeatureFlags Screenshot](https://raw.githubusercontent.com/ritterim/RimDev.FeatureFlags/master/screenshot.png){: .img-fluid .border }

## Installation

Install the [RimDev.AspNetCore.FeatureFlags][NuGet link] NuGet package.

```
> dotnet add package RimDev.AspNetCore.FeatureFlags
```

or

```
PM> Install-Package RimDev.AspNetCore.FeatureFlags
```

## Usage

You'll need to wire up `Startup.cs` as follows:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using RimDev.AspNetCore.FeatureFlags;

namespace MyApplication
{
    public class Startup
    {
        private static readonly FeatureFlagOptions options = new FeatureFlagOptions()
            .UseCachedSqlFeatureProvider(@"CONNECTION_STRING_HERE");

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddFeatureFlags(options);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseFeatureFlags(options);

            // IMPORTANT: Controlling access of the UI / API of this library is the responsibility of the user.
            // Apply authentication / authorization around the `UseFeatureFlagsUI` method as needed,
            // as this method wires up the various endpoints.
            app.UseFeatureFlagsUI(options);
        }
    }
}
```

Next, create feature flags like this in the ASP.NET Core assembly:

```csharp
using RimDev.AspNetCore.FeatureFlags;

namespace MyApplication
{
    public class MyFeature : Feature
    {
        // Optional, displays on UI:
        public override string Description { get; } = "My feature description.";
    }
}
```

**Note:** `FeatureFlagAssemblies` to scan can also be configured in `FeatureFlagOptions` if you'd like to scan assemblies other than `Assembly.GetEntryAssembly()`.

**Now you can dependency inject any of your feature flags using the standard ASP.NET Core IoC!**

```csharp
public class MyController : Controller
{
    private readonly MyFeature myFeature;

    public MyController(MyFeature myFeature)
    {
        this.myFeature = myFeature;
    }

    // Use myFeature instance here, using myFeature.Value for the on/off toggle value.
}
```

## UI

The UI wired up by `UseFeatureFlagsUI` is available by default at `/_features`. The UI and API endpoints can be modified in `FeatureFlagOptions` if you'd like, too.

## In closing

We hope this helps you control your applications in production, enabling rapid development while controlling access to new functionality in a controlled manner -- decoupled from your deployments. Enjoy!

[NuGet link]: https://www.nuget.org/packages/RimDev.AspNetCore.FeatureFlags
