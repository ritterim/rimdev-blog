---
title: WSL and git and my problem with a single ASP.NET MVC app.
slug: wsl-git-asp-net-mvc
tags:
- WSL
- git
- ASP.NET MVC
categories:
- development
twitter_text: "WSL and git and my problem with a single ASP.NET MVC app."
authors: 
- Bill Boga
image: /images/wsl-git-asp-net-mvc-exception.png
image_credit: Bill Boga
---

## What is WSL?

[Windows Subsytsem for Linux](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux) (aka WSL) is an excellent tool for running Linux-based binaries natively in Windows. With the introduction of [proper permissions](https://blogs.msdn.microsoft.com/commandline/2018/01/12/chmod-chown-wsl-improvements/), it has become even better. My personal setup includes running the [Ubuntu-distro](https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6?activetab=pivot:overviewtab) inside [ConEmu](https://conemu.github.io/) and sprinkled with [tmux](https://en.wikipedia.org/wiki/Tmux). However, an odd permissions battle forced me to **temporarily** cede this combination in favor of [git for Windows](https://git-scm.com/download/win).

## WSL plus `git` plus *one particular ASP.NET MVC repo.* equals 💥

A fresh `clone` of a repo. housing an ASP.NET MVC app. and subsequent build/run results in:

```
Could not load file or assembly 'System.Web.Http, Version=5.2.3.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' or one of its dependencies. The located assembly's manifest definition does not match the assembly reference. (Exception from HRESULT: 0x80131040)
```

**I worked with several teammates and confirmed no one receives this error with a fresh checkout (everyone else is using some form of git for Windows and running Windows either natively or via VM).**

After a couple hours uninstalling/re-installing various versions of ASP.NET MVC and .NET Framework with no change in outcome, I finally broke down and installed a version of `git` for Windows, did a fresh `clone` of the app., and voila! I had a functioning app. again! While I was happy to successfully work through this problem, the unknowns were really bothering me, so I continued the search for answers...

## Brute-force this thing to work!

The repo. has several library projects with a single `Web` project. Through another few hours of troubleshooting, I discovered I could run the following to "fix" this error:

### WSL

```
> rm -Rf Web
```

### PowerShell

```
PS > mkdir Web
```

### WSL

```
> git checkout -- Web/*
```

This corrected the assembly problem, but now I received another error related to any Razor-view:

```
Compilation Error
Description: An error occurred during the compilation of a resource required to service this request. Please review the following specific error details and modify your source code appropriately.

Compiler Error Message: CS0103: The name 'model' does not exist in the current context
```

So, I did the same process as before:

### WSL

```
> rm -Rf Web/Views
```

### PowerShell

```
PS > mkdir Web/Views
```

### WSL

```
> git checkout -- Web/Views/*
```

## Maybe it's a permissions problem?

### My WSL config.

My `/etc/wsl.conf` is basic with only the following to apply permissions:

```
[automount]
options = "metadata"
```

Re-creating these directories within the context of Windows led me to think it was a permissions problem on these directories. However, checking both inside WSL did not confirm my expectation:

```
> getfacl Web
# file: Web
# owner: me
# group: me
user::rwx
group::rwx
other::rwx

> getfacl Web/Views
# file: Web/Views
# owner: me
# group: me
user::rwx
group::rwx
other::rwx
```

I tried manually setting `777` on everything in `Web`, but this did not work:

```
> chmod 777 -R Web
```

Nor did removing my WSL config. via `/etc/wsl.conf`.

## Conclusions

I am a bit disappointed there is no decisive explanation. It still feels like something related to permissions. Maybe those particulars aren't visible within WSL. Either way, I'm left with the knowledge that sometimes a system (WSL) within another system (Windows) can sometimes have very specific problems. And, if this happens *and* there's a Windows-specific version of the thing, using the latter might just save a few hours (or more) or aggrevation.
