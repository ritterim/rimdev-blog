---
layout: post
title: "Find Numbers In A C# String"
date: 2018-04-18 09:55:53
tags:
- development
categories:
- development
twitter_text: "Find #numbers in a #csharp #string @dotnet"
authors: Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2502/4562380001_7284ca6d6d_b_d.jpg
image_url: https://www.flickr.com/photos/fdecomite/
image_credit: fdecomite
---

Data can often be messy and cleaning it up falls on the shoulders of you, the developer. It's also easy to search StackOverflow for complex regular expression solutions. In this post I'll show you an easy one liner to get all numbers from a string.

Let's start with the value.

```csharp
var value = "hello world 12345";
```

As you can see, it has a mix of alpha and numeric characters. What we want, is a string that only contains the digits `12345`.

Let's use some LINQ!

```csharp
var result = string.Concat(value.Where(Char.IsDigit));
```

The resulting output is:

```terminal
"12345"
```

The full solution being is below.

```csharp
using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var value = "hello 12345";
        var result = string.Concat(value.Where(Char.IsDigit));
        Console.WriteLine(result);
    }
}
```

Try it out on [DotNetFiddle](https://dotnetfiddle.net/vzLPEa). This will perform better than a **RegEx** solution. Hope you found it helpful :)