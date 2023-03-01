---
title: "Get Current Route Name From ASP.NET Web API Request"
slug: get-current-route-name-from-aspnet-web-api-request
date: 2017-02-17 08:35:39
tags: 
- Web API
- ASP.NET
categories:
twitter_text: "Get current route name from @aspnet #webapi request"
authors: 
- Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2815/9215457745_5c488b2e23_b_d.jpg
image_credit: Victor Solanoy
image_url: https://www.flickr.com/photos/vsolanoy/
---

At RIMdev, we are attempting to layer Hypermedia concepts into our APIs. One of these concepts is to have a collection of links to related resources on our responses. While on face value it may seem simple to generate links, it can be daunting given the many options you have to do so. We have decided to leverage the current Web API infrastructure and `UrlHelper` to more consistently generate links and adapt to our architectural changes. We even wrote a NuGet package called [SupUrlative](https://github.com/ritterim/supurlative) that makes it really easy to do so.

```csharp
var generator = new Generator(httpRequestMessage);
var result = generator.Generate("routeName", request);

result.Url;
result.Template;
```

Note that SupUrlative needs a routename. In most instances, the route name is obvious. In some instances of code reuse, you'll need to dynamically understand where you are in the code and ask the question.

> What route am I currently on?

Take the following controller action for example.

```csharp
[HttpGet, HttpPost]
[Route("", Name = "SearchIndex")]
public async Task<IHttpActionResult> Index(SearchIndexRequest request)
{
    //... code goes here
}
```

We have already decorated our action with the route name. Using that string again is redundant and prone to errors. There is a better approach.

```csharp
[HttpGet, HttpPost]
[Route("", Name = "SearchIndex")]
public async Task<IHttpActionResult> Index(SearchIndexRequest request)
{
    var generator = new Generator(httpRequestMessage);
    // Our extension method to get the current route name: "SearchIndex"
    var routeName = url.GetCurrentRouteName();
    var result = generator.Generate(routeName, request);
}
```

Here is the code for that extension method.

```csharp
public static class UrlHelperExtensions
{
    public static string GetCurrentRouteName(this UrlHelper url)
    {
        object value;
        var dataTokens = url.Request.GetRouteData().Route.DataTokens;

        return dataTokens.TryGetValue("RouteName", out value)
            ? value.ToString()
            : null;
    }
}
```