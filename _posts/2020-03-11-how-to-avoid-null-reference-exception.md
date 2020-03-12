---
layout: post
title: "How to avoid NullReferenceException in C#"
date: 2020-03-11 03:57:07
tags:
- .NET
- C#
categories:
- development
twitter_text: How to avoid NullReferenceException in C#
authors: Cheng Yang
image: https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80
image_url: https://unsplash.com/photos/9SoCnyQmkzI
image_credit: Jefferson Santos
---

I have been working as a software developer for almost three years, the most common exception or bug I made is [NullReferenceException](https://docs.microsoft.com/en-us/dotnet/api/system.nullreferenceexception?view=netframework-4.8) -`System.NullReferenceException: Object reference not set to an instance of an object.` This exception is thrown when you try to access any properties / methods/ indexes on a type of object which points to null. 

## Common Scenario 1:

```csharp
using System; 
public class Program
{
    public static void Main()
    {
       string dog = null;
	   var value = dog.ToString(); //Object reference not set to an instance of an object
   	   Console.WriteLine(value);
    }
}
```
In the example above, we try to call the `ToString()` method, it will throw a `NullReferenceException` because `dog` is pointing to null.

## Common Scenario 2:
```csharp
using System;

public class Dog
{
    public string Breed { get; set; }
    public int Age { get; set; }
}

public class Dogs
{
    public Dog Dog { get; set; }
}

public class Example
{
    public static void Main()
    {
        Dogs dog1 = new Dogs();
        int dogAge = dog1.Dog.Age; // Object reference not set to an instance of an object
	   
        Console.WriteLine(dogAge.ToString());  
    }
}

```
In the example above, you will get `NullReferenceException` because `Dogs` property is null, there is no way to get the data.

## Solutions:
`NullReferenceException` can be very frustating during development, so how can we avoid `NullReferenceException`?

The solution is very simple, you have to check for every possible null exception property before accessing instance members.

Here are few useful methods:

**Method 1** - use `if` statement

Check the property before accessing instance members.

```csharp
If (dogs == null)
{
 // do something
}
```

**Method 2** - use [Null Conditional Operator](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/member-access-operators#null-conditional-operators--and-)(`?`) 

It will check the property before accessing instance members.

```csharp
int? dogAge = dog1?.Dog?.Age;
```

**Method 3** - use [GetValueOrDefault()](https://docs.microsoft.com/en-us/dotnet/api/system.nullable-1.getvalueordefault?view=netframework-4.8) 

It will set a default value if the value is null.

```csharp
int dogAge = Age.GetValueOrDefault();
```

**Method 4** - use [Null Coalescing Operator](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator) 

You can set a custom value by using `??` if the value is null

```csharp
var DefaultAge = 5;
int dogAge = dog1?.Dog?.Age ?? DefaultAge
```

**Method 5** - use [?: operator](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/conditional-operator)

```csharp
var DefaultAge = 5;
var IsDogAgeNull = dog1?.Dog?.Age == null;

int dogAge = IsDogAgeNull ?  DefaultAge : dog1?.Dog?.Age;
```
 C# 8 brings a pretty neat featre - [Nullable reference types] (https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references) to solve the `NullReferenceException` issue.

You will need to add the follow code into `<PropertyGroup>` in your `.csproj`
```xml
<LangVersion>8.0</LangVersion>
<NullableContextOptions>enable</NullableContextOptions>
```
and then you can do something like 
```csharp
Dog? dog = null; // nullable enable
```


I hope you found this post helpful, and let me know if you have another good way to handle the `NullReferenceException`.
