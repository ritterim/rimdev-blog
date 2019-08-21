---
layout: post
title: "Avoiding ASP.Net Core Configuration Pitfalls With Array Values"
date: 2019-08-21 13:21:39
tags:
  - .NET
  - ASP.NET Core
  - Core
categories:
  - .NET
  - ASP.NET Core
  - Core
twitter_text: "Avoiding @aspnet #aspnetcore #Configuration #Pitfalls With Array Values"
authors: Khalid Abuhakmeh
image: https://images.unsplash.com/photo-1553640627-57a6de3bf0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=2391&q=80
image_url: https://unsplash.com/photos/_aSOc5RT-8U
image_credit: Matt & Chris Pua
---

ASP.NET Core continues to improve on the legacy of the .NET Framework. Our team is impressed with its performance and excited about future possibilities, but change is seldom a smooth transition. In this post, I'll explain a pitfall you may run into using the newest configuration model in .NET Core and options to mitigate the issue.

## Example

Look at the two following configurations for `appSettings.json` and it's production environment copy of `appSettings.Production.json`.

```javascript
// appSettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*",
  "AppSettings" : {
    "Features" : [
      "Normal Feature",
      "Super Secret Feature"
    ]
  }
}
// appSettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  },
  "AppSettings" : {
    "Features" : [
      "Normal Feature"
    ]
  }
}
```

What would you expect the `Production` configuration and values for `AppSettings:Features` to be when run through the configuration builder? What if I told you it was the following?

```text
Hosting Environment: Production
Features Include: Normal Feature, Super Secret Feature
```

Well, it is! How did this happen?

## Explanation

ASP.NET Core's configuration is based on keys, not file structure. In the example, each array item generates a unique key.

```text
Hosting Environment: Production
Features Include: Normal Feature, Super Secret Feature

Keys:
AppSettings:Features:0
AppSettings:Features:1
```

Since configurations build on each other, they are additive and not destructive. Any key not overwritten remains from the previously loaded configuration. In our case, `appSettings.json` array values are not completely overwritten by the array values in `appSettings.Production.json`, just each unique key.

Read more at the [docs sites](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.2).

## Workarounds

There are a few "solutions" but I'm not sure I love any of them.

### Configuration Solution #1

The most natural solution to this problem is **never** store array values in your base configuration. By doing so, you force each environment to set up any necessary settings. The solution works, but it could mean that the development team requires a bit more ceremony to get started or keeping up with configuration changes.

### Configuration Solution #2

Include every position in the array, and make sure your primitive type is nullable. When you get your app setting, you can filter out all null values, and you will have fulfilled the key requirements. In the example above, our configuration would look like this.

```javascript
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*",
  "AppSettings" : {
    "Features" : [
      "Normal Feature",
      null
    ]
  }
}
```

Not great, but it works.

### Style Solution

Just don't use arrays. It's a bummer, but since indexes won't create numeric keys, you'll be able to predict what all the keys will be. Maybe consider a comma-delimited string, as it may work just as well.

### Code Solution

Just don't use the `IConfiguration` construct in the instance you need arrays and build a different configuration mechanism entirely. The code solution is likely the best answer, as you can determine the outcome every single time with little chance of user error.

## Conclusion

Configuration is a communication tool for developers to express intent to each other and into our environments. The way ASP.NET Core's configuration ultimately works with arrays is not intuitive, but understandable after reading the documentation. We'd love to hear from you if you've run into this problem, or have a different solution. Thank you, and I hope you found this post informative and helpful.
