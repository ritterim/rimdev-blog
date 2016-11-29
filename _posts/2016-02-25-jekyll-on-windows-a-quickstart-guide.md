---
layout: post
title: "Jekyll on Windows: A Quickstart Guide"
date: 2016-02-25 17:00:00
description: 'A few quick steps to get Jekyll working.'
tags:
- Jekyll
- Windows
authors: Ken Dale
categories:
- OSS
twitter_text: 'Jekyll on Windows: A Quickstart Guide'
---

We use [Jekyll](http://jekyllrb.com/) for this blog. If you're running Windows, this post can help you get it working quickly.

## Here we go

Use [Chocolatey](https://chocolatey.org/) to install Ruby v2 and the associated Ruby Development Kit version. You'll need to install [Chocolatey](https://chocolatey.org/) if it's not already installed.

Now, from an **Administrator** cmd or PowerShell prompt:

```
> choco install ruby ruby2.devkit
```

Next, install Jekyll:

```
> gem install jekyll
```

If the gem installation fails, run `C:\tools\DevKit2\devkitvars.bat` then try `gem install jekyll` again.

## That's it!

If you run into any problems or have any related tips, let us know in the comments!
