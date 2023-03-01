---
title: Augmenting IPrincipal when using IdentityServer authentication middleware in ASP.NET Core
slug: augmenting-principal-identityserver-net-core
date: 2019-05-29 12:00:00
tags:
- ASP.NET Core
- IdentitySever
- Authentication
categories:
- development
twitter_text: "Augmenting IPrincipal when using IdentityServer authentication middleware in ASP.NET Core"
authors: 
- Bill Boga
---

This post covers augmenting an authenticated `User` for use in middleware or when using the `[Authorize]`-attribute in an MVC-controller. **There is an important pitfall to avoid which will produce unexpected results**, which I'll cover towards the end. Here's a baseline setup:

### Startup.cs

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services
            .AddAuthentication()
            .AddIdentityServerAuthentication();

        services
            .AddAuthorization(options =>
            {
                options.AddPolicy("Bearer", policy =>
                {
                    policy.RequireAuthenticatedUser();
                });
            });

        services.AddMvc();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        app
            .UseAuthentication()
            .UseMvc();
    }
}
```

### Controller

```csharp
[ApiController]
public class TestController : ControllerBase
{
    [Route("/test")]
    [Authorize(Policy = "Bearer")]
    public IActionResult Get()
    {
        return Ok();
    }
}
```

## What does this do?

When a request comes in for `/test`, the `[Authorize]`-attribute says to apply the rules in the policy named `Bearer`–which for now only lets authenticated users access.

## Updating the policy

Rather than only requiring an authenticated-user, let's add an additional requirement for a claim:

```csharp
options.AddPolicy("Bearer", policy =>
{
    policy
        .RequireAuthenticatedUser()
        .RequireClaim("action", "test:read");
});
```

Making the same call now will result in a `403`. But, what if this claim doesn't come from IdentityServer? Rather, it comes from some other service. In `Startup.Configure`, we can insert a custom piece of middleware:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app
        .UseAuthentication()
        .Use(async (context, next) =>
        {
            var authenticateResult = await context.AuthenticateAsync("Bearer");

            if (authenticateResult.Succeeded)
            {
                // This creates a new `IPrincipal` disconnected from the policy-authentication pipeline.
                var principal = new ClaimsPrincipal(new ClaimsIdentity(authenticateResult.Principal.Identity));

                /**
                 * var principal = authenticateResult.Principal;
                 * would maintain reference to original pipeline `IPrincipal` so changes would persist.
                 * However, this will lead to duplicate claims.
                 * Read the section about `IClaimsTransformation`...
                 */

                // Pretend we made a call to a service to get a list of claims for the user...
                (principal.Identity as ClaimsIdentity).AddClaim(new Claim("action", "test:read"));

                context.User = principal;
            }

            await next();
        })
        .UseMvc();
}
```

Because this middleware runs before MVC, the `User` when the policy is evaluated has the required claim and the request is successful. Let's go one-step further and limit this policy to the same `AuthenticationScheme` setup by IdentityServer: `Bearer` (ref. [here](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation/blob/946f39c76ddf3af4d47a5f0d55802aab1d6fa045/src/IdentityServerAuthenticationExtensions.cs#L25) and [here](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation/blob/0bba2fafd47e2307bce3ac5987211acb701ed2df/src/IdentityServerAuthenticationDefaults.cs#L14)):

```csharp
options.AddPolicy("Bearer", policy =>
{
    policy
        .AddAuthenticationSchemes("Bearer")
        .RequireAuthenticatedUser()
        .RequireClaim("action", "test:read");
});
```

Run the same test again... and we get a `403` 😢. This would also happen if we defined the scheme in the controller-action attribute:

```csharp
[ApiController]
public class TestController : ControllerBase
{
    [Route("/test")]
    [Authorize(AuthenticationSchemes = "Bearer", Policy = "Bearer")] // will cause a `403` due to the inclusion of `Scheme`.
    public IActionResult Get()
    {
        return Ok();
    }
}
```

## Pitfall 🕳️

