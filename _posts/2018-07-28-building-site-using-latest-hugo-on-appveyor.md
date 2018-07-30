---
layout: post
title: "Building A Site Using The Latest Hugo on AppVeyor"
date: 2018-07-28 11:16:45
tags:
- dev
- build
categories:
twitter_text: "Build A Site Using The Latest @GoHugoIO on @appveyor #JAMStack"
authors: Khalid Abuhakmeh
image: https://farm1.staticflickr.com/938/29719750968_fa5c3ca79b_k_d.jpg
image_url: https://www.flickr.com/photos/160462157@N08/
image_credit: John Jones
---

Hugo recently released an amazing [asset pipeline](https://gohugo.io/news/0.43-relnotes), which means you need less external dependencies to build a *sweet* static site. To take advantage of this new feature you need the "extended" version of Hugo. This post will show you how to download this extended version on AppVeyor and run your build.

## AppVeyor.yml

Normally, we would use Chocolatey to install Hugo. This should be at the top of the `appveyor.yml` file in your repository.

```yml
install:
  - ps: choco install hugo
```

But the current version is *not* the extended version we need. We needed to switch the one line above, to the two below.

```yml
install:
  - ps: Start-FileDownload 'https://github.com/gohugoio/hugo/releases/download/v0.45.1/hugo_extended_0.45.1_Windows-64bit.zip'
  - ps: 7z x hugo_extended_0.45.1_Windows-64bit.zip
```

This downloads the latest release, as of this post, and extracts it locally (which seems to also be in the PATH). As a bonus, I call `hugo version`.

```yml
before_build:
  # Output useful info for debugging.
  - hugo version
```

When you run this, you'll see we are running the extended version.

```console
hugo version
Hugo Static Site Generator v0.45.1/extended windows/amd64 BuildDate: unknown
```

## NPM Dev Depdency

I also noticed that we need `PostCSS Cli` as a dev dependency. If you start seeing errors around not being able to process a css file then you'll need it as well.

```console
npm i -D postcss-cli
```

This should make everthing build great now.