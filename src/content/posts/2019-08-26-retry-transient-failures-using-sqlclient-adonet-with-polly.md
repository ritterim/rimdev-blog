---
title: Retry Transient Failures Using SqlClient / ADO.NET With Polly
slug: retry-transient-failures-using-sqlclient-adonet-with-polly
date: 2019-08-26 14:00:00
tags:
- .NET
categories:
- development
twitter_text: "Retry Transient Failures Using SqlClient / ADO.NET With Polly"
authors: Ken Dale
image: https://images.unsplash.com/photo-1536936343740-68cb2a95f935?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/2cDIzRnVq0Q
image_credit: Michael Rogers
---

Our team maintains a private package that contains our strategy for database migrations. It runs migrations using FluentMigrator as well as other scripts.

Running SQL statements inside SQL Azure can sometimes result in a transient error. If this happens during startup it can result in a broken ASP.NET Core application, as migrations must succeed before the application can safely start. **To prevent startup failures we want to retry transient SQL Azure failures**.

## Code

First, install [Polly](https://github.com/App-vNext/Polly). Then, use it like this:

```csharp
Policy
    .Handle<SqlException>(
        ex => SqlServerTransientExceptionDetector.ShouldRetryOn(ex))
    .Or<TimeoutException>()
    .WaitAndRetry(5, retryAttempt => // Adjust the retry interval as you see fit
        TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)))
    .Execute(() =>
    {
        // Your code here using SqlConnection, etc.
    });
```

Now, for `SqlServerTransientExceptionDetector` you have 2 options.

- Copy the code from [src/EFCore.SqlServer/Storage/Internal/SqlServerTransientExceptionDetector.cs](https://github.com/aspnet/EntityFrameworkCore/blob/master/src/EFCore.SqlServer/Storage/Internal/SqlServerTransientExceptionDetector.cs) into your project.
  - Required a bit of editing, at least for me *(Update the `SqlClient` using and remove `JetBrains.Annotations` if you aren't using them already)*
  - This assumes you're OK to embed code with Apache License 2.0
- Reference it from the [Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer/) NuGet package.

It does note `SqlServerTransientExceptionDetector` is an internal API, but it works for now. There's an issue to track moving it somewhere else: [https://github.com/dotnet/SqlClient/issues/39](https://github.com/dotnet/SqlClient/issues/39).

I hope this helps make your applications more resilient!
