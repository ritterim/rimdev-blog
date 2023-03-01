---
title: "Spinning up a local server with gulp"
slug: spinning-up-a-local-server-with-gulp
date: 2017-09-29 12:59:52
tags:
- gulp
categories:
twitter_text: "Spinning up a local server with gulp"
authors: 
- Kevin Hougasian
image: https://farm2.staticflickr.com/1224/763756944_a5120e0667.jpg
image_url: https://www.flickr.com/photos/swiv/
image_credit: Hannah Swithinbank
---

Setting up a local server comes in many flavours today. My goto was the Apache `vhost.conf`/`hosts` combo, now to load something quickly - [Gulp](http://gulpjs.com/).

## Setup

We're going to assume you have [node](https://nodejs.org/) and [npm](https://www.npmjs.com/) up and running in your dev environment, if not there's a good article [here for mac](http://blog.teamtreehouse.com/install-node-js-npm-mac).

[comment]: # (appending {: .ui.teal.message } adds semantic-ui message styling)

{: .ui.info.message}
**Git users:** Don't forget to add `node_modules/` to your `.gitignore` file.

Let's prime the project and install the packages we're going to need for a straight http server.

```
$ cd /path/to/my/project
$ npm init
```
npm is going to ask you a few questions to setup your `package.json` file. The package file keeps your set dependencies for this project.

Now let's install the packages you need, gulp and [gulp-webserver](https://www.npmjs.com/package/gulp-webserver). Note, we're installing gulp globally with `-g` so all projects have access.

```
$ npm i gulp -g
$ npm i gulp gulp-webserver --save-dev

```

## Gulpfile.js

Create `gulpfile.js` requiring the packages we just installed.

```
var gulp = require('gulp);
var server = require('gulp-webserver');
```

Now let's create a task for gulp.

```
gulp.task('server', function() {
  gulp.src('public')	// <-- your app folder
    .pipe(server({
      livereload: true,
      open: true,
      port: 6000	// set a port to avoid conflicts with other local apps
    }));
});
```

Let's set a default task and add `server` so we can simply call `gulp`, and not `gulp server`, in your project directory.

```
gulp.task('default', ['server']);
```

Not much help here, although, as you add additional gulp packages, `gulp-sass` maybe, lint, minify, you'll see the benefits.

So for now, run `gulp` in your root directory and your local server is running.

Running php, no problem, there's help [here](https://www.npmjs.com/package/gulp-connect-php).
