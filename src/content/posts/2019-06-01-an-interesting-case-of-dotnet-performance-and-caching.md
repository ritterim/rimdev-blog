---
title: "An Interesting Case Of .NET Performance and Caching"
slug: an-interesting-case-of-dotnet-performance-and-caching
date: 2019-06-01 17:20:13
tags:
- .NET
- Performance
categories:
- .NET
- Performance
twitter_text: "an interesting case of @dotnet #performance and #caching #aspnet #azure #appinsights"
authors: 
- Khalid Abuhakmeh
- Bill Boga
image: https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80
image_url: https://unsplash.com/photos/5E5N49RWtbA
image_credit: Cody Davis
---

Several months ago, Bill Boga and I, realized there was a performance enhancement we could make in our infrastructure. We were utilizing IdentityServer and took notice that many of our APIs were validating many of the same access tokens and storing the results in memory locally. Validating access tokens can be relatively expensive due to additional web requests and CPU intensive hash calculations. If we could cache the validation results, and share the validation results across our system, then we could reduce the work necessary to get a request through our APIs.

We decided to write a `RedisTokenCache` as a shared cache provider for access tokens, which you can see below. Since Redis deals with strings, we used JSON.NET to serialize to a string and deserialize back to the original type. SHIP IT!

```csharp
public class RedisTokenCache : ICache
{
    public RedisTokenCache(ConnectionMultiplexer connection)
    {
        database = connection.GetDatabase();
    }

    private readonly IDatabase database;

    public bool Add(string key, object value, DateTimeOffset absoluteExpiration)
    {
        return database.StringSet(key, JsonConvert.SerializeObject(value), (absoluteExpiration - DateTimeOffset.UtcNow));
    }

    public object Get(string key)
    {
        var value = database.StringGet(key);

        return string.IsNullOrEmpty(value)
            ? null
            : JsonConvert.DeserializeObject(value);
    }
}
```

During this time, we also upgraded our servers, so we naturally got a performance boost, which at the time we incorrectly attributed to our _optimization_.

Recently, we noticed in Application Insights that our access tokens were validated more than we wanted, and it was causing performance degradation. After our investigation (mostly Bill), we realized something serious. Our cache was not working!

Our investigation led us to several problems with our cache implementation:

1. The `Claim` class is serializable to JSON, but cannot be deserialized due to a [lack of empty public constructor](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim.-ctor?view=netframework-4.8).
2. JSON.NET silently adjusted the `IEnumerable<Claim>` to a JArray, so we were still getting a cache hit.
3. IdentityServer assumed that any value could be implicitly cast to an `IEnumerable<Claim>` using the `as` keyword.

By the time IdentityServer received the validation result, it was `null` and forced us to validate the token every time.

What's the fix? A better cache implementation.

```csharp
public class RedisTokenCache : ICache
{
    public RedisTokenCache(ConnectionMultiplexer connection)
    {
        database = connection.GetDatabase();
        settings = new JsonSerializerSettings {
            TypeNameHandling = TypeNameHandling.All,
            Converters = new List<JsonConverter> {
                new ClaimConverter()
            }
        };
    }

    private readonly IDatabase database;
    private readonly JsonSerializerSettings settings;

    public bool Add(string key, object value, DateTimeOffset absoluteExpiration)
    {
        return database.StringSet(key,
            JsonConvert.SerializeObject(value, settings),
            (absoluteExpiration - DateTimeOffset.UtcNow)
        );
    }

    public object Get(string key)
    {
        var value = database.StringGet(key);

        return string.IsNullOrEmpty(value)
            ? null
            : JsonConvert.DeserializeObject(value, settings);
    }
}
```

To solve this issue, we enhanced our cache with several improvements:

1. Use `TypeNameHandling.All` which includes `Type` information with our JSON. The change allows JSON.NET to make better deserialization decisions.
1. Write a `ClaimConverter` to address the lack of public constructor on the `Claim` class.

## Conclusion

The bug was evident once we started debugging locally. It was harder to see the issue in Windows Azure because our memory metrics and cache hits around Redis showed the service "worked." Our problems happened on reads in our app. IdentityServer's [`InMemoryValidationResultCache`](https://github.com/IdentityServer/IdentityServer3.AccessTokenValidation/blob/0ea60670ecb40edae3c3fd5192d7d008c87251df/source/AccessTokenValidation/Plumbing/InMemoryValidationResultCache.cs#L108) assumed any cache hit was a good hit, which hid the issue instead of failing immediately.

```csharp
/// <summary>
/// Retrieves a validation result
/// </summary>
/// <param name="token">The token.</param>
/// <returns></returns>
public Task<IEnumerable<Claim>> GetAsync(string token)
{
    var result = _cache.Get(token);

    if (result != null)
    {
        return Task.FromResult(result as IEnumerable<Claim>);
    }

    return Task.FromResult<IEnumerable<Claim>>(null);
}
```

In our case, the cached result was a `JArray`, but the code assumes it will always be an `IEnumerable<Claim>` which will turn our value into a `null`.

What's the moral of this story?

1. Trust what you see in your analysis, not what you _think_ should be happening.
1. When caching data, be sure that you can `serialize` and `deserialize` the values.
1. Just because you were able to get a value back from the cache, don't assume it's the _right_ value or the right type.
1. Bugs can exist in the smallest of classes.
1. Test, Test, Test, and then Test.

It's always fun finding these kinds of bugs because it means the apps we build will be better for it.
