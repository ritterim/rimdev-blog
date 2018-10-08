---
layout: post
title: "C# Inheritance Errors You Could Miss"
date: 2018-10-07 12:39:17
tags:
- csharp
- bugs
categories:
- csharp
- bugs
twitter_text: "#csharp inheritance errors you could miss. @dotnet #netcore"
authors: Khalid Abuhakmeh
image: https://farm2.staticflickr.com/1515/25863130911_6f86f22866_k_d.jpg
image_url: https://www.flickr.com/photos/kateed/
image_credit: Kate Russell
---

C# being an Object Oriented Programming (OOP) language, we have access to inheritance. Like any feature of a programming language, you should use it appropriately and understand how to use it. In this post, I'll show you some code that may be easy to get past a code review but cause some strange behavior. Ready?

```csharp
using System;
                    
public class Program
{
    public static void Main()
    {
        Shape shape = new Square();
        Console.WriteLine($"The shape is {shape.Name}");
    }

    public abstract class Shape
    {
        public string Name {get;set;} = @"¯\_(ツ)_/¯";
    }

    public class Square: Shape
    {
        public new string Name {get;set;} = "Square";
    }
}
```

What would you expect the output to be? If you guess the following, then you are correct.

```console
The shape is ¯\_(ツ)_/¯
```

Why did this happen? While we are using inheritance on our `Square` class, we can't actually override the `Name` property. We attempted to "fix" the extensibility of our base class by using the `new` keyword. The issue is that our `new` keyword only works when accessing our `Square` type. When our `Square` type is cast to `Shape`, the compiler will be accessing the `Name` from our `Shape` class. **The polymorphic behavior we expected can't and won't happen.**

What's the fix? If you own the base class, you need to set the `virtual` keyword on your base class.

```csharp
    public abstract class Shape
    {
        public virtual string Name {get;set;} = @"¯\_(ツ)_/¯";
    }
```

On your inherited class, be sure to use the `override` keyword.

```csharp
    public class Square: Shape
    {
        public override string Name {get;set;} = "Square";
    }
```

## Conclusion

Inheritance is an important pillar of OOP, but it is important to recognize what you can extend, and when you may be causing issues for yourself. The `new` keyword has its place, but understand that polymorphic behavior can be broken and cause issues with unexpected outcomes and null reference exceptions. Seasoned developers may understand this, but developers just getting into .NET development will likely be bitten by this bug.

[Play with the sample here](https://dotnetfiddle.net/OYGu9P).