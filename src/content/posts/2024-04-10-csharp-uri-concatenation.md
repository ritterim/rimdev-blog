---
title: "C# URI Concatenation"
slug: csharp-uri-concatenation
date: 2024-04-10
tags:
- C#
categories:
- C#
twitter_text: "C# URI Concatenation"
authors: 
- Bill Boga
---

The `Uri` class in C# has a constructor that takes a `Uri baseUri` and `string relativeUri`. However, you may not get the expected, concatenated `Uri`, unless you know how certain situations are handled (*I was recently tripped-up by this* 😉).

## Quiz

Given the following code:

```csharp
Uri baseUri = new Uri("https://www.example.com/api");
Uri result = new Uri(baseUri, "v1/helloworld"); // https://www.example.com/api/v1/helloworld
```

What's the value of `result`? If you said `"https://www.example.com/api/v1/helloworld"`, then you are... **not** correct 😲! While it may seem a bit counterintuitive, `relativeUri` gets applied "relative" to the canonical-version of `baseUri`. [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) has a lot of info. on URI syntax – short-version for us specific to this issue is to know that a URI-path needs to end with a trailing-slash.

## How to get the expected output

### Add trailing-slash to `baseUri`

```csharp
Uri baseUri = new Uri("https://www.example.com/api/");
Uri result = new Uri(baseUri, "v1/helloworld");
```

⚠ *Remember, though, if `relativeUri` has a leading-slash, then we're opting for an ["absolute path"](https://datatracker.ietf.org/doc/html/rfc3986#section-3.3) and will concatenate relative to *`baseUri`*.`Host`. So, the following has the same result as our original code:*

```csharp
Uri baseUri = new Uri("https://www.example.com/api/"); // `result` is the same regardless of trailing-slash.
Uri result = new Uri(baseUri, "/v1/helloworld"); // https://www.example.com/v1/helloworld
```

### What about `string.Join`?

If you're looking for something without needing to verify leading or trailing slashes, then this approach *could* work. But, some servers may not like redundant slashes, so test appropriately. Given this helper-method:

```csharp
Uri ConcatenateUris(Uri baseUri, Uri relativeUri) => new Uri(string.Join("/", [ baseUri.ToString(), relativeUri.ToString() ]));
```

and this setup:

```csharp
Uri baseUri = new Uri(baseInput);
Uri relativeUri = new Uri(relativeInput, UriKind.Relative);

Uri result = ConcatenateUris(baseUri, relativeUri);
```

Then, here's a breakout of `result`:

|`baseInput`|`relativeInput`|`result`|
|:---:|:---:|:---:|
|https://www.example.com/api|v1/helloworld|https://www.example.com/api/v1/helloworld|
|https://www.example.com/api/|v1/helloworld|https://www.example.com/api//v1/helloworld|
|https://www.example.com/api|/v1/helloworld|https://www.example.com/api//v1/helloworld|
|https://www.example.com/api/|/v1/helloworld|https://www.example.com/api///v1/helloworld|

## Recommendations?

If you have hard-coded values, then I'd opt for adding the trailing-slash to `baseUri`. If you are using app. settings ***and*** you want resiliency, then something like `ConcatendateUris` could work.
