---
layout: ../layouts/Post.astro
title: "IE Still Breaking Promises... Literally"
date: 2018-06-08 08:17:33
tags:
- IE
- Development
- JavaScript
categories: development
twitter_text: "IE Still Breaking Promises... Literally"
authors: John Vicari
image: https://images.unsplash.com/photo-1511792411104-ccfdd048bd9a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e0cce28b17368ee9531f75b0ee198e2a&auto=format&fit=crop&w=2850&q=80
image_url: https://unsplash.com/photos/-u7FVi3aBvU
image_credit: Photo by Gianni Zanato on Unsplash
---

I could probably rant and rave about Internet Explorer (IE) for a couple of hours, reminiscing about busted [box models](http://www.456bereastreet.com/archive/200612/internet_explorer_and_the_css_box_model/), janky IE specific hacks, and other joys that came with supporting a browser that never died. It might get some good laughs, but only because we know we’re (almost) free and clear.

However, just when IE is finally an afterthought, not so much as a blip in my thought process, it peers over my shoulder with that stupid smirk.

## The Scenario

We run a few static sites built with [Jekyll](https://jekyllrb.com/), which runs on the Liquid template language. [Vue.js](https://vuejs.org/) was stitched in to give us some more flexibility for functionality. One of the Vue components we created utilized [Axios](https://github.com/axios/axios), a promise based http client for the browser and [Node.js](https://nodejs.org/en/).

## The Problem

So, it turns out IE doesn’t support [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) natively, thus killing our shiny new component. Side note, IE throws up on all of ES6, so be sure to translate, more on this below.

## The Solution

The first thing I realized was that I wasn’t translating my ES6 code to something IE could handle, the package [`babel-preset-env`](https://babeljs.io/docs/plugins/preset-env/) will do that for you. Install the package and create a `.babelrc` file in the root of your project that includes:

```javascript
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": [ "last 2 versions", "ie >= 11" ],
          "es2015": { "modules": true }
        }
      }
    ]
  ]
}
```
There are tons of helpful settings and configurations available to you, check out some of the [examples](https://babeljs.io/docs/plugins/preset-env/#examples).

Secondly, I needed IE to be able to work with Promises. The package [`es6-promise`](https://github.com/stefanpenner/es6-promise) provides a polyfill for Promises. There are a few ways to incorporate this package into your project. After installing it, you can either use it at a specific instance or polyfill the global environment. I chose to auto polyfill global, to do that, import the package in your main js file with:
```javascript
import 'es6-promise/auto';
```
Depending on your setup, you may need to use:
```javascript
require('es6-promise/auto');
```
Nothing else is required, the polyfill will patch the global environment when called.

## Final Thoughts...

At this point, IE is an afterthought, but every once in a while something comes up taking you back to those glory days. Stay tuned for my next post, An In-Depth Look at the Rise and Fall of GeoCities.
