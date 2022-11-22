---
layout: ../layouts/Post.astro
title: "Avoiding a LINQ FirstOrDefault mishap"
date: 2019-10-09
tags:
- .NET
- LINQ
categories:
- .NET
- LINQ
twitter_text: "Avoiding a #linq FirstOrDefault mishap"
authors: Bill Boga
image: https://images.unsplash.com/photo-1504930268766-d71549a36ec2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2014&q=80
image_url: https://unsplash.com/photos/dQLgop4tnsc
image_credit: Jaime Street
---

.NET's LINQ library has extension-methods that will return a default-value if not found in a collection. These are a great time-saver if you're not guaranteed to find a match. The usual logic looks something like this:

```csharp
public class Block
{
    public int Id { get; set; }
}

var blocks = new[] { /*...many Block instantiations*/ };

var matchingBlock = blocks.FirstOrDefault(block => block.Id == 1);

if (matchingBlock != null)
{
    // Do the thing...
}
```

### When using these extensions against nullable reference-types, that code-block works fine. But, what if...

```csharp
var numbers = new[] { 0, 1, 2 };

var matchingNumber = numbers.FirstOrDefault(number => number == 3);

if (matchingNumber == null)
{
    // Do the thing...
}
```

### And, you're wondering why it's not *doing the thing*!

I had to remind myself recently that the `OrDefault`-part of those methods does not mean an automatic `null`–it's the `default`-value based on the `T` in the collection. In the prior case, the default-value of `int` is **`0`**.

If we were to rewrite `numbers` as `var numbers = new List<int?>() { 0, 1, 2 };`, then our `null`-check would work as-expected.

### This all equally applies to `SingleOrDefault`!
