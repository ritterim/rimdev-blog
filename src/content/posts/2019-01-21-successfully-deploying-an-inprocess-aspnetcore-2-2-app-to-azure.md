---
title: "Successfully Deploying An InProcess ASP.NET Core 2.2 App To Azure"
slug: successfully-deploying-an-inprocess-aspnetcore-2-2-app-to-azure
date: 2019-01-21 15:39:51
tags:
- asp.net
- asp.net core
categories:
twitter_text: "Successfully Deploying An InProcess #aspnetcore 2.2 App To @Azure @aspnet @dotnet"
authors: 
- Khalid Abuhakmeh
image: https://farm5.staticflickr.com/4906/44097588650_b4e1ba5865_z_d.jpg
image_url: https://www.flickr.com/photos/fran001/
image_credit: Francisco Anzola
---

## Updated Solution!

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Thanks for the post!<br><br>If you don&#39;t want to create a web.config, you can also drive this through the &lt;AspNetCoreHostingModel&gt; MSBuild property by setting it to InProcess in the .csproj.<br><br>Using the SDK v2.2.102, &lt;AspNetCoreModuleName&gt; default value is already AspNetCoreModuleV2.</p>&mdash; Mickaël Derriey (@mderriey) <a href="https://twitter.com/mderriey/status/1087473851359883264?ref_src=twsrc%5Etfw">January 21, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

So after publishing this post, a nice individual by the name of Mickaël suggested that the `dotnet-cli` automatically creates this web.config based on the the `csproj` settings. It does indeed work! I do suggest you make sure you are on the latest `SDK` of `2.2.100` or else you won't see the results you are looking for.

Note: The build process may suggest that you _do not_ include the version number in your PackageReference. I was not able to get Azure to successfully load the ASP.NET Core application without specifiying the package version of `2.2.1`. Try it both ways and see what happens.

Thanks again to the folks who read and suggest better solutions.

---

The year is 2019, and you've decided to live on the bleeding edge at the intersection of ASP.NET Core and Windows Azure. ASP.NET Core delivered `InProcess` hosting With the release of ASP.NET Core 2.2, which means our applications can take full advantage of IIS resources and be hosted in the IIS Process itself. This post will show you the steps you need to take to make your ASP.NET Core Application work in Azure.

## Step 1: Update Microsoft.AspNetCore.App

You will need the latest version of `Microsoft.AspNetCore.App` which is 2.2.1 as of this post. Once installed via NuGet, you should have a package reference like so:

```xml
<PackageReference Include="Microsoft.AspNetCore.App" Version="2.2.1" />
```

## Step 2: Add A Web.Config

This is where you may be scratching your head. Why do I need a `web.config`. While the application may be ASP.NET Core, it is hosted in IIS which still uses configuration files.

This configuration file test IIS to use the correct module when running the ASP.NET Core application. **The web.config is critical**.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <location path="." inheritInChildApplications="false">
        <system.webServer>
            <handlers>
                <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
            </handlers>
            <aspNetCore processPath="dotnet"
                        <!-- Your Application Dll Goes Here -->
                        arguments=".\MyApp.dll"
                        stdoutLogEnabled="false"
                        stdoutLogFile=".\logs\stdout"
                        hostingModel="InProcess" />
        </system.webServer>
    </location>
</configuration>
```

The reason we need a `web.config` is due to the handler element, which is set to `AspNetCoreModuleV2`.

## Step 3: Enable ASP.NET Core Logging Extensions

If you're hosting in App Services, be sure to install the ASP.NET Core Logging Extensions. It will help you debug issues more easily by enabling the `Diagnostic logs` feature in your App Service instance.

## Conclusion

There you have it. Your ASP.NET Core application is ready to be hosted `InProcess` and utilize IIS. You should see a nice performance boost and faster startup times as well.