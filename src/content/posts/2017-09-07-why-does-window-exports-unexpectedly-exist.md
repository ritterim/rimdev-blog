---
title: Why Does window.exports Unexpectedly Exist?
slug: why-does-window-exports-unexpectedly-exist
date: 2017-09-07 14:30:00
tags:
- JavaScript
categories:
- development
- javascript
- frontend
twitter_text: "Why Does window.exports Unexpectedly Exist?"
authors: 
- Ken Dale
image: https://farm8.staticflickr.com/7423/26692865962_367760e6c4_k_d.jpg
image_url: https://www.flickr.com/photos/39997856@N03/26692865962
image_credit: vitreolum
---

We ran across an issue where `window.exports` was being unexpectedly set.

## The cause

```html
<div id="exports">
  ...
</div>
```

## Why?

In some browsers, DOM elements with `id`s are available as variables automatically on `window`. When combined with functionality that checks if `window.exports` exists as part of environment detection there's the potential for an issue.

See [https://stackoverflow.com/questions/3434278/do-dom-tree-elements-with-ids-become-global-variables](https://stackoverflow.com/questions/3434278/do-dom-tree-elements-with-ids-become-global-variables) for more details.
