---
layout: ../layouts/Post.astro
title: "Swagger Grouping With Controller Name Fallback Using Swashbuckle.AspNetCore"
date: 2020-06-18 12:00:00
tags:
  - asp.net core
categories:
  - asp.net core
  - development
twitter_text: "Swagger Grouping With Controller Name Fallback Using Swashbuckle.AspNetCore #aspnetcore"
authors: Ken Dale
image: https://images.unsplash.com/photo-1559633971-067394f325da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/N6rZ1wHTRgM
image_credit: Melinda Martin-Khan
---

We've been using [Swagger](https://swagger.io/) via [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle) for some time with our ASP.NET Full Framework applications. As we're moving toward ASP.NET Core we encountered some difficulty in achieving the same grouping behavior with ASP.NET Core using [Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) as we had with ASP.NET Full Framework.

Since `[ResourceGroup("Custom Group Name")]` is no longer applicable we can use `[ApiExplorerSettings(GroupName = "Custom Group Name")]`, along with the following code that includes a fallback when the `GroupName` is not explicitly set:

## Code

Add this to `ConfigureServices` in your ASP.NET Core `Startup` class:

```csharp
services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    c.TagActionsBy(api =>
    {
        if (api.GroupName != null)
        {
            return new[] { api.GroupName };
        }

        var controllerActionDescriptor = api.ActionDescriptor as ControllerActionDescriptor;
        if (controllerActionDescriptor != null)
        {
            return new[] { controllerActionDescriptor.ControllerName };
        }

        throw new InvalidOperationException("Unable to determine tag for endpoint.");
    });
    c.DocInclusionPredicate((name, api) => true);
});
```

Now, optionally decorate controllers like:

```csharp
[ApiController]
[ApiExplorerSettings(GroupName = "Custom Group Name")]
public class MyController : ControllerBase
{
    // ...
}
```

Hope that helps!
