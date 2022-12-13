---
layout: ../layouts/Post.astro
title: "Handling User Defined SQL Exceptions in C# 7"
date: 2018-05-04 11:38:48
tags:
- development
- CSharp
- sql
categories:
twitter_text: "Handling User Defined #SQL Exception in #csharp 7 @dotnet"
authors: Khalid Abuhakmeh
image: https://farm9.staticflickr.com/8015/7107789557_e07f30d8fa_o_d.jpg
image_url: https://www.flickr.com/photos/patloika/
image_credit: Tony Moore | Pat Loika
---

Let's say you are developing a new `Infinity War` SQL stored procedure. [Thanos](https://en.wikipedia.org/wiki/Thanos), your boss, has explicity told you to add validation to a stored procedure and warn developers of their impending doom. To halt the execution of the stored procedure, you may decide to `THROW` an exception like so:

```sql
;THROW 50001,'I know what it''s like to lose; to feel so desperately that you''re right, yet fail all the same.',1;
```

Note that the line of SQL throws a `50001` which denotes the error as being user defined. Now, to deal with those developers.

In C#, we can use pattern matching to catch the `SqlException` and convert it into a helpful message.

```csharp
try {
    // Execute SQL Command
} catch (SqlException e) 
  when (e.Number == 50001) {
      return new ThanosQuoteResult(e.Message);
  }
```

Note that you want to look at the `Number` property on a `SqlException` and not the `ErrorCode`.