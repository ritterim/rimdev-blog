---
layout: post
title: Anticipated features of upcoming ASP.NET Core 1.0
date: 2016-03-01 13:30:00
description: Team input asking for their most-anticipated feature of upcoming ASP.NET Core 1.0
tags:
  - ASP.NET Core 1.0
categories: Development
twitter_text:
authors:
  - Team
---

## Build Process Tooling (Ken Dale)

For our current .NET command line build scripts we use MSBuild. While it does the job, it's heavy on the XML and not the most approachable technology.

The future ASP.NET Core provides opportunity for a renewal of build scripts and tooling. I'd like to see .NET build scripts and command line tooling become on-par with typical [Node.js](https://nodejs.org/en/) projects, in terms of awesomeness per line of configuration.

Want to run a test suite? Produce a code coverage report? Run static analysis or a linter? Ideally everything will be easily pluggable, lowering the bar for adding awesome functionality.

## Routing Middleware (Khalid Abuhakmeh)

I am a routing connoisseur, ever since shedding the restraints of WebForm development for the purity of MVC web applications. Routing is the **most** significant architectural decision of modern web applications, and seeing the advances in **ASP.NET Core 1.0** is exciting. More often than not, it is the primary way the external world communicates with our internal implementation. The ASP.NET team's decision to make routing a middleware concern opens up developers to more holistic scenarios that were not previously available under MVC5, WebAPI, and WebForms. The introduction of the [`IRouter`](https://github.com/aspnet/Routing/blob/dev/src/Microsoft.AspNetCore.Routing.Abstractions/IRouter.cs) interface allows almost any code to respond to a request, regardless of framework choice (or lack there of).

To learn more about the *new* routing, I recommend reading this [great post by Matthew Abbott](http://www.inversionofcontrol.co.uk/asp-net-core-1-0-routing-under-the-hood/).