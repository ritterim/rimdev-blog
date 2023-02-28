---
title: "build.cmd: Our Consistent Build Script for Continuous Integration Using TeamCity"
slug: build-cmd-our-consistent-build-script-for-continuous-integration-using-teamcity
date: 2016-03-16 13:00:00
tags:
- Build
- TeamCity
- Windows
authors: 
- Ken Dale
categories:
twitter_text: 'build.cmd: Our Consistent Build Script for Continuous Integration Using TeamCity'
---

On our team TeamCity server we build repositories by default using `build.cmd` in the repository root. This has a few advantages.

One advantage is being able to run *what TeamCity runs* locally. It isn't perfect -- your machine can still be different from the TeamCity build agent. But, it allows running the same commands consistently. This can greatly improve the experience of debugging *works on my machine* issues.

Another advantage is keeping any complex build setup *in the repository*. Files in repositories are versioned and follow the familiar pattern of submitting changes via pull requests.

Here's a simple `build.cmd` to get started *(this one is useful for Node.js, but can be adapted for your needs!)*:

```
@echo Off
pushd %~dp0
setlocal

:Build
call npm install
call npm test

if %ERRORLEVEL% neq 0 goto BuildFail
goto BuildSuccess

:BuildFail
echo.
echo *** BUILD FAILED ***
goto End

:BuildSuccess
echo.
echo *** BUILD SUCCEEDED ***
goto End

:End
echo.
popd
exit /B %ERRORLEVEL%
```

In this case, the build will run `call npm install` and `call npm test` in order. You can modify these steps as necessary.

## TeamCity

When creating a new build configuration for a project, a template can have `build.cmd` usage baked in. This consistency makes it faster and easier to setup a build configuration for new projects.

## Summary

Team members can assume `build.cmd` will be ran for each TeamCity build. Having a consistent build script makes setting up new projects in TeamCity faster and easier, since executing `build.cmd` is included as part of a template. And, if a pull request fails to build unexpectedly a quick `git clean -xdf` and `./build.cmd` can run what the build agent ran!

**`build.cmd` enhances our team development experience by providing consistency.**

*Note: If `build.cmd` works locally and fails on a TeamCity build agent, this post won't help you! :-)*
