---
layout: ../layouts/Post.astro
title: Robustly Upgrading Target .NET Framework Version
date: 2019-02-11 10:30:00
tags:
- .NET
categories:
- development
twitter_text: "Robustly Upgrading Target .NET Framework Version"
authors: Ken Dale
image: https://images.unsplash.com/photo-1540721718864-c7222c845abc?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80
image_url: https://unsplash.com/photos/r76523xsOZY
image_credit: Manideep Karne
---

As I've walked through upgrading a number of solutions to target a new version of the .NET Framework, I've compiled a list of helpful steps:

- Run `git clean -xdf` to remove files not in the repository (or, delete `packages` folder, all `bin`, all `obj` folders)
- Update framework version on all projects
- Delete all binding redirects in all projects (search the solution for `<runtime>`)
- Package Manager Console: `Get-Project -All | Update-Package -Reinstall` (review for failures when complete, this may fail if any packages are delisted)
- Package Manager Console: `Get-Project -All | Add-BindingRedirect`
- Cleanup any unwanted files added by the reinstall of NuGet packages
- Cleanup duplicate entries of `<Private>True</Private>`
- Cleanup any other issues you may find (look through the changes)
- Build solution and review output for binding redirect issues or anything else

Hopefully that helps you avoid issues encountered when upgrading to a newer .NET framework version. Leave a comment if anything is missing!
