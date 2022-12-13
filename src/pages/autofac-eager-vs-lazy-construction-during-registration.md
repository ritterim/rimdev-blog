---
layout: ../layouts/Post.astro
title: "Autofac: Eager vs Lazy Construction During Registration"
date: 2019-10-31 10:00:00
tags:
- .NET
categories:
- development
twitter_text: "Autofac: Eager vs Lazy Construction During Registration (@AutofacIoC #dotnet)"
authors: Ken Dale
image: https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/8Gg2Ne_uTcM
image_credit: 贝莉儿 DANIST
---

[Autofac](https://autofac.org/) is an inversion of control container for .NET. It allows developers to register items and then later use those registrations to inject items into their classes as needed. Not all of the methods are created equal though -- **it's important to differentiate between methods that construct eagerly and those that construct lazily**.

## Here's a code example:

[https://dotnetfiddle.net/6yOJB8](https://dotnetfiddle.net/6yOJB8)

```csharp
using Autofac;
using System;
          
public class Program
{
    private static IContainer Container { get; set; }
    
    public static void Main()
    {
        var builder = new ContainerBuilder();

        builder.RegisterType<MyService1>();         // Lazily constructed
        builder.Register(_ => new MyService2());    // Lazily constructed
        builder.RegisterInstance(new MyService3()); // Eagerly constructed
    
        Container = builder.Build(); // Writes "MyService3 constructed" to console
    }
}

public class MyService1
{
    public MyService1()
    {
        Console.WriteLine($"{nameof(MyService1)} constructed.");
    }
}

public class MyService2
{
    public MyService2()
    {
        Console.WriteLine($"{nameof(MyService2)} constructed.");
    }
}

public class MyService3
{
    public MyService3()
    {
        Console.WriteLine($"{nameof(MyService3)} constructed.");
    }
}
```

In the above case `builder.RegisterType<MyService1>();` and `builder.Register(_ => new MyService2());` are lazily constructed, while `builder.RegisterInstance(new MyService3());` is eagerly constructed. What does this mean? **It means as the Autofac container is being constructed the lazy items don't run while the eager item does.**

An issue can arise if the eager item is expensive -- **the expense to build a dependency eagerly is paid up front**. Maybe that's what you want. Maybe it's not. But, it's important to know what's happening and to make the appropriate decision.

That said, when undecided I recommend lazy over eager. With lazy construction the application should be *ready* faster. And, the dependency might go unused for the entire run of the application, which could increase container construction effort for no later benefit. But, if the dependency must be prewarmed during startup eager is the way to go.
