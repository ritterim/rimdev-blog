---
title: "Using Stuntman with ASP.NET MVC Video"
slug: using-stuntman-with-aspnet-mvc-video
date: 2017-02-15 09:03:46
tags: 
- video
- stuntman
- OSS
categories:
twitter_text: "Using #stuntman with @aspnet MVC Video"
authors:
- Khalid Abuhakmeh
image: ./images/stuntman-video.png
---

<div style="position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;">
<iframe style="position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;" src="https://www.youtube.com/embed/jRb28bQT6yI" frameborder="0" allowfullscreen></iframe>
</div>

## Transcript

Hello my name is Khalid Abuhakmeh and in this video I'll be presenting an ASP.NET OWIN middleware library designed to ease local authentication development scenarios. This package is better known as Stuntman and is available via NuGet or directly on GitHub.

Before we delve into Stuntman, I'd like to answer three questions about authentication. 

1. How does it work in ASP.NET?
2. How does Stuntman work within these boundaries?
3. And ultimately why you should care?

Authentication is a cornerstone of many modern applications. It is critical to your success as a developer, but it can be cumbersome to set up and get started. It can also be a challenge depending on your authentication mechanism of choice.

So back to the first question, how does authentication work in ASP.NET? Most authentication implementations depend on two interfaces: IPrincipal and IIdentity. More recently Microsoft has introduced IClaimsPrincipal and IClaimsIdentity to further enrich what's already there. As you'll see later in this video, these interfaces are core to the .NET framework and can be used in most scenarios to access common user information like email, name, or roles. 

Considering what I've said so far, it's no surprise that every framework produced by Microsoft and the .NET community uses these interfaces to give developers access to the current user of the application. Here are some examples that are pulled from an ASP.NET MVC application. 

The first is accessing the user in an MVC Action. 

```csharp
/* MVC */
public ActionResult Index() {
    /* used here */
    return Content(User.Identity.Name);
}
```

The second is accessing the user via MVC authorized attribute.

```csharp
/* yep, here too */
[Authorize(Roles="Admin")] 
public ActionResult Secure() {
    return Content("Secure");
}
```

And finally the third example is accessing the user's name in an MVC view.

```html
<div class="username">
    <!-- your views too! -->
    @User.Identity.Name
</div>
```

All three scenarios are leveraging IPrincipal and IIdentity.


Now that we've answered our first question of "how does ASP.NET authentication work?" we begin to explore how Stuntman works to accelerate your local development process. 

So how does Stuntman work? Let's start with your basic ASP.NET MVC example. I'll first start by going into the new project dialog and creating a web application named "BasicExample". Then i'll select MVC as my starter template. Once my application is initialized, I will need to add references via NuGet.

The first reference is OWIN, since we're hosting in ASP.NET MVC application will
need `Microsoft.Owin.Host.SystemWeb`.

```console
> Install-Package Microsoft.Owin.Host.SystemWeb
```
 
The second reference will need is Stuntman. So we'll search for Stuntman on NuGet.

```console
> Install-Package RimDev.Stuntman
```

Once we find Stuntman, we'll just go ahead and install it just like we did with OWIN. Now that we have both Stuntman and OWIN
installed we'll need a `Startup.cs`. The `Startup.cs` class tells OWIN how to configure our asp.net OWIN enabled
MVC application

I've already prepared a `Startup.cs` class which have copied from the GitHub readme of Stuntman. A few things to note about our `Startup.cs`. First, `StuntmanOptions` are created statically at the top of our startup class. Secondly, inside of our configuration method we set up a user in our `StuntmanOptions` users "user 1" with a set of
given claims. Finally, we say `app.UseStuntman()` passing in the Stuntman options to make Stuntman visible to our
UI. 

```csharp
// OWIN Startup class
public class Startup
{
    public static readonly StuntmanOptions StuntmanOptions = new StuntmanOptions();

    public void Configuration(IAppBuilder app)
    {
        StuntmanOptions
            .AddUser(new StuntmanUser("user-1", "User 1")
                .AddClaim("given_name", "John")
                .AddClaim("family_name", "Doe"));
    
            app.UseStuntman(StuntmanOptions);        
    }
}

```

We need to alter our `_Layout.cshtml` file. I first want to start by modifying our home link and exposing our
`Users.Identity.Name` property this will make it easy for us to identify when we are switching users
next. I will navigate to the bottom of the layout file and use the `StuntmanOptions` from our startup class to expose the stuntman UI picker. 

Before running the application, I want to modify our `HomeController` and make sure that we use the `AuthorizeAttribute` on
our `About` action. If Stuntman is configured correctly, it should trigger an authentication challenge. I am applying the role of `Administrator` on our `AuthorizeAttribute`. It is the same role applied to `User 1` in our `StuntmanOptions`.

Now let's start our ASP.NET MVC application with Stuntman. Now that we're running our ASP.NET MVC application, you'll notice the Stuntman UI picker in the bottom left hand corner. You'll also notice `User 1` is available. Another thing to note is that our home link says "hello" because we're currently anonymous and `User.Identity.Name` is not populated yet. Let's pick `User 1` and you'll notice that now says "hello user 1" in the header. This is because Stuntman has logged us in as user one and we are now assuming that identity. As soon as we log out, you'll notice that the header goes back to "hello." We are now annoymous again.

Stuntman can also handle authentication challenges. By navigating to `About`, we are presented with the Stuntman user picker.
At this point we are presented with our users, and since we only have one we go ahead and choose `User 1`, at which point we are navigated to our secure page. Here, I attempt to actually log out while on our secure resource you'll notice that the user picker is shown to us again. Additionally, if I go to the homepage, I'm still logged in as `User 1`.


What you just saw me do was create a new ASP.NET MVC application, installed Stuntman, and exercise a very basic authentication-authorization workflow, all within just a few minutes. At no point did I have to set up an external
identity provider, a database, or even active directory source. 

This brings us to our third and final question "Why you should care about Stuntman?" Like I mentioned at the beginning of this video, authentication is a pillar of modern applications. It is important to have in production but setting up your entire authentication implementation locally can slow down your progress. Stuntman solves this problem beautifully by working within the boundaries set by ASP.NET. It also has the added benefit of being in your code. This allows you and your team members to share common user scenarios. Increase of velocity and improved communication equates to more shipping.


Let's recap. I started this video by describing how authentication works in ASP.NET. It works primarily on the concept of `IPrincipal` and `IIdentity`. Stuntman works within these abstractions by allowing you to set the applications current principal and identity using OWIN middleware and cookie authentication. As you saw, it is easy to setup Stuntman in an existing application. It also helps you and your team accelerate progress around auth use cases with the added benefit of being code-based you can check in common user scenarios and communicate that effectively across projects lifetime.

If you're interested in using Stuntman, it can be installed via [NuGet](https://nuget.org). Additionally you can help contribute by visiting our [GitHub Repository](https://github.com/ritterim/stuntman).


If you enjoyed watching this video please follow me on [Twitter](https://twitter.com/buhakmeh) and be sure
to visit [khalidabuhakmeh.com](http://khalidabuhakmeh.com) and our team blog at [rimdev.io](https://rimdev.io).