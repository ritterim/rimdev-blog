---
layout: post
title: "Fixing ASP.NET Core's UseStatusCodePages Middleware"
date: 2019-08-02 15:30:59
tags:
  - asp.net core
  - static
categories:
  - asp.net core
  - static
twitter_text: "Fixing #aspnetcore UseStatusCodePages #Middleware #error #http @aspnet #dotnet @dotnet"
authors: Khalid Abuhakmeh
image: https://images.unsplash.com/photo-1557600088-30395a91f1ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80
image_url: https://unsplash.com/photos/eipJJ8VX7QE
image_credit: Jeremy Weber
---

Here at RIMdev, we are unapologetic about our love for static websites. Folks, static sites are the future! That said, there are times we need a little dynamic in our lives. For our documentation site, we generate most of the content using Hugo and control access to content utilizing ASP.NET Core. From a user's perspective, while navigating the site, they could see any number of HTTP status errors: 404 Not Found, 403 Forbidden, 500 Internal Server Errors. We wanted to make sure that not only a real user would see these errors, but crawlers and bots would see these errors in the response via HTTP semantics.

## Just Use StatusCodePageMiddleware!

We started here, but found out someone interesting. Using `UseStatusCodePagesWithReExecute`, The middleware always returned a `200 OK` response, even if we were seeing our error page. The incorrect HTTP semantics isn't ideal, as it may send the wrong message to search engine crawlers.

![status code middleware result](/images/asp-net-core-statusmiddleware.png){: .img-fluid .border }

I looked through the implementation, and no mention of `StatusCode` anywhere.

https://github.com/aspnet/AspNetCore/blob/master/src/Middleware/Diagnostics/src/StatusCodePage/StatusCodePagesExtensions.cs

## Well IIS CustomErrors Right?!

I've actually written about using [IIS custom error handling]({% post_url 2019-06-17-hugo-error-pages-with-iis-in-windows-azure %}) and hoped this would work but...nope. The ASP.NET Core Pipeline doesn't defer to IIS and I'm not sure it can. If you know what the issue is here, I'd love to know.

## Custom Middleware

The easiest approach was to write custom middleware. The following code is our current implementation. It can be enhanced to handle a collection of status codes and display an appropriate error page.

```c#
/// <summary>
/// This writes the page out into the response using the
/// status code of the error that was generated (400,500,etc).
/// </summary>
/// <param name="app"></param>
/// <param name="filePath">The error page (based in wwwroot)</param>
/// <returns></returns>
/// <exception cref="ArgumentNullException">File path cannot be null</exception>
/// <exception cref="ArgumentException">File must exist</exception>
public static IApplicationBuilder UseErrorPages(
    this IApplicationBuilder app,
    string filePath)
{
    if (app == null)
        throw new ArgumentNullException(nameof (app));

    var env = app.ApplicationServices.GetService<IHostingEnvironment>();
    var file = Path.Combine(env.WebRootPath, filePath);

    if (!File.Exists(file))
        throw new ArgumentException("file does not exist", nameof(filePath));

    app.Use(async (context, next) =>
    {
        await next.Invoke();

        var handled = context.Features.Get<ErrorPageFeature>();
        var statusCode = context.Response.StatusCode;
        if (handled == null && statusCode >= 400)
        {
            var page = await File.ReadAllTextAsync(file);
            context.Response.Clear();
            context.Response.StatusCode = statusCode;

            await context.Response.WriteAsync(page);

            // make sure we don't get into an infinite loop
            context.Features.Set(new ErrorPageFeature());
        }
    });

    return app;
}

private class ErrorPageFeature
{
}
```

The thing I love about writing middleware in ASP.NET Core is the introduction of Features. We use our feature as an indicator that the error was handled and to prevent an infinite loop.

To use the middlware, just call it in your `Startup` file and pass it a static error page. In our instance we only have one error page (but are planning to have more).

```c#
app.UseErrorPages("404.html");
```

And it works!

![status code middleware working](/images/asp-net-core-statusmiddleware-working.png){: .img-fluid .border }

Hope you found this helpful, and I'd be happy to hear if you have a better solution.
