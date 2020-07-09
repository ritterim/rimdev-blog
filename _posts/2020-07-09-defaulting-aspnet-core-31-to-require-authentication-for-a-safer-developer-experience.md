---
layout: post
title: "Defaulting ASP.NET Core 3.1 To Require Authentication For A Safer Developer Experience"
date: 2020-07-09 9:00:00
tags:
  - asp.net core
categories:
  - asp.net core
  - development
twitter_text: "Defaulting ASP.NET Core 3.1 To Require Authentication For A Safer Developer Experience #aspnet #aspnetcore"
authors: Ken Dale
image: https://images.unsplash.com/photo-1519973759984-cf5a6c557cd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/_we0BQQewBo
image_credit: Masaaki Komori
---

Typically with ASP.NET Core 3.1 when no specific authorization requirements are set all endpoints are publicly accessible. When you're working with an *authenticated required* system the burden is on the developer to remember to use `[Authorize]` attributes everywhere appropriate. **This can lead to bugs by omission -- and, could result in a serious data breach.**

## Solution

**For a safe-by-default experience we can require authentication when no specific instructions are set.**

```csharp
namespace MyWebApplication
{
    public class Startup
    {
        private static readonly string PublicAuthorizationPolicy = "PublicPolicy";

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRouting();
            services.AddAuthentication();
            services.AddAuthorization(options =>
            {
                options.AddPolicy(
                    PublicAuthorizationPolicy,
                    new AuthorizationPolicyBuilder()
                        .RequireAssertion(_ => true)
                        .Build());

                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                // Allow public access for a health check
                endpoints.MapHealthChecks("/_health")
                    .RequireAuthorization(PublicAuthorizationPolicy);

                // Everything that doesn't explicitly allow
                // anonymous users requires authentication.
                endpoints.MapControllers();
            });
        }
    }
}
```

At least one assertion is required when configuring an auth policy. We can satisfy this requirement while enabling public access via `RequireAssertion(_ => true)` -- always allow everyone.

## Summary

Safe-by-default authentication and authorization is a good strategy, especially when the consequences for making a mistake are severe. **We can make ASP.NET Core 3.1 safe-by-default by authenticating all requests by default, while still maintaining a way to create public endpoints as needed.** With public endpoints explicitly defined mistakes can't be made by *forgetting to do something*.
