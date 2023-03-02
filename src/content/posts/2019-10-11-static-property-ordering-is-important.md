---
title: "Ordering of static fields in C# matters"
slug: static-property-ordering-is-important
date: 2019-10-09
tags:
- C#
categories:
- C#
twitter_text: "Ordering of static fields in #csharp matters"
authors: 
- Bill Boga
image: https://images.unsplash.com/photo-1534190239940-9ba8944ea261?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80
image_url: https://unsplash.com/photos/NL_DF0Klepc
image_credit: Cesar Carlevarino Aragon
---

I never thought ordering of relational static fields and properties in C# mattered. And, then, I started getting [NREs](https://docs.microsoft.com/en-us/dotnet/api/system.nullreferenceexception?view=netcore-3.0) on a property I know was set to a static-instance...

## The setup

```csharp
public static void Main()
{
    Console.WriteLine(Person.Empty == null); // prints 'True'
}

public class Person
{
    public static readonly Person Empty = empty;

    private static readonly EmptyPerson empty = new EmptyPerson();
}

public sealed class EmptyPerson : Person { }
```

If you were to step-through the code, the first-time `Person.Empty` is called, `empty` is `null` and gets returned as-is. *Then*, `empty` is initialized. But, it's too late since `Empty` is static and will only get "initialized" once. But, if we swap the ordering...

```csharp
public class Person
{
    private static readonly EmptyPerson empty = new EmptyPerson();

    public static readonly Person Empty = empty;
}
```

Now, `empty` is an instance of `EmptyPerson` when `Empty` is called and everything is good.

## Variations

The problem above is only a problem for `static` **fields/properties**. If either were to be an expression-member, then ordering doesn't matter:

```csharp
public class Person
{
    public static readonly Person Empty => empty;

    private static readonly EmptyPerson empty = new EmptyPerson();
}

// This variation also works...
public class Person
{
    public static readonly Person Empty = empty;

    private static readonly EmptyPerson empty => new EmptyPerson();
}
```

### Then, there's the obvious...

```csharp
public class Person
{
    public static readonly Person Empty = new EmptyPerson();
}
```

*But, I opted to use the `private` member in several other spots within my code...*

### But, don't do this!

Just as a final warning, don't do this because while you have a `getter`-only (i.e. readonly), you'll also create a new instance of `EmptyPerson` every time `Empty` is called. 🤯

```csharp
public class Person
{
    // Don't do this!
    public static Person Empty => new EmptyPerson();
}
```
