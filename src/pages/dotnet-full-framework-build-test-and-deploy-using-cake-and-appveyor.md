---
layout: ../layouts/Post.astro
title: ".NET Full Framework: Build, Test, and Deploy Using Cake and AppVeyor"
date: 2017-11-29 08:00:00
tags:
- .NET
- Cake
- AppVeyor
twitter_text: ".NET Full Framework: Build, Test, and Deploy Using Cake and AppVeyor (@cakebuildnet @appveyor)"
authors: Ken Dale
image: https://farm1.staticflickr.com/26/50375102_285473bb10_o_d.jpg
image_url: https://www.flickr.com/photos/64738468@N00/
image_credit: mario
---

At Ritter Insurance Marketing we have a number of repositories, each with separate continuous integration builds.

This is a base setup for building and publishing .NET full framework applications and packages. This primarily targets ASP.NET full framework applications and custom NuGet packages, but could potentially be modified or extended to support other items.

Sure, some projects might differ from the base setup temporarily or permanently, but this is a good starting point for setting up something new.

The setup involves these files in the repository root:

- [**build.cmd**](#buildcmd)
- [**build.ps1**](#buildps1)
- [**build.cake**](#buildcake)
- [**appveyor.yml**](#appveyoryml)
- [**.gitignore**](#gitignore)

---

### build.cmd

A simple wrapper for **build.ps1** *(for anyone not running PowerShell)*:

```
@echo off

powershell ./build.ps1
```

### build.ps1

See [https://cakebuild.net/docs/tutorials/setting-up-a-new-project#windows](https://cakebuild.net/docs/tutorials/setting-up-a-new-project#windows) for creating this file in the repository.

### build.cake

This is an example Cake build script. It builds for the correct environment, runs xUnit.net tests, and creates artifacts to deploy.

The deployment configuration for each environments is configured as an AppVeyor *environment deployment*. See [https://www.appveyor.com/docs/deployment/environment/](https://www.appveyor.com/docs/deployment/environment/) for some basic information about this.

```csharp
#tool "nuget:?package=xunit.runner.console"

var target = Argument("target", "Default");

string configuration;
var appVeyorBranch = EnvironmentVariable("APPVEYOR_REPO_BRANCH");

switch (appVeyorBranch)
{
    case "master":
        configuration = "Release";
        break;
    case "development":
        configuration = "QA";
        break;
    default:
        configuration = "Release";
        break;
}

var artifactsDir = Directory("./artifacts");
var solution = "./TheSolution.sln";

Task("Clean")
    .Does(() =>
    {
        CleanDirectory(artifactsDir);
    });

Task("Restore-NuGet-Packages")
    .IsDependentOn("Clean")
    .Does(() =>
    {
        NuGetRestore(solution);
    });

Task("Build")
    .IsDependentOn("Restore-NuGet-Packages")
    .Does(() =>
    {
        MSBuild(solution, settings =>
            settings.SetConfiguration(configuration)
                .WithProperty("TreatWarningsAsErrors", "True")
                .SetVerbosity(Verbosity.Minimal)
                .AddFileLogger());
    });

Task("Run-Tests")
    .IsDependentOn("Build")
    .Does(() =>
    {
        XUnit2("./tests/**/bin/" + configuration + "/*.Tests.dll", new XUnit2Settings
        {
            // If needed:
            // Parallelism = ParallelismOption.None
            // or similar.
        });
    });

Task("Package")
    .IsDependentOn("Run-Tests")
    .Does(() =>
    {
        MSBuild("src/Api/Api.csproj", settings =>
            settings.SetConfiguration(configuration)
                .WithProperty("TreatWarningsAsErrors", "True")
                .SetVerbosity(Verbosity.Minimal)
                .WithTarget("Package")
                .WithProperty("PackageLocation", Directory("../..") + artifactsDir));

        NuGetPack("./src/Client/Client.csproj", new NuGetPackSettings
        {
            OutputDirectory = artifactsDir,
            Properties = new Dictionary<string, string>
            {
                { "Configuration", configuration }
            }
        });
    });

Task("Default")
    .IsDependentOn("Package");

RunTarget(target);
```

### appveyor.yml

This is what [AppVeyor](https://www.appveyor.com/), our continous integration service, uses when it builds the solution. A build could be triggered to validate a pull request or after a merge. Some builds of specific branches can also result in deployments happening *(if the build succeeds)*, like `master` and `development`.

```yaml
image: Visual Studio 2017

cache:
  - packages -> **\packages.config, nuget.config
  - tools -> build.cake, build.ps1

install:
  - choco install gitversion.portable -pre -y

before_build:
  - ps: gitversion $env:APPVEYOR_BUILD_FOLDER /l console /output buildserver /updateAssemblyInfo /nofetch /b $env:APPVEYOR_REPO_BRANCH

build_script:
  - ps: ./build.ps1

test: off

artifacts:
  - path: ./msbuild.log
  - path: ./artifacts/*.nupkg
  - path: ./artifacts/Api.zip
    name: WebPackage
    type: WebDeployPackage

deploy:
  - provider: Environment
    name: Azure Websites (Production)
    artifact: WebPackage
    app_name: example-application
    app_password:
      secure: secure_app_password_here
    on:
      branch: master

  - provider: Environment
    name: Azure Websites
    artifact: WebPackage
    app_name: example-application-qa
    app_password:
      secure: secure_app_password_here
    on:
      branch: development

  - provider: Environment
    name: MyGet
    on:
      branch: master
```

### .gitignore

Lastly, you'll want to ignore directories created by `build.cake` by adding these lines to `.gitignore`:

```
artifacts/
tools/
```

## In closing

Feel free to copy and adapt this for your next project. If you have any suggested improvements let us know in the comments!
