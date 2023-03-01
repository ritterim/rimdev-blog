---
title: "Why We Use Nullables On Our ASP.NET Web API 2 Requests"
slug: why-we-use-nullables-on-our-aspnet-web-api-2-requests
date: 2017-08-09 08:20:14
tags:
- asp.net
- WebAPI
- REST
categories:
twitter_text: "Why we use #nullables on our @aspnet #Webapi requests #REST"
authors: 
- Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2840/33888154296_5266f71f9b_o_d.jpg
image_url: https://www.flickr.com/photos/144152028@N08/33888154296/
image_credit: airpix
---

At Ritter Insurance Marketing, we continue to invest heavily in Web APIs primarily built on top of [ASP.NET Web API 2](https://www.asp.net/web-api). To supplement our APIs, we also make client libraries available to our other applications. These client libraries hold request and response objects that help reduce the duplication across our ecosystem.

As we were building a new endpoint, [Cheng Yang](https://twitter.com/YangCzy50), another developer, asked:

> Why are some of the primitive types on the request object `nullable`?

In our case, primitives include:

- `bool`
- `int`
- `double`
- `DateTime` and `DateTimeOffset`

## Signaling Intent

We build most of our endpoints to accept JSON. The JSON passed in then goes through a model binding process that maps a JSON request into our C# representation. That's great, but we lose one thing: **intent**.

For example, take these three JSON requests:

```json
{  }
{  "count" : null }
{  "count" : 0    }
```

When mapped to this C# object we get something that is logically equivalent:

```csharp
public class HelloWorldRequest {
    public int Count { get;set; }
}
```

Which results in a `Count` value of `0`. The value of our C# request object does not reflect the callers intent. 

## Why Should We Care?

When we use `Nullable<T>` on our request, we get a tri-state property.

- `null': the requester forgot to set this field.
- incorrect value:  the requester set the wrong value.
- correct value: the requester knows what they are doing.

This tri-state attribute of `Nullable` allows us to respond to the requester with more meaningful validation messages.

```
- "You forgot to set 'Count' on the request."
- "'0' is an invalid value for 'Count'."
```

In our previous example, our request would change:

```csharp
public class HelloWorldRequest {
    public int? Count { get;set; }
}
```

## Advanced State Management

Nullables work for us the majority of the time, but if you want to get advanced, you can hook directly into Web API 2 model binding. We did this for our `PATCH` implementation, which you can read in our series entitled ["Extending Patch Support For ASP.NET Web API."]({% post_url 2016-03-22-extending-patch-support-for-asp.net-webapi-part-i %})]

## Conclusion

Requests are the conduit between our requesters and us, and it is important to keep as much fidelity around intent as we possibly can. Nullables on our request objects help due to their tri-state behavior. The practice allows us to respond with more meaningful validation messages, helping our users diagnose and speed up development. In this case, nulls are a good thing.