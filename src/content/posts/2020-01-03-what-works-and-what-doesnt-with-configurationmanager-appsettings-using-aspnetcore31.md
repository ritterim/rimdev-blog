---
title: "What Works and What Doesn't With ConfigurationManager.AppSettings Using ASP.NET Core 3.1"
slug: what-works-and-what-doesnt-with-configurationmanager-appsettings-using-aspnetcore31
date: 2020-01-03 10:00:00
tags:
- .NET
categories:
- development
twitter_text: "What Works and What Doesn't With ConfigurationManager.AppSettings Using ASP.NET Core 3.1"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1494423500016-801283cf7eeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/7aGbdAhEbKg
image_credit: Joe Roberts
---

`ConfigurationManager` has long been used by .NET Framework developers prior to .NET Core to access things like app settings and connection strings. By including the [System.Configuration.ConfigurationManager](https://www.nuget.org/packages/System.Configuration.ConfigurationManager/) NuGet package one can get existing code to compile on .NET Core 3.1 *(netcoreapp3.1)*, but it may not work as you'd expect.

**Simply put, the only location I was able to read an app setting locally was from `app.config`. `appsettings.json` and `web.config` did not seem to work.**

## Startup.cs

```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", async context =>
    {
        var str = ConfigurationManager.AppSettings["myApp:setting1"]; // null
        var str2 = ConfigurationManager.AppSettings["abc"];           // null
        var str3 = ConfigurationManager.AppSettings["test"];          // null
        var str4 = ConfigurationManager.AppSettings["webconfigtest"]; // null
        var str5 = ConfigurationManager.AppSettings["appconfigtest"]; // "abc"

        await context.Response.WriteAsync("");
    });
});
```

## web.config

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <appSettings>
    <add key="webconfigtest" value="abc" />
  </appSettings>
</configuration>
```

## app.config

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <appSettings>
    <add key="appconfigtest" value="abc" />
  </appSettings>
</configuration>
```

## appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "abc": "123",
  "myApp": {
    "setting1": "abc"
  },
  "appSettings": {
    "test": "123"
  }
}
```
