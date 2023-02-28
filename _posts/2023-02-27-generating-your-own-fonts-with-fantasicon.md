---
layout: post
title: "Generating your own fonts with Fantasicon"
date: 2023-02-27 15:51:42
tags: fonts, icons, design
categories:
twitter_text: "Generating your own fonts with Fantasicon"
authors: Kevin Hougasian
image: https://images.unsplash.com/photo-1609605348579-3123e3d40eb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80
image_url: https://unsplash.com/photos/92-mTYj5oGs
image_credit: Brett Jordan
---

Anyone who's heard me mention [Platform UI](https://platformui.com/)  knows we make our font icons and bake them right into Platform UI to keep it a one-stop resource. There are some great font packages out there! Do you want to load thousands of icons to get what you're looking for? 

For anyone interested, here is what I found along the way...

## The SVGs

I'm not going to go in-depth on generating the SVGs -- this is our basic setup:

| source | default |
|---|---|
| artboard | 4" x 4" |
| main stroke | 24pt |
| auxiliary stroke | 18pt |
| corner | .15" |
| join |  round |


There are a few tools out there you can evaluate for your workflow. We currently use SVGO but will incorporate outline-stroke in a future build -- it remains an evolving process as we learn.

 - https://github.com/svg/svgo 
 - https://github.com/elrumordelaluz/outline-stroke 
 - https://github.com/svgdotjs/svg.js


## Ok, let's make some icons

Our first attempt was ok. It generated the font every time but remained a rudimentary approach.

 ```js
module.exports = {
  inputDir: './src/optimized-icons',
  outputDir: './src/generated',
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['scss'],
  prefix: 'pi',
  name: "platform-icons"
};
``` 
Fontasticon has a great [Readme](https://github.com/tancredi/fantasticon#readme) and [Discord channel](https://discord.gg/BXAY3Kc3mp). I couldn't have done this without BOTH of them! 

A big issue we faced was adding new icons - we would overwrite previous values making the use of `:before` and `:after` impossible. Enter `codepoints`; But how did they work? 

Let's walk through our current config file `.fantasticonrc.js` to see how it all comes together. We use [Vite](https://vitejs.dev/) to generate Platform UI (with icons) and a stand-alone Platform-icons repo.

```js
module.exports = {
  // We run the main icon directory through SVGO first to 
  // output the inputDir.  
  inputDir: './src/optimized-icons',
  // Where Vite puts things
  outputDir: './public',
  // What font types to generate; If you're solely generating 
  // for the web, you only need woff and woff2
  fontTypes: ['ttf', 'woff', 'woff2'],
  // This is telling Fastasicon what to output:
  // HTML leverages the baked-in handlebars template
  // so does CSS
  // JSON is what you need to stop overwriting your icons!
  assetTypes: ['html', 'json', 'css'],
  // naming convention; user.svg becomes pi-user
  prefix: 'pi',
  // and the tag you're using; <i class="pi-user">
  tag: 'i',
  // the name of the final font files
  name: 'platform-icons',
  fontHeight: 300,
  normalize: true,
    formatOptions: {
    json: {
      indent: 2
    }
  },
  // Handlebars templates for your assetType output
  templates: {
    html: './src/templates/html.hbs',
    css: './src/templates/css.hbs'
  },
  // And where you're outputting these files
  pathOptions: {
    json: './src/platform-icons.json',
    html: './index.html'
  }
};
```

Ok, that's what you need to generate your _first_ font file. Your _second_ font file needs more. 

Now that you've generated `./src/platform-icons.json`, which you specified in `assetTypes` and `pathOptions`, you need to require the codepoints path and use it in your config file.

```js
// Before module.exports = {...}
const codepoints = require('./src/platform-icons.json');
// And `codepoints` somewhere in the export
```

Your final config file should look like this:

```js
const codepoints = require('./src/platform-icons.json');

module.exports = {
  inputDir: './src/optimized-icons',
  outputDir: './public',
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['html', 'json', 'css'],
  prefix: 'pi',
  tag: 'i',
  name: 'platform-icons',
  fontHeight: 300,
  normalize: true,
  formatOptions: {
    json: {
      indent: 2
    }
  },
  codepoints,
  templates: {
    html: './src/templates/html.hbs',
    css: './src/templates/css.hbs'
  },
  pathOptions: {
    json: './src/platform-icons.json',
    html: './index.html'
  }
};
```

## That's it. 

You now have a font that won't overwrite codepoint values. When you add a new SVG, it will append to the bottom of the list. 

I hope this helps someone! It was a journey for me.

Happy fonting!
