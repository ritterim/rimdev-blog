---
title: "css prefixes, yes pleeease"
slug: css-prefixes-yes-pleeease
date: 2017-08-03 16:02:55
tags:
- css
categories:
twitter_text: "css prefixes, rem fallbacks, yes pleeease"
authors: 
- Kevin Hougasian
image: https://farm4.staticflickr.com/3203/2872074787_7fc63c949d_b.jpg
image_url: https://www.flickr.com/photos/mightymoss/2872074787
image_credit: Evan Moss
---

If you CSS, you're familiar with the browser `-prefix`. Chrome and Safari have `-webkit`, `-moz` for Firefox/Mozilla, and `-ms` for Edge. As browsers iterate, prefixes drop off, so packages have stepped in so you don't have to write 60% more to cover all of your target browsers.

### Pleeease

[Pleeease](http://pleeease.io) adds [browser prefixing that you can target](http://pleeease.io/docs/#autoprefixer) while watching [pseudo-elements](http://pleeease.io/docs/#pseudoelements), [opacity](http://pleeease.io/docs/#opacity), css [filters](http://pleeease.io/docs/#filters), and [rem](http://pleeease.io/docs/#rem). Pleeease supports the most popular css [pre-processors](http://pleeease.io/docs/#preprocessors), sass, less, and stylus, and has a nice list for [post-processors](http://pleeease.io/docs/#postprocessors) as well. It's small, simple, and flexible enough to plug into your workflow &mdash; fast!

```json
{
  "autoprefixer": true,
  "filters": true,
  "rem": true,
  "pseudoElements": true,
  "opacity": true,

  "import": true,
  "minifier": true,
  "mqpacker": false,

  "sourcemaps": false
}
```

Target browsers based on [Browserlist](https://github.com/ai/browserslist#browsers), or based on version [queries](https://github.com/ai/browserslist#queries):

- `last 4 versions`
- `> 5% in US`
- `Firefox ESR`

```json
{
  "autoprefixer": {
    "browsers": [
      "last 4 versions",
      "Firefox ESR"
    ]
  }
}
```
Pleeease turns this...
```css
.my-class {
  background: linear-gradient(grey, black);
  display: flex;
  opacity: .3;
  padding: 1rem;
  transform: .2s ease-in
}
```

...into this
```css
.my-class {
  background: -webkit-linear-gradient(grey, black);
  background: linear-gradient(grey, black);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  opacity: .3;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)";
  padding: 16px;
  padding: 1rem;
  -webkit-transform: .2s ease-in;
      -ms-transform: .2s ease-in;
          transform: .2s ease-in
}
````

Pleeease, get started with [docs](http://pleeease.io/docs/) and [workflow](http://pleeease.io/workflow/). Let us know what you think!
