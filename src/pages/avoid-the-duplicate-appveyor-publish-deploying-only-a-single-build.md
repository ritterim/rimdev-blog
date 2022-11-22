---
layout: ../layouts/Post.astro
title: "Avoid the Duplicate AppVeyor Publish: Deploying Only a Single Build"
date: 2017-06-29 11:30:00
tags:
- AppVeyor
categories:
- development
twitter_text: "Avoid the Duplicate AppVeyor Publish: Deploying Only a Single Build"
authors: Ken Dale
---

Sometimes it's useful to ensure a project works with multiple versions of runtimes. In the following example, multiple versions of Node.js will be used to ensure a project builds successfully with both. In these cases, you may only want a single deployment -- rather than deploying twice unnecessarily.

To perform only a single build one can use an environment variable. See the following **appveyor.yml** example:

```yaml
environment:
  matrix:
    - nodejs_version: STABLE
      publish_build: true
    - nodejs_version: LTS

#
# Any necessary build configuration here
#

deploy:
  - provider: Environment
    name: My Provider
    artifact: WebPackage
    app_name: my-application
    app_password:
      secure: TheSecurePassword
    on:
      branch: master
      publish_build: true
```

`publish_build` is an environment variable, which ensures that the above deployment only happens for the `nodejs_version: STABLE` build.
