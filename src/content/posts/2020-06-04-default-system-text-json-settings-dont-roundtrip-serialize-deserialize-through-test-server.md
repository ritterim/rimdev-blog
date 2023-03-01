---
title: "ASP.NET Core 3.1: Default System.Text.Json Settings Don't Roundtrip (Serialize/Deserialize) Through Test Server"
slug: default-system-text-json-settings-dont-roundtrip-serialize-deserialize-through-test-server
date: 2020-06-04 10:00:00
tags:
  - asp.net core
categories:
  - asp.net core
  - development
twitter_text: "ASP.NET Core 3.1: Default System.Text.Json Settings Don't Roundtrip (Serialize/Deserialize) Through Test Server #dotnet #dotnetcore #aspnetcore"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1509130298739-651801c76e96?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/dcL8ESbsGis
image_credit: Dan Schiumarini
---

We've spotted some strange behavior before with ASP.NET Core and JSON serialization/deserialization, and I eventually made it back to trying out some scenarios.

One thing I've noticed is the default `System.Text.Json` settings don't roundtrip (that is, serialize and deserialize) through the ASP.NET Core 3.1 TestServer (without additional configuration).

**The underlying issue is by default there's a character case mismatch.**

## Making It Work

One way to make it work is setting the property names case insensitive when deserializing the response:

```csharp
var responseObj = JsonSerializer.Deserialize<TestObject>(strContent, new JsonSerializerOptions
{
    // Required for test to pass, by default
    // there's a case mismatch that isn't automatically handled
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    // or
    // PropertyNameCaseInsensitive = true
});
```

Alternatively, we could update the character case to match expectations via an attribute (`[JsonPropertyName("StringValue")]`) on each property.

## In Closing

A test associated with this post is at [https://github.com/kendaleiv/AspNetCoreJsonTests/blob/9c57b5425c8bac5bbb4440f676110e0dfc6fb75d/UnitTest1.cs#L51-L93](https://github.com/kendaleiv/AspNetCoreJsonTests/blob/9c57b5425c8bac5bbb4440f676110e0dfc6fb75d/UnitTest1.cs#L51-L93).
