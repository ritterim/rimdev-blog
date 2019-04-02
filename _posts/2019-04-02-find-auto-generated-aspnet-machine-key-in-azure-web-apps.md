---
layout: post
title: Find Auto Generated ASP.NET Machine Key in Azure Web Apps
date: 2019-04-02 13:55:00
tags:
- .NET
- asp.net
categories:
- asp.net
- development
twitter_text: "Find Auto Generated #aspnet Machine Key in @Azure Web Apps"
authors: Ken Dale
image: https://images.unsplash.com/photo-1550527882-b71dea5f8089?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80
image_url: https://unsplash.com/photos/C1P4wHhQbjM
image_credit: Silas Köhler
---

## What is a machine key?

According to [https://docs.microsoft.com/en-us/dotnet/api/system.web.security.machinekey?view=netframework-4.7.2](https://docs.microsoft.com/en-us/dotnet/api/system.web.security.machinekey?view=netframework-4.7.2) a machine key "Provides a way to encrypt or hash data (or both) by using the same algorithms and key values that are used for ASP.NET forms authentication and view state."

## Where can I find it on Azure Web Apps?

It's on the file system at `D:\local\Config\rootweb.config`. One way to get there is navigate to **https://YOUR_APPLICATION_NAME.scm.azurewebsites.net**, click **Debug Console** on the top navigation, and choose CMD or PowerShell (whichever you prefer). Open the `rootweb.config` file and look for `machineKey`.

Hope you found this short post helpful!
