## rimdev-blog

Customized based on [Will Jekyll Template](https://github.com/willianjusten/will-jekyll-template/)

## Basic Setup

1. [Install Jekyll](http://jekyllrb.com)
2. Fork the [RIMdev blog](https://github.com/ritterim/rimdev-blog/fork)
3. Clone the repo you just forked.
4. Run `npm install` in the cloned folder.
7. **Remember to compile your assets files with Gulp.**

## Tests

Tests are ran with `npm test`. Currently, this is a spelling check of posts. This can done interactively as well with `npm run check`.

## Creating posts

You can use the `initpost.sh` to create your new posts. Just follow the command:

```
./initpost.sh -c Post Title
```

The new file will be created at `_posts` with this format `date-title.md`.

When you're done, run `npm run check` to check it over.

## Front-matter

### Authors

When you create a new post, you need to fill the post information in the front-matter, follow this example:

```
---
layout: post
title: "How to use"
author: <Your name here>
date: 2015-08-03 03:32:44
image: '/assets/img/post-image.png'
description: 'First steps to use this template'
tags:
- jekyll 
- template 
categories:
- I love Jekyll
twitter_text: 'How to install and use this template'
---
```

> Note: No image for `image: '/assets/img/post-image.png'` will result in a solid color

For a multiple author post:

```
author:
- <First author>
- <Second author>
```

### Social accounts

If one of your social accounts is not listed, please add in _config.yaml. 

## Running the blog in local

In order to compile the assets and run Jekyll on local you need to follow those steps:

- Install [NodeJS](https://nodejs.org/)
- Run `npm install` 
- Run `gulp`
