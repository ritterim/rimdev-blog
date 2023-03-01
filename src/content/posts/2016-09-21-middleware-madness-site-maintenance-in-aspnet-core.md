---
title: "Middleware Madness: Site Maintenance In ASP.NET Core"
slug: middleware-madness-site-maintenance-in-aspnet-core
date: 2016-09-21 14:01:37
tags:
- Middleware Madness
- ASP.NET Core
- Middleware
categories: Middleware Madness
twitter_text: "Middleware Madness: Site Maintenance in #aspnetcore"
authors:
- Khalid Abuhakmeh
- Bill Boga
image : https://farm9.staticflickr.com/8124/8626759432_e0095b32ca_k_d.jpg
image_url: https://www.flickr.com/photos/istolethetv/
image_credit : istolethetv
---

Ideally, we would never have to take our site offline to do maintenance. All of our deployments would happen smoothly, and we could transition seamlessly into our new set of features. Once in a while it just isn't possible, and we have to stop our users from interacting with our application. With IIS, you can drop an `app_offline.htm` file in the root of your site, but this requires the deployment of a file to your production environment. It works, but it isn't great.

Maintenance mode doesn't just affect your users, but also may impact potential users via SEO crawlers. According to [this post from Yoast.com](https://yoast.com/http-503-site-maintenance-seo/), crawlers expect to see an HTTP status code of `503`.

> you have to send a 503 status code in combination with a Retry-After header. Basically you’re saying: hang on, we’re doing some maintenance, please come back in X minutes. That sounds a lot better than what a 404 error says: “Not Found”. A 404 means that the server can’t find anything to return for the URL that was given.

Given that information and the necessary maintenance of a site, we decided to write middleware for support instances.

```csharp
public class MaintenanceMiddleware
{
    private readonly RequestDelegate next;
    private readonly ILogger logger;
    private readonly MaintenanceWindow window;

    public MaintenanceMiddleware(RequestDelegate next, MaintenanceWindow window, ILogger<MaintenanceMiddleware> logger)
    {
        this.next = next;
        this.logger = logger;
        this.window = window;
    }

    public async Task Invoke(HttpContext context)
    {
        if (window.Enabled)
        {
            // set the code to 503 for SEO reasons
            context.Response.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
            context.Response.Headers.Add("Retry-After", window.RetryAfterInSeconds.ToString());
            context.Response.ContentType = window.ContentType;
            await context
                .Response
                .WriteAsync(Encoding.UTF8.GetString(window.Response), Encoding.UTF8);
        }
        await next.Invoke(context);
    }
}

public class MaintenanceWindow
{

    private Func<bool> enabledFunc;
    private byte[] response;

    public MaintenanceWindow(Func<bool> enabledFunc, byte[] response)
    {
        this.enabledFunc = enabledFunc;
        this.response = response;
    }

    public bool Enabled => enabledFunc();
    public byte[] Response => response;

    public int RetryAfterInSeconds { get; set; } = 3600;
    public string ContentType { get; set; } = "text/html";
}

public static class MaintenanceWindowExtensions
{
    public static IServiceCollection AddMaintenance(this IServiceCollection services, MaintenanceWindow window)
    {
        services.AddSingleton(window);
        return services;
    }

    public static IServiceCollection AddMaintenance(this IServiceCollection services, Func<bool> enabler, byte[] response, string contentType = "text/html", int retryAfterInSeconds = 3600)
    {
        AddMaintenance(services, new MaintenanceWindow(enabler, response)
        {
            ContentType = contentType,
            RetryAfterInSeconds = retryAfterInSeconds
        });

        return services;
    }

    public static IApplicationBuilder UseMaintenance(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<MaintenanceMiddleware>();
    }
}
```

Using the middleware is straight forward. First register the `MaintenanceWindow` class.

```csharp
services.AddMaintenance(() => true,
             Encoding.UTF8.GetBytes("<div>Doing Maintenance Yo!</div>"));
```

Then register the `MaintenanceMiddleware`.

```csharp
app.UseMaintenance();
```

Things to take into account when using this middleware:

1. It is middleware, and order of registration matters. It will circumvent anything registered after it. If you still want to serve static files from the site while in maintenance mode, register it after the `StaticFileMiddleware`.
2. The maintenance window assumes `HTML` is the default response, but this could also work for an API that returns `JSON`.
3. Encoding is assumed to be `UTF8`, but the code can be modified to support any other encoding type.
4. You need to decide what a valid `Retry-After` period is. By default, we chose `3600` seconds.
5. The `MaintenanceWindow` class needs to be registered with the IoC in ASP.NET Core.
6. Anything in your app can trigger the 'Enabled' boolean, and we would assume most will pick a configuration value.
7. You will need to determine where the response is loaded from. In the example above, we just hardcoded some HTML.

There you have it, may all your maintenance tasks go smoothly and may your SEO be unaffected.
