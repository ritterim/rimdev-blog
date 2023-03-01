---
title: "ASP.NET Core 3.1: Newtonsoft.Json Issues With Enumerable.Empty<T> Assignment"
slug: newtonsoft-json-issues-with-enumerable-empty-t-assignment
date: 2020-06-05 8:00:00
tags:
  - asp.net core
categories:
  - asp.net core
  - development
twitter_text: "ASP.NET Core 3.1: Newtonsoft.Json Issues With Enumerable.Empty<T> Assignment #dotnet #dotnetcore #aspnetcore"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1526041092449-209d556f7a32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/pcGLNRCICnA
image_credit: Tyler Callahan
---

We've spotted some strange behavior before with ASP.NET Core and JSON serialization/deserialization, and I eventually made it back to trying out some scenarios.

One thing we've noticed is `Newtonsoft.Json` having issues with `Enumerable.Empty<T>()` assignments. We typically assign `IEnumerable<T>` items with a starting (empty, itemless) collection to avoid a potential `null`.

When ran directly it throws a `JsonSerializationException`. When ran through `TestServer` it returns a **400 Bad Request**.

## A fix

A fix, as mentioned by [Bill Boga](/authors/bill-boga/) and demonstrated via tests (see [https://github.com/kendaleiv/AspNetCoreJsonTests/commit/8a538f8a6d8d32b68c4eb331dddee9792ada8372](https://github.com/kendaleiv/AspNetCoreJsonTests/commit/8a538f8a6d8d32b68c4eb331dddee9792ada8372)), is to install the `Newtonsoft.Json` package manually, even if it's not absolutely necessary for the project to compile.

## Workaround

We can change all usages of `Enumerable.Empty<T>()` to something else, like `new List<T>()`, `Array.Empty<T>()`, etc. This makes everything *just work* the way you'd expect.

## In Closing

Tests associated with this post are at:

- [https://github.com/kendaleiv/AspNetCoreJsonTests/blob/9c57b5425c8bac5bbb4440f676110e0dfc6fb75d/UnitTest1.cs#L40-L49](https://github.com/kendaleiv/AspNetCoreJsonTests/blob/9c57b5425c8bac5bbb4440f676110e0dfc6fb75d/UnitTest1.cs#L40-L49)
- [https://github.com/kendaleiv/AspNetCoreJsonTests/blob/9c57b5425c8bac5bbb4440f676110e0dfc6fb75d/UnitTest1.cs#L95-L128](https://github.com/kendaleiv/AspNetCoreJsonTests/blob/9c57b5425c8bac5bbb4440f676110e0dfc6fb75d/UnitTest1.cs#L95-L128)
