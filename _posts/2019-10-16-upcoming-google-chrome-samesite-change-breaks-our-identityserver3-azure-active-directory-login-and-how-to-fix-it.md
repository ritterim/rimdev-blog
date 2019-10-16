---
layout: post
title: "Upcoming Google Chrome SameSite Change Breaks Our IdentityServer3 Azure Active Directory Login (and, how to fix it!)"
date: 2019-10-16 10:00:00
tags:
- .NET
categories:
- development
twitter_text: "Upcoming @googlechrome SameSite Change Breaks Our IdentityServer3 Azure Active Directory Login (and, how to fix it!) #dotnet"
authors: Ken Dale
image: https://images.unsplash.com/photo-1505804363897-fc0d2b6bbf51?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/Y_J0phaFy2g
image_credit: Jad Limcaco
---

According to [https://www.chromestatus.com/feature/5088147346030592](https://www.chromestatus.com/feature/5088147346030592) at the time of this blog post Chrome 80 is targeted to default cookies to `SameSite=Lax` when `SameSite` is not specified. This change breaks our staff logins that are powered by IdentityServer3 delegating to Azure Active Directory.

The focus of this change is more security by default. And, in this case, **this new default doesn't work with our staff logins**.

## How to test

Paste `chrome://flags/#same-site-by-default-cookies` and `chrome://flags/#cookies-without-same-site-must-be-secure` into the Google Chrome address, enable each setting, and try it out. They're both slated to be enabled in Chrome 80 -- might as well test both at once!

## Fix

In our case, we set `SameSite=None` to our cookies to ensure the same historical behavior continues to happen. We can accomplish this with an OWIN middleware:

```csharp
using Microsoft.Owin;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YourNamespaceHere
{
    // Adapted from
    // https://stackoverflow.com/a/45110996/941536
    // answering
    // https://stackoverflow.com/questions/38954821/preventing-csrf-with-the-same-site-cookie-attribute
    // and
    // https://gist.github.com/mkropat/e98bf09be76f7bea9cca91aa21b725de
    public class CookieSameSiteNoneMiddleware : OwinMiddleware
    {
        public CookieSameSiteNoneMiddleware(OwinMiddleware next)
            : base(next)
        { }

        public override async Task Invoke(IOwinContext context)
        {
            context.Response.OnSendingHeaders(x =>
            {
                var scv = context.Response.Headers.FirstOrDefault(h => h.Key == "Set-Cookie");
                if (!scv.Equals(default(KeyValuePair<string, string[]>)))
                {
                    var cookieValues = context.Response.Headers.GetValues("Set-Cookie");
                    var updatedValues = cookieValues.Select(v => v + $"; SameSite=none").ToArray();
                    context.Response.Headers.SetValues("Set-Cookie", updatedValues);
                }
            }, null);

            await Next.Invoke(context);
        }
    }
}
```

Then, use it in **Startup.cs** as:

```csharp
using Owin;

namespace YourNamespaceHere
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Register the middleware prior to IdentityServer3
            app.Use(typeof(CookieSameSiteNoneMiddleware));
        }
    }
}
```

Now, test it out and see if it works!

## Note

This works for our limited scope of IdentityServer3 on ASP.NET full framework. If you have cookies that have `SameSite` already specified this code may be problematic as well.
