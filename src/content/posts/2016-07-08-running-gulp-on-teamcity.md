---
title: "Running Gulp On TeamCity"
slug: running-gulp-on-teamcity
date: 2016-07-08 11:18:09
tags:
- gulp
- TeamCity
categories: 
- Development
twitter_text: Running Gulp On TeamCity
authors: 
- Khalid Abuhakmeh
image: /images/gulp_loves_teamcity.jpg
image_url: https://www.rimdev.io
image_credit: Khalid Abuhakmeh
---

[Gulp](http://gulpjs.com/) is a best of bread solution for when it comes to bundling and minification. It is only natural that it found its way into the common web developers workflow, and subsequently ours. We are also proponents of [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) and utilize [TeamCity](https://www.jetbrains.com/teamcity/) to build our projects on every new pull request. This post will show you how run Gulp on a TeamCity build agent consistently every time, without installing it globally.

## The Error

If you have attempted to run Gulp on a TeamCity agent and failed, you may be seeing this error message.

```
[XX:XX:XX][Step 1/1] 'gulp' is not recognized as an internal or external command,
[XX:XX:XX][Step 1/1] operable program or batch file.
```

It may not be immediately obvious, but the build agent cannot find Gulp in the path and thus cannot execute the command. This may be confusing, as you have most likely run `npm install`.

## The Fix

This assumes you have a `build` gulp task, but you may substitute whatever task you have.

```json
gulp.task('build', ['lint', 'sass', 'scripts'])
```

The first step is to update your `package.json` to include `gulp` in your scripts.

```json
{
    "scripts" : {
        "gulp" : "gulp"
    }
}
```

Once your `package.json` is updated, you will update your build file with the following line.

```
npm run gulp build
```

We use a `build.cmd` to build our projects.

```
@echo Off
pushd %~dp0
setlocal

set CACHED_NUGET=%LOCALAPPDATA%\NuGet\NuGet.exe
if exist %CACHED_NUGET% goto CopyNuGet

echo Downloading latest version of NuGet.exe...
if not exist %LOCALAPPDATA%\NuGet @mkdir %LOCALAPPDATA%\NuGet
@powershell -NoProfile -ExecutionPolicy Unrestricted -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest 'https://dist.nuget.org/win-x86-commandline/latest/nuget.exe' -OutFile '%CACHED_NUGET%'"

:CopyNuGet
if exist .nuget\nuget.exe goto Build
if not exist .nuget @mkdir .nuget
@copy %CACHED_NUGET% .nuget\nuget.exe > nul

:Build

:: Find the most recent 32bit MSBuild.exe on the system. Also handle x86 operating systems, where %PROGRAMFILES(X86)%
:: is not defined. Always quote the %MSBUILD% value when setting the variable and never quote %MSBUILD% references.
set MSBUILD="%PROGRAMFILES(X86)%\MSBuild\14.0\Bin\amd64\MSBuild.exe"
if not exist %MSBUILD% @set MSBUILD="%PROGRAMFILES%\MSBuild\14.0\Bin\MSBuild.exe"
if not exist %MSBUILD% @set MSBUILD="%SYSTEMROOT%\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe"

%MSBUILD% build\Build.msbuild /nologo /m /v:m /fl /flp:LogFile=msbuild.log;Verbosity=Detailed /nr:false %*

call cd .\src\Website\

call npm install
if %ERRORLEVEL% neq 0 goto BuildFail

call npm run gulp build
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

Once you have your updated script, the command should complete on TeamCity with no errors.

```
[11:03:29][Step 1/1] > gulp "build"
[11:03:29][Step 1/1] 
[11:03:30][Step 1/1] [11:03:30] Using gulpfile F:\BuildAgent\work\13cbe3cc4e8552eb\src\Website\gulpfile.js
[11:03:30][Step 1/1] [11:03:30] Starting 'lint'...
[11:03:30][Step 1/1] [11:03:30] Starting 'sass'...
[11:03:30][Step 1/1] [11:03:30] Starting 'scripts'...
[11:03:30][Step 1/1] [11:03:30] Finished 'lint' after 331 ms
[11:03:31][Step 1/1] [11:03:31] Finished 'scripts' after 585 ms
[11:03:31][Step 1/1] [11:03:31] Finished 'sass' after 1.07 s
[11:03:31][Step 1/1] [11:03:31] Starting 'build'...
[11:03:31][Step 1/1] [11:03:31] Finished 'build' after 18 Î¼s
[11:03:31][Step 1/1] 
[11:03:31][Step 1/1] *** BUILD SUCCEEDED ***
```

![](http://media2.giphy.com/media/2vA33ikUb0Qz6/giphy.gif)