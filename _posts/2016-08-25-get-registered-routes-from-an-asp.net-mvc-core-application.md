---
layout: post
title: "Get Registered Routes From An ASP.NET MVC Core Application"
date: 2016-08-25 15:29:00
tags:
- ASP.NET Core
- Routes
- MVC
categories: ASP.NET Core
twitter_text: Get Registered Routes From an #aspnetcore application @buhakmeh
authors: Khalid Abuhakmeh
image : https://farm5.staticflickr.com/4011/4300529754_d5c3eea96b_b_d.jpg
image_url: https://www.flickr.com/photos/johanohrling/
image_credit : johrling
---

I will start this post off by saying this may **not** be the best way to get the routes from your ASP.NET Core MVC web application. I am hoping there is a better way, but my current knowledge has led me to this answer. Given you have registered your routes, regardless of method, you should have a `RouteCollection` buried somewhere deep in your running application instance.

The `RouteCollection` is a member of the `RouterMiddleware` that ASP.NET Core uses to determine whether the current request is a match. For good reason, the member is private and passed to you via `RouteData`.

```csharp
// from RouterMiddleware.Invoke
RouteContext context = new RouteContext(httpContext);
context.RouteData.Routers.Add(this._router);
```

Understanding what is happening inside of the `RouterMiddleware`, we should be able to access the router from our MVC Controller. We want the first router that is of type `RouteCollection`. 

```csharp
var routes = RouteData
                .Routers
                .OfType<RouteCollection>()
                .FirstOrDefault();
```

The final step is to display the output in your view.

![asp.net core routes](/images/asp-net-core-routes-output.png){: .img-fluid}

Hope this post helps you debug your routing issues in ASP.NET Core.
