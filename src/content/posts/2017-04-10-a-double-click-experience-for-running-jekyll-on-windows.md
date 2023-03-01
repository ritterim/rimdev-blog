---
title: "A Double-Click Experience for Running Jekyll on Windows"
slug: a-double-click-experience-for-running-jekyll-on-windows
date: 2017-04-10 2:30:00
tags:
- jekyll
categories:
- development
twitter_text: "A Double-Click Experience for Running Jekyll on Windows"
authors: 
- Ken Dale
---

Typically, running a [Jekyll](https://jekyllrb.com/) site locally for the first time requires a basic knowledge of using the command line. It usually involves a few commands: `bundle exec jekyll serve` *(with the optional `--incremental` flag)* after installing the `bundler` gem and running the associated `bundle install` command.

Below is a `.cmd` file to get a Jekyll site run locally, as well as open a web browser automatically. This can be useful to give command line focused users a quickstart, as well as provide a double-click experience from Windows Explorer.

**Simply add the following to your project:**

## **jekyll-run.cmd**

```
@echo Off
pushd %~dp0
setlocal

call gem install bundler --no-ri --no-rdoc
call bundle install
call explorer "http://localhost:4000"
call bundle exec jekyll serve --incremental
```

**Note:** This assumes the required Ruby version is already installed. For Jekyll installation instructions for Windows see [https://jekyllrb.com/docs/windows/#installation](https://jekyllrb.com/docs/windows/#installation).
