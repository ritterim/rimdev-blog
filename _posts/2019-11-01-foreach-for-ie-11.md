---
layout: post
title: "forEach for IE 11"
date: 2019-11-01 11:58:30
tags:
categories:
twitter_text:
authors:
image:
image_url:
image_credit:
---

Supporting IE comes with challenges if you are using es6, and while bable helps greatly there is a few gotcheas. One of the main ones if using `forEach` on dom elements. In modern browsers it’s pretty easy to get select a dom elements and loop through it to add something like an `eventListener` is common. Open up IE 11 and you will find “Object doesn't support property or method 'forEach” in the console.

There is a few simple ways we can solves this, the first is to wrap dom select in a `Array.prototype.slice.call` to allow IE to be able to integrate through it

```js
let navLinks = Array.prototype.slice.call(document.querySelector(‘’.navigation))
navLinks.forEach(nav => {
  //code
})
```

This is a simple way to solve this but a developer forgets to do this we can break IE 11 so it’s better to write you own little polyfill and include it before our main scripts

```js
if(window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
```

Most answer you will see in StackOverflow will only include ` NodeList.prototype.forEach = Array.prototype.forEach;`. Let me explain why added the second line with the `HTMLCollection`. If you use `document.querySelectorAll` it will return it as a node list, but if you use `document.getElementsByTagName` or ` document.getElementsByClassName` it will return it as a `HTMLCollection`. This is why we added the second line. Just make sure you include this at the top of your file or includes if you’re using `webpack`
