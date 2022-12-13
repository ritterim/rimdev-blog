---
layout: ../layouts/Post.astro
title: Publishing npm Packages From TeamCity
date: 2016-08-26 12:00:00
tags:
  - npm
  - TeamCity
  - ci
image: https://farm1.staticflickr.com/54/147035842_40b4e68e9d_b_d.jpg
image_url: https://www.flickr.com/photos/jacreative/
image_credit: John Ashley
categories:
  - nodejs
  - OSS
twitter_text: "Publishing npm Packages From TeamCity"
authors: Ken Dale
---

Releasing new versions from continuous integration, rather than *someone's machine* in a team environment is a great way to release new versions of npm packages in a predicable and controlled manner.

Here's a quick runthrough for publishing an npm package from TeamCity:

## First, we need a TeamCity build

We'll need the build itself setup on TeamCity. For us, we're currently following a `build.cmd` philosophy for our projects. An example `build.cmd` looks like this:

```
@echo Off
pushd %~dp0
setlocal

:Build
call npm install
if %ERRORLEVEL% neq 0 goto BuildFail

call npm run build
if %ERRORLEVEL% neq 0 goto BuildFail

call npm run validate
if %ERRORLEVEL% neq 0 goto BuildFail

call npm pack
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

**Note the usage of `npm pack`.** This generates the necessary `.tgz` artifact for the package that we can publish to npm.

Simply setup TeamCity to run your **build.cmd**, or however you want to setup your build.

**The important point is ensuring the build artifacts include the `.tgz` file.**

![Build script: Artifact paths](/images/publishing-npm-packages-from-teamcity/build-script-artifact-paths.png)

## Publishing the `npm pack` artifact

Now that there's a working build generating the necessary artifact, we can create a build step to publish the package. This relies on the build script for the `.tgz` artifact.

Here's a runthrough of the various options to configure:

- Create a new TeamCity build configuration, name it "Publish to npm" or similar.
- For the build step: Use the following script *(change `ritter-jekyll` to the name of your npm package)*:

```
@echo Off

call npm config set "//registry.npmjs.org/:_authToken" "%npm_auth_token%"

echo Before publish...
for /f %%%%i in ('dir ritter-jekyll-*.tgz /b') do set PACKAGE=%%%%i
call echo Publishing %%PACKAGE%% ...
call npm publish %%PACKAGE%%

call npm config delete "//registry.npmjs.org/:_authToken"
```

- Triggers: Create a "Finish Build Trigger", triggering on successful build only, with the branch filter:

```
-:*
+:<default>
```

- Inspect "Failure Conditions", you may want to set "an error message is logged by build runner" if it is not already.
- Dependencies: Setup both a snapshot and artifact dependency:

![Snapshot dependency](/images/publishing-npm-packages-from-teamcity/publish-snapshot-dependency.png)

![Artifact dependency](/images/publishing-npm-packages-from-teamcity/publish-artifact-dependency.png)

## Now, deploy from `master`!

Now, you're ready to deploy the latest version of your package from the `master` branch. And, subsequent version updates will be automatically published by TeamCity as they reach `master`.
