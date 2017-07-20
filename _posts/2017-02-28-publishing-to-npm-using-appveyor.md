---
layout: post
title: "Publishing to npm Using AppVeyor"
date: 2017-02-28 11:30:00
tags:
- AppVeyor
- npm
categories:
- development
twitter_text: "Publishing to npm Using AppVeyor"
authors: Ken Dale
---

AppVeyor does not currently provide built-in support for publishing to npm (at least, currently). Instead, we can provide the npm token as an AppVeyor UI configured environment variable and run `npm pack` and `npm publish`.

## Setup environment variable

In the AppVeyor web application, add an `NPM_TOKEN` environment variable using a token retrieved from [https://www.npmjs.com/](https://www.npmjs.com/). **Be sure to encrypt this token in AppVeyor!**

## AppVeyor configuration in repository

Add or update the AppVeyor configuration using the following example:

## **appveyor.yml**

```yaml
environment:
  matrix:
    - nodejs_version: "6"
      configuration: publish
    - nodejs_version: "7"

install:
  - ps: Install-Product node $env:nodejs_version

before_build:
  # Output useful info for debugging.
  - node --version
  - npm --version

build_script:
  - ./build.cmd

cache:
  - node_modules -> package.json
  - '%APPDATA%\npm-cache'

test: off

deploy_script:
  - ps: |
      if ($ENV:CONFIGURATION -eq "publish")
      {
        "//registry.npmjs.org/:_authToken=`$`{NPM_TOKEN`}" | Out-File (Join-Path $ENV:APPVEYOR_BUILD_FOLDER ".npmrc") -Encoding UTF8
        iex "npm pack"
        iex "npm publish"
      }
    on:
      branch: master
```

After implementing this in the `master` branch, check the package on [https://www.npmjs.com/](https://www.npmjs.com/) to see if the publish was successful *(assuming a new version was published)*.