![avoiding pitfalls](https://media.giphy.com/media/YtVbi2FChp5BK/giphy-downsized-large.gif)
*avoiding pitfalls...*

Why does this happen? The call to `AddIdentityServerAuthentication` sets up an authentication handler: [IdentityServerAuthenticationHandler](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation/blob/f37d5d7afe84bbe8d8f91a7d575f60a4f6c33278/src/IdentityServerAuthenticationHandler.cs). This class is derived from [AuthenticationHandler](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Security/Authentication/Core/src/AuthenticationHandler.cs). The latter [saves the result of the call](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Security/Authentication/Core/src/AuthenticationHandler.cs#L163-L171) made to the former in a private variable (`Task<AuthenticateResult>`) and references this variable for [subsequent calls](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Security/Authentication/Core/src/AuthenticationHandler.cs#L138). Therefore, the user we augmented in middleware gets overwritten when the policy rules are applied.

Maybe we could use reflection to set the variable and coax things to work. Our new middleware could look like this:

```csharp
.Use(async (context, next) =>
{
    var authenticateResult = await context.AuthenticateAsync("Bearer");

    if (authenticateResult.Succeeded)
    {
        var principal = authenticateResult.Principal;

        // Pretend we made a call to the service to get a list of claims...
        (principal.Identity as ClaimsIdentity).AddClaim(new Claim("action", "test:read"));

        context.User = principal;

        var authHandler = app.ApplicationServices.GetRequiredService<IdentityServerAuthenticationHandler>();
        var task = new Task<AuthenticateResult>(() => AuthenticateResult.Success(new AuthenticationTicket(context.User, "Bearer")));
        var property = authHandler.GetType().GetField("_authenticateTask", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);

        property?.SetValue(authHandler, task);
    }

    await next();
})
```

Looking at the value of `property`, however, you'll notice it will be `null`. But, how can this be if `authenticateResult.Succeeded` is `true`? If you follow the setup of `AddIdentityServerAuthentication`, you'll get to [here](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation/blob/946f39c76ddf3af4d47a5f0d55802aab1d6fa045/src/IdentityServerAuthenticationExtensions.cs#L69) and finally to [AuthenticationBuilder](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Security/Authentication/Core/src/AuthenticationBuilder.cs#L44). Because `IdentityServerAuthenticationHandler` is registered as `Transient`, you'll get a different instance each time it's requested 😭.

## What can we do?

![nothing](https://media.giphy.com/media/nYogYgSmIJaIo/giphy.gif)
*nothing?*

The infrastructure doesn't currently support specifying `AuthenticationScheme` if augmenting the `User` is needed. **Any modifications will exist up until the MVC-pipeline, however**.

## Why not use `IClaimsTransformation`?

This is a valid alternative. However, this also presents a potential for duplicate claims unless a new `ClaimsPrincipal` and `ClaimsIdentity` is used within the transformation. *Personal preference: I'd like to see the option of each authentication-handler having its own transformer instead of one "global" transformer*. The transformation is used when [a call to authenticate is successful](https://github.com/aspnet/AspNetCore/blob/0ef9993f46bff1ea7a9c4cc7c9fa6f603d065d20/src/Http/Authentication.Core/src/AuthenticationService.cs#L70-L74):

### Startup.cs

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddTransient<IClaimsTransformation, DefaultClaimsTransformation>();
}
```

### ClaimsTransformation

```csharp
public class DefaultClaimsTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        // ☢️ Using the same `principal` will cause duplicate claims...
        // (principal.Identity as ClaimsIdentity)?.AddClaim(new Claim("action", "test:read"));

        var newPrincipal = new ClaimsPrincipal(new ClaimsIdentity(principal.Identity));

        (newPrincipal.Identity as ClaimsIdentity).AddClaim(new Claim("action", "test:read"));

        return Task.FromResult(newPrincipal);
    }
}
```

You lose a bit of control when augmenation occurs, but if that's not a problem in your app., then this is a viable alternative.

## Bonus!

### Why do we even need to manually authenticate when using `.UseAuthentication()` middleware?

When authentication middleware runs, only request-handler schemes and the default-scheme are used to [pre-load `User`](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Security/Authentication/Core/src/AuthenticationMiddleware.cs#L42-L59). In our case, `IdentityServerAuthenticationHandler` does not implement (or derive from something that implements) [`IAuthenticationRequestHandler`](https://github.com/aspnet/AspNetCore/blob/v2.2.2/src/Http/Authentication.Core/src/AuthenticationSchemeProvider.cs#L148-L152). If your setup of `AddAuthentication` sets the default-scheme to `Bearer`, then you should be set as far as `User` is concerned, but the other pitfall still applies.

## Any parting ideas?

You could copy [everything here](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation/tree/946f39c76ddf3af4d47a5f0d55802aab1d6fa045/src) and implement in your app. Add your additional logic [before this line](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation/blob/946f39c76ddf3af4d47a5f0d55802aab1d6fa045/src/IdentityServerAuthenticationHandler.cs#L71) and your changes will persist even when using `policy.AddAuthenticationSchemes`. **BUT, this is not recommended by me (or anyone) 😜**.
