---
layout: ../layouts/Post.astro
title: "ASP.NET Core Razor Pages and HTTP Status Control Flow"
date: 2019-01-21 08:16:34
tags:
- asp.net
- asp.net core
- razor
categories:
- asp.net
- asp.net core
twitter_text: "#aspnetcore #razor pages and #http status control flow @aspnet @dotnet #development"
authors:
- Khalid Abuhakmeh
- Bill Boga
image: https://farm6.staticflickr.com/5245/5216625122_d91032b0cf_b_d.jpg
image_url: https://www.flickr.com/photos/fireflythegreat/
image_credit: Dagny Mol
---

I, Khalid Abuhakmeh, recently wrote about my [Razor Pages first impressions][khalid] and am mostly positive about the addition to the ASP.NET Core technology stack. Bill Boga and I are currently rewriting a site that can benefit from the technology but thought it might be limited when dealing with control flow. Take this example of a `PageModel.OnGet` action.

```c#
public class IndexModel : PageModel
{
    Database db;
    public Post Post {get;set;}
    public IndexModel(Database db) {
        this.db = db;
    }
    public void OnGet(int id)
    {
        Post = db.Posts.Find(id);
    }
}
```

The `OnGet` action attempts to find a `Post`, but it may not find it based on the `id`. In a traditional ASP.NET MVC application we should return a `NotFound` result if the post is not present in our database.

What if I told you Razor Pages is no different? Let's rework our `OnGet` method.

```c#
public class IndexModel : PageModel
{
    Database db;
    public Post Post {get;set;}
    public IndexModel(Database db) {
        this.db = db;
    }
    public IActionResult OnGet(int id)
    {
        Post = db.Posts.Find(id);
        // http status control flow
        if (Post == null)
            return NotFound();
        return View();
    }
}
```

In the example there are three parts to take note of:

1. `IActionResult` is now the return of `OnGet` and not `void`.
1. We can now return `IActionResult` types like `NotFoundResult` and `ViewResult`.
1. The action needs to return an `IActionResult`.

Razor Pages will respect the `IActionResult` return types and allow you to control flow with HTTP status codes, giving you the simplicity of Razor Pages and the power of ASP.NET MVC.

[khalid]: https://www.khalidabuhakmeh.com/my-asp-net-core-razor-pages-first-impressions