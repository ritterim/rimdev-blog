---
layout: ../layouts/Post.astro
title: "How To Check For Nulls In C# a.k.a. How To Thwart A Super Villian"
date: 2018-09-16 11:53:50
tags:
- c-sharp
- .NET
categories:
twitter_text: "How To Check For #nulls In #csharp a.k.a. How To Thwart A Super Villian @dotnet #dotnetconf #dotnet #null"
authors: Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2794/4320973853_1061948856_b_d.jpg
image_url: https://www.flickr.com/photos/jdhancock/
image_credit: JD Hancock
---

I've been watching [DotNetConf][dotnetconf] videos over the weekend, and was most curious about [Mads Torgersen's][mads] ["What's Coming To C#?" talk][mads-talk]. There are some great features coming to C# 8, but he said something that stuck out to me as a piece of wisdom that seems obvious when you think about it.

## What Is Wrong With This Code?

Take the following code sample. We declare our `Hero` classes and check whether our heroes, Superman and Batman, can save the day. We perform a simple `null` check to see if they are available. What would you expect the outcome to be?

```csharp
var superman = new Hero { Name = "Superman"};
var batman = new Hero { Name = "Batman" };

var heroes = new [] {
    superman,
    batman
};

foreach(var hero in heroes) {
    var hereToSaveTheDay = hero == null
        ? "Oh No!"
        : "Yes!";

    Console.WriteLine(
        $"Can {hero.Name} Save The Day? {hereToSaveTheDay}"
    );
}
```

I bet you would expect the outcome to be the following:

```
Can Superman Save The Day? Yes!
Can Batman Save The Day? Yes!
```

This is what any developer would expect, but what if I told you that our heroes are missing in action? And, what if I told you the outcome was the following?

```
Can Superman Save The Day? Oh No!
Can Batman Save The Day? Oh No!
```

Is it time to panic?!

## The Problem

During his DotNetConf talk, Mads Torgersen stated that you should never use the `==` operator to do `null` checks. The original author of the class, in our case `Hero`, has an oppurtunity to re-implement the behavior of the `==` operator.

```csharp
public static bool operator ==(Hero first, Hero second) {
    if (first is null || second is null) {
        // Be Evil! Super-villiany at its best!
        return true;
    }

    return first.Name == second.Name;
}
```

The code above states, that if *either* side of the equality comparison is `null` then our objects are equal. This logic is counter-intuitive to what we know as developers and can be difficult to debug (if not impossible). So how do we prevent these issues in our own codebase?

# "is" To The Rescue!

To correct the issue above, we should use the `is` operator. This operator cannot be overloaded and changed.

```csharp
foreach(var hero in heroes) {
    var hereToSaveTheDay = hero is null
        ? "Oh No!"
        : "Yes!";

    Console.WriteLine(
        $"Can {hero.Name} Save The Day? {hereToSaveTheDay}"
    );
}
```

This leads us to the outcome we expect from our heroes.

```
Can Superman Save The Day? Yes!
Can Batman Save The Day? Yes!
```

## Conclusion

Most of us take for granted the stable behavior of the `==` operator. A nefarious party could easily change the behavior of something so fundamental. I am also reminded of the productivity suggestions from tools like ReSharper and Visual Studio, which suggest you do a null check in constructors with the `==`. The issue is obvious when you think about it, but most of us probably don't give it a second thought in our daily work.

If you want to play with the Sample above, I've made a [DotNetFiddle here][dotnetfiddle].

[mads]: https://twitter.com/MadsTorgersen
[mads-talk]: https://channel9.msdn.com/Events/dotnetConf/2018/S103
[dotnetconf]: https://www.dotnetconf.net
[dotnetfiddle]: https://dotnetfiddle.net/eog3gB