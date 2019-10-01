---
layout: post
title: "How to Work with NPM Packages Locally Using .tgz Files"
date: 2019-10-01 12:00:00
tags:
- npm
- tgz
categories:
- development
twitter_text: "How to Work with NPM Packages Locally Using .tgz Files"
authors: Jaime Jones
image: https://images.unsplash.com/photo-1470173274384-c4e8e2f9ea4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80
image_url: https://unsplash.com/photos/JuFcQxgCXwA
image_credit: Samuel Zeller | @samuelzeller
---

Working with NPM packages locally can feel a little bit overwhelming at first. Over the last year, we have transitioned some of our infrastructure at RIMdev into several NPM packages that we can use across various projects. This has been a boon for us, but it also came with its own challenges. How do you test changes to one of these NPM packages locally without having to publish and then install in the project you'd like to test in? Do you have to publish any change you want to test? Luckily, it's very easy to work with NPM packages locally thanks to a couple of handy features!

The workflow steps fairly simple:

1. Run your build command from the directory of your application that gets published as an NPM package. This will ensure that what would get included in a usual publish process will be what you package up to install locally.
2. Run `npm pack` from the same directory. This will generate a `.tgz` file at the directory's root with a structure like this: `{name}-{version}.tgz` and print the name of the generated file in your console. You can then copy the name of that newly created file.
3. In the directory of the project that you want to test your NPM package, just run an `npm install` with the path to your `.tgz` file. Something like: `npm install ../../my-package/my-package-1.1.0.tgz`.
4. Run the project you want to test in and see your changes!

If you want to adjust anything in your package as you work through and test things, just run through those same steps again! It might be a little bit more work than changing things directly in the same project and enjoying hot reload, but it's much easier than publishing something you aren't sure about just so that you can test.
