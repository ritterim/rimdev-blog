---
layout: ../layouts/Post.astro
title: "Caching Git LFS in AppVeyor to Avoid Large GitHub LFS Bills"
date: 2019-09-09 16:00:00
tags:
- Git
categories:
- development
twitter_text: "Caching Git LFS in AppVeyor to Avoid Large GitHub LFS Bills"
authors: Ken Dale
image: https://images.unsplash.com/photo-1514195797654-9846057b0b18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/l06JLx9oaCk
image_credit: Anton Darius | @theSollers
---

In order to avoid having large files in our Git history we've been using [Git Large File Storage (LFS)](https://git-lfs.github.com). It commits a marker in the Git repository and uploads files to a separate place.

On GitHub the billing for Git LFS is based on storage and bandwidth. While significant bandwidth can be used by each contributor pulling down all the files locally **we've found a significant bandwidth contributor: Continuous Integration Builds Agents**. Using [AppVeyor](https://www.appveyor.com) to run out builds means each build is a full clone, which includes downloading all of the Git LFS assets needed to build the application. **And, without any caching on the build server this is a full download of all necessary Git LFS assets for each build.**

## appveyor.yml

Here's what you need in terms of AppVeyor configuration. *This script could be adapted for services other than AppVeyor.*

```yaml
image: Visual Studio 2017

cache:
  - .git\lfs\objects

clone_script: echo Skip AppVeyor Clone

install:
  # Adapted from https://help.appveyor.com/discussions/problems/6274-git-lfs-and-build-cache#comment_43676282
  - git init %APPVEYOR_BUILD_FOLDER%
  - cd %APPVEYOR_BUILD_FOLDER%
  - git remote add origin git@github.com:%APPVEYOR_REPO_NAME%.git # Updated to use SSH
  - git fetch -q origin %APPVEYOR_REPO_COMMIT%
  - git checkout -qf %APPVEYOR_REPO_COMMIT%

before_build:
  - ps: git lfs prune | Out-Null

build_script:
  - ps: ./build.ps1

test: off
```

AppVeyor typically handles the cloning of the repository for you. In this case, we want to remove that functionality by overriding the `clone_script` and taking care of it ourselves.

This was adapted from [https://help.appveyor.com/discussions/problems/6274-git-lfs-and-build-cache#comment_43676282](https://help.appveyor.com/discussions/problems/6274-git-lfs-and-build-cache#comment_43676282), so thanks to [trevor.sandy](https://help.appveyor.com/users/4075205) for something to work from.

I hope this helps you reduce your GitHub bills!
