---
layout: ../layouts/Post.astro
title: Getting route data in your ASP.NET Core middleware
date: 2019-02-21 8:30:00
tags:
- ASP.NET Core
- Routing
- Middleware
categories:
- development
twitter_text: "Getting route data in your ASP.NET Core middleware"
authors: Bill Boga
image: https://farm7.staticflickr.com/6072/6150010367_a773d906a4_b.jpg
image_url: https://flic.kr/p/anspPv
image_credit: Chiararts
---

## Requirement

  - ASP.NET Core [2.2](https://dotnet.microsoft.com/download/dotnet-core/2.2) or [3.0](https://dotnet.microsoft.com/download/dotnet-core/3.0)

## Why can't I do this in earlier versions?

Read [ASP.NET Core 2.2 First Look – Endpoint Routing ](https://www.stevejgordon.co.uk/asp-net-core-first-look-at-global-routing-dispatcher) and [ASP.NET Core updates in .NET Core 3.0 Preview 2](https://devblogs.microsoft.com/aspnet/aspnet-core-3-preview-2/) to get a more-detailed picture on how routing is now exposed in relation to ASP.NET Core.

### TL;DR

Routing has traditionally been a construct confined within the ASP.NET ecosystem. As long as your code executes within that construct, you can read route data. However, with the proliferation of middleware that run before and after ASP.NET, the desire/need for an app.-wide, exposed routing system increased.

## The 🗝️ to making this work

### ASP.NET Core 2.2

```csharp
using Microsoft.AspNetCore.Internal;

public class Startup
{
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        app
            .UseEndpointRouting() // Registering this prior to your middleware unlocks the ✨.
            //.YourMiddleware()
            .UseMvc();
    }
}
```

### ASP.NET Core 3.0 (preview-2)

```csharp
using Microsoft.AspNetCore.Builder;

public class Startup
{
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        app
            .UseRouting() // Registering this prior to your middleware unlocks the ✨.
            //.YourMiddleware()
            .UseMvc();
    }
}
```

## Example

*Imagine you're building a new blog engine...* 🤔

💡 Maybe you want to pre-load a post via middleware so it's available anywhere down the chain. This way, none of other middleware is concerned with **how** to retrieve the post and can instead focus on whatever it does to augment the response.

### Model

```csharp
public class Post
{
    public string Slug { get; set; }
    public string Title { get; set; }
}

/// <summary>
/// We need a derivative class to support scenarios where we can't find a `Post`-record based on {slug}.
/// DI will throw an exception if we try to give it `null`.
/// </summary>
public class GenericPost : Post
{ }
```

### Razor view

```html
@page "{slug}"
@model PostModel

<h1>@Model.Title</h1>
...
```

### Razor view code
```csharp
public class PostModel : BaseModel
{
    public PostModel(Post post)
    {
        this.post = post;
    }

    public Post post { get; private set; }

    public void OnGet()
    { }
}
```

### Middleware

```csharp
public class PostMiddleware
{
    public PostMiddleware(
        RequestDelegate next,
        IDatabase database)
    )
    {
        this.next = next;
        this.database = database;
    }

    private readonly IDatabase datbase;
    private readonly RequestDelegate next;

    public async Task InvokeAsync(HttpContext context)
    {
        var route = context.GetRouteData();

        if (route.Values.TryGetValue("slug", out var routeSlug))
        {
            var slug = routeSlug.ToString();
            var post = (await database.Fetch<Post>()).FirstOrDefault(x => x.Slug == slug);

            if (post != null)
            {
                context.Items.Add(nameof(Post), post);
            }
        }

        await next(context);
    }
}
```

### Startup

ℹ️ *This could also be refactored into a separate extension-method.*

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddScoped<Post>(serviceProvider =>
    {
        var accessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();

        if (accessor.HttpContext.Items.TryGetValue(nameof(Post), out var post))
        {
            return post as Post;
        }
        else
        {
            return new GenericPost(); // we need to return something that is either a `Post` or derivative of `Post`.
        }
    });
}
```

## References

Here are a couple source-links for both the 2.2 and 3.0-versions if you're interested in what happens behind the scenes:

### ASP.NET Core 2.2

  - [UseEndpointRouting](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Http/Routing/src/Internal/EndpointRoutingApplicationBuilderExtensions.cs#L17-L24)
  - [GetRouteData](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Http/Routing.Abstractions/src/RoutingHttpContextExtensions.cs#L19-L28)

### ASP.NET Core 3.0

  - [UseRouting](https://github.com/aspnet/AspNetCore/blob/v3.0.0-preview-19075-0444/src/Http/Routing/src/Builder/EndpointRoutingApplicationBuilderExtensions.cs#L24-L59)
  - [GetRouteData](https://github.com/aspnet/AspNetCore/blob/v3.0.0-preview-19075-0444/src/Http/Routing.Abstractions/src/RoutingHttpContextExtensions.cs#L19-L28)