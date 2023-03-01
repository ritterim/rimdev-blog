---
title: "Strongly Typed Configuration Settings in ASP.NET Core Part II"
slug: strongly-typed-configuration-settings-in-asp-net-core-part-ii
date: 2016-08-05 11:51:28
tags:
- asp.net
- asp.net core
- .net
categories: 
- asp.net
twitter_text: Strongly Typed Configuration Settings in #aspnetcore Part II @dotnet
authors: 
- Khalid Abuhakmeh
image : https://farm5.staticflickr.com/4106/5088588770_0f13d0a3f2_b_d.jpg
image_url : https://www.flickr.com/photos/jungle-jane-pics/
image_credit: Jungle Jane
---

Rick Strahl wrote an [amazing post](https://weblog.west-wind.com/posts/2016/may/23/strongly-typed-configuration-settings-in-aspnet-core) about getting strongly typed configuration objects in ASP.NET Core. The one gripe I have about the approach, by no fault of his, is the proliferation of the interface `IOptions<T>`. Seeing the abstraction in my code feels leaky. This post will show you how to take the strongly typed configuration and directly register it with the `ServicesCollection` in your ASP.NET Core applications.

## The Alternative Solution

Let's take a simple class, which will be hydrated via our strongly typed object. The passing of the `BankSettings` object is an optional step I decided to take. I pass the settings into the constructor as the `Bank` object will be a `Singleton` in my application and I don't want anyone (especially me) accidentally setting the `Bank` properties.

```csharp
public class Bank
{
    public Bank(BankSettings config)
    {
        if (config == null) throw new ArgumentNullException(nameof(config));

        AccountNumber = config.AccountNumber;
        Name = config.Name;
    }

    public Guid AccountNumber { get; protected set; }
    public string Name { get; protected set; }
}
// our serialization target
public class BankSettings
{
    public Guid AccountNumber { get; set; }
    public string Name { get; set; }
}
```

The settings in `appSettings.json` looks like this.

```json
{
  "Bank": {
    "AccountNumber": "765577c4-d5d1-43a0-82a0-14642b23ed81",
    "Name": "Central Bank"
  },
  "Data": {
    "Marten": {
      "ConnectionString": "host=localhost;database=bank;password=marten;username=marten"
    }
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
```

Finally, let's serialize the settings and push the hydrated `Bank` object into our `ServicesCollection`.

```csharp
public static class BankExtensions
{
    public static IServiceCollection AddBank(this IServiceCollection services, IConfigurationRoot configuration)
    {
        var section =
            configuration.GetSection("Bank");
        // we first need to create an instance
        var settings = new BankSettings();
        // then we set the properties 
        new ConfigureFromConfigurationOptions<BankSettings>(section)
            .Configure(settings);
        // then we register the instance into the services collection
        services.AddSingleton(new Models.Bank(settings));

        return services;
    }
}
```

If you followed the post correctly, you should be able to inject the object into your application models without that pesky `IOptions<T>` interface.

![asp.net core strongly typed app settings](/images/aspnet-core-strongly-typed-app-settings.png){: .img-fluid }
