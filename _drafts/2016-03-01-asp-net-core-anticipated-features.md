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
  - Ken Dale
---

## Build Process Tooling (Ken Dale)

For our current .NET command line build scripts we use MSBuild. While it does the job, it's heavy on the XML and not the most approachable technology.

The future ASP.NET Core provides opportunity for a renewal of build scripts and tooling. I'd like to see .NET build scripts and command line tooling become on-par with typical [Node.js](https://nodejs.org/en/) projects, in terms of awesomeness per line of configuration.

Want to run a test suite? Produce a code coverage report? Run static analysis or a linter? Ideally everything will be easily pluggable, lowering the bar for adding awesome functionality.
