---
layout: post
title: "Building .Net Core On Travis CI"
date: 2016-10-26 13:20:49
tags:
- .NET Core
- CI
- Travis CI
categories: Development
twitter_text: "Building #aspnetcore on @travisci"
authors: Khalid Abuhakmeh
image: https://farm4.staticflickr.com/3831/14120933297_089ce68cf7_o_d.jpg
image_url: https://www.flickr.com/photos/mvegmond/
image_credit: kweetniet2012
---

[.NET Core][dotnet] is a cross-platform runtime, and if you play your developer cards right, you can take advantage of running your application on Windows, macOS, and Linux. We enjoy writing many open source projects. Sometimes we opt to use our internal TeamCity CI server and other times we use [Travis CI][travis] for more transparency.  This post will help you get your .NET Core application building in Travis CI by showing you the files you need in your publicly accessible Git repository.

## Build.sh

You need a build script to the root of our repository for Travis CI to execute. It is quite simple.

```
#!/usr/bin/env bash
dotnet restore && dotnet build **/project.json
```

You can add additional steps to the `build.sh` to run tests, but this is the simplest command you need.

## .Travis.yml

The `.travis.yml` is used by the service to construct your build environment. Add this to the root of your repository.

```
language: csharp
dist: trusty
sudo: required
mono: none
dotnet: 1.0.0-preview2-003121
script:
  - ./build.sh --quiet verify
```

We do a few things in the configuration file:

- set the language to `csharp`
- set the linux distribution to `trusty`
- allow for `sudo` access
- turn off `mono`; we are running .NET Core now
- select the dotnet container
- execute our build script

Note, we could forgo calling our `build.sh` file and put the calls to `dotnet` in the script section of our configuration. We chose not to in this case. The Trusty version of Ubuntu is 14.04. Ubuntu 16.04 was released back in April of 2016, but Travis CI does not support it yet. Travis CI default distribution is 12.04, which is not supported by the .NET Core installer.

## Conclusion

After adding the files, you can follow this [basic tutorial](tut) to setting up your project. If everything goes right, you should have a successful build on Travis CI. It really takes very little effort and will help your contributors know if they broke the application.

[dotnet]: https://dot.net
[travis]: https://travis-ci.org
[tut]: https://docs.travis-ci.com/user/for-beginners
