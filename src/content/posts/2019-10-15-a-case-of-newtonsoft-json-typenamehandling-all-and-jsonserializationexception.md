---
layout: post
title: "A Case Of Newtonsoft.Json, TypeNameHandling.All, And JsonSerializationException"
date: 2019-10-15 10:00:00
tags:
- .NET
categories:
- development
twitter_text: "A Case Of Newtonsoft.Json, TypeNameHandling.All, And JsonSerializationException #dotnet"
authors: Ken Dale
image: https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/4F4B8ohLMX0
image_credit: Jingda Chen
---

Our [RimDev.FeatureFlags](https://www.nuget.org/packages/RimDev.AspNetCore.FeatureFlags/) library uses [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) as part of roundtripping the on/off state in SQL. With that we use [TypeNameHandling.All](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_TypeNameHandling.htm) to serialize the type information as well. Putting aside the [security concerns](https://www.alphabot.com/security/blog/2017/net/How-to-configure-Json.NET-to-create-a-vulnerable-web-API.html) of this approach *(basically, don't allow user input)*, there's another issue you could run into: **The serialized type no longer being available**.

When `JsonConvert.DeserializeObject(feature.Value, jsonSerializerSettings);` runs and the matching type does not exist in a `TypeNameHandling.All` scenario a `JsonSerializationException` is thrown!

## Best fix: Just don't read it 😸

As a preliminary fix I caught all exceptions and ignored them in [https://github.com/ritterim/RimDev.FeatureFlags/pull/36](https://github.com/ritterim/RimDev.FeatureFlags/pull/36). Using exceptions for control flow isn't great so it was enhanced to filter these types out via [https://github.com/ritterim/RimDev.FeatureFlags/pull/37](https://github.com/ritterim/RimDev.FeatureFlags/pull/37).

```csharp
features = features
    .Where(x => cache.TryGetValue(x.Key, out var cachedFeature) && cachedFeature != default)
    .ToDictionary(x => x.Key, x => x.Value);
```

By filtering the results with a LINQ `Where` to only the types available (in this case, the values in `cache` are hydrated with all the available types) we don't attempt to deserialize a type that no longer exists. The database record still exists, but we simply avoid reading it.

## Demonstration

[https://dotnetfiddle.net/rAHNs1](https://dotnetfiddle.net/rAHNs1)

```csharp
using Newtonsoft.Json;
using System;
          
public class Program
{
    private static JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings
    {
        TypeNameHandling = TypeNameHandling.All
    };
  
    public static void Main()
    {
        var person = new Person
        {
            Name = "John Doe"
        };
        
        var serialized = JsonConvert.SerializeObject(person, jsonSerializerSettings);
        
        Console.WriteLine(serialized);
        
        try
        {
            JsonConvert.DeserializeObject(
                @"{""$type"":""Person, abcdefgh.exe"",""Name"":""John Doe""}",
                jsonSerializerSettings);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{ex.GetType().Name}: {ex.Message}");
        }	
    }
}

public class Person
{
    public string Name { get; set; }
}
```

**Output:**

```
{"$type":"Person, abcdefgh.exe","Name":"John Doe"}
JsonSerializationException: Error resolving type specified in JSON 'Person, abcdefgh.exe'. Path '$type', line 1, position 31.
```

*Note: .NET Fiddle assigns a random process name, I changed it to `abcdefgh.exe` throughout.*
