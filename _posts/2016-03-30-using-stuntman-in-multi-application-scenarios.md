---
layout: post
title: Using Stuntman in Multi-Application Scenarios
date: 2016-03-30 13:30:00
image:
    src: https://farm4.staticflickr.com/3518/3756271750_627b5b1a80_b_d.jpg
    url : https://www.flickr.com/photos/webzooloo/
    credit : Olivier Porez
tags:
- ASP.NET
- Stuntman
twitter_text: Using Stuntman in Multi-Application Scenarios
authors:
- Ken Dale
- Khalid Abuhakmeh
---

[Stuntman](http://rimdev.io/stuntman/) enables our team to work locally with multi-role ASP.NET applications quickly and easily. Stuntman enables developers to switch users at runtime in their ASP.NET web applications, without manually re-logging in or restarting the application. Users are pre-configured, so any business rules and logic can be carefully arranged in advance.

With the latest release, we've added client/server functionality for user configuration. Now, users can be retrieved from a *server* application to be used in a *client* application.

## Why?

Stuntman was initially designed to work with a single web application in isolation. In our case, we manage many different web applications that share a common set of users, roles, and other claims. The most valuable scenario we are tackling with this new feature is `application` to `api` communication. 

![stuntman graph](/images/stuntman_graph.png){: .img-fluid .border }

In the figure above, you will notice two web applications. Imagine that web application #1 needs to call web application #2's API. We setup users in application #2, specifically API users with *bearer tokens*. Application #1 requests the set of Stuntman users and now recognizes the API users registered in application #2. Now in our development environment we have shared users and shared bearer tokens to make manual testing easier, in addition to our unit tests of course.

Using this feature will definitely make your QA engineers and manual testers happy.

## Set up the server

On the *server* ASP.NET application, setup Stuntman and invoke `EnableServer()`.

```csharp
// OWIN Startup class
public class Startup
{
    public static readonly StuntmanOptions StuntmanOptions = new StuntmanOptions();

    public void Configuration(IAppBuilder app)
    {
        StuntmanOptions
            .EnableServer()
            .AddUser(new StuntmanUser("user-1", "User 1"));

        if (stuntmanShouldBeEnabled) // Determine when Stuntman should be used here.
        {
            app.UseStuntman(StuntmanOptions);
        }
    }
}
```

## Set up the client

Now, setup Stuntman on the *client* application:

```csharp
// OWIN Startup class
public class Startup
{
    public static readonly StuntmanOptions StuntmanOptions = new StuntmanOptions();

    public void Configuration(IAppBuilder app)
    {
        StuntmanOptions
            .AddConfigurationFromServer(
                "https://some-stuntman-enabled-app.example.com/");

        if (stuntmanShouldBeEnabled) // Determine when Stuntman should be used here.
        {
            app.UseStuntman(StuntmanOptions);
        }
    }
}
```

The *client* application will make an HTTP or HTTPS request to the *server* Stuntman enabled ASP.NET application. The *server* application will need to be running to respond to this request. 

## Bonus: Add users from a JSON file

Stuntman can also read JSON users data from the local file system or a web url.

```csharp
StuntmanOptions.AddUsersFromJson("C:\\path\\to\\users.json");
// or
StuntmanOptions.AddUsersFromJson("https://example.com/users.json");
```

The JSON file should look like this:

```json
[
  { "Id": "user-1", "Name": "User 1" },
  { "Id": "user-2", "Name": "User 2" }
]
```

## Conclusion

We use Stuntman in our ASP.NET applications for easy runtime user switching. Now, Stuntman has been enhanced to include client/server functionality -- enabling *clients* to share the same Stuntman users as a *server* application to facilitate app-to-app communication scenarios.
