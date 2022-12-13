---
layout: ../layouts/Post.astro
title: "Using forEach for IE 11"
date: 2019-11-04 9:10:30
tags:
 - JavaScript
 - IE 11
categories:
 - JavaScript
twitter_text: "Using forEach to loop through DOM elements in IE 11"
authors: Andrew Rady
image: https://images.unsplash.com/photo-1524993242431-9de0d2d86e85?w=1000
image_url: https://unsplash.com/photos/xZMghzq01UQ
image_credit: "@majidrangraz"
---

Supporting IE comes with challenges if you are using es6, and while babel helps greatly there is a few gotcheas. One of the main one is using `forEach` on DOM elements. In modern browsers it’s pretty easy to select DOM elements and loop through them to add something like an `eventListener`. Open up IE 11 and you will find “Object doesn't support property or method 'forEach'” in the console.

There are a few simple ways we can solve this, the first is to wrap the DOM selection in a `Array.prototype.slice.call` to allow IE to iterate through it,

```js
let navLinks = Array.prototype.slice.call(document.querySelectorAll('.navigation-link'))
navLinks.forEach(nav => {
  //code
})
```

This is a simple way to solve this but if a developer forgets to do this we can break IE 11, so it’s better to write you own little polyfill and include it before our main scripts

```js
if(window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
if(window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
```

If you do some googling you will find a lot of responses on stackoverflow that include `NodeList.prototype.forEach = Array.prototype.forEach;`. Let me explain why we added the second section with the `HTMLCollection`. If you use `document.querySelectorAll` it will return it as a node list, but if you use `document.getElementsByTagName` or `document.getElementsByClassName` it will return it as a `HTMLCollection`. This is why we added the second conditional. Just make sure you include this at the top of your file or first in your `webpack` configuration.


## es6 functions

A common use case people run into with this is if they are writing es6 and is using a native function like `filter` or `find` on the variable that is storing the navigation links. This polyfill only gives us the `forEach` ability. For example if you write `let links = document.querySelector('.navigation').filter(x => x.value)` you will get a console error. We will still need to convert the variable to an array which is pretty easy,

```js
let links = document.querySelectorAll('.navigation-link');
links = [...links].filter(x => x.value);
```
