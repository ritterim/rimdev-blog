---
layout: post
title: "Welcome to Platform UI - our CSS framework"
date: 2022-06-10 10:43:13
tags: 
- CSS
- Frameworks
- RIMdev
categories: "Platform-UI"
twitter_text: "Platform UI a new CSS framework"
authors: Kevin Hougasian
image: https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2113&q=80
image_url: https://unsplash.com/photos/ln5drpv_ImI
image_credit: "@vincentiu"
---
It's been a few years, several great people, an awesome company, and a cool thing we made 😀

Once upon a time, we had a mixed bag of frameworks powering our web properties. [Bootstrap](https://getbootstrap.com/), [Semantic UI](https://semantic-ui.com/), and thousands of lines written in straight CSS (and a bit of [Less](https://lesscss.org/). Fast forward to where we have our stable CSS framework written in [Sass](https://sass-lang.com/) and a post-1.0 version that we're offering to the dev community! 

## Platform UI

![Platform UI](/images/documentation/new-platform-ui-website.png){: style="width: 100%"}

We wrote [Platform UI](https://platformui.com/) to serve our own needs, although we hoped to offer it to the public at some point. We cleaned up personal preferences for more general considerations, thought hard about ease of use, and wrote some utilities we don't see elsewhere. We didn't try to copy what the other frameworks were doing, but we're all based on the same thing - the W3C CSS standard. So you may see similarities along the way.

### It's easy

Add a CDN call to the head of your HTML document, a script call just above the closing `</body>` tag; you're up and running with Platform UI! We're using [UNPKG](https://unpkg.com/) here, but you can use other CDNs: [JSDELIVR](https://www.jsdelivr.com/), [Skypack](https://www.skypack.dev/)?

```html
<!-- In the <head> of your site. -->
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="stylesheet" href="https://unpkg.com/@ritterim/platform-ui/dist/platform-ui.min.css" crossorigin>
<!-- Directly before the closing </body> tag of your site. -->
<script src="https://unpkg.com/@ritterim/platform-ui/dist/js/platform-ui.min.js" crossorigin defer></script>
```
You can find starter templates at our [Launchpad](https://platformui.com/launchpad/templates/). More are on the way!

Here's a quick blog template just for you!

<p class="codepen" data-height="300" data-slug-hash="abEjeRO" data-user="hougasian" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/hougasian/pen/abEjeRO">
  Platform UI left nav blog template</a> by kevin hougasian (<a href="https://codepen.io/hougasian">@hougasian</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Icons

There's certainly no shortage of icon choices out there. Again, there were icons we needed in our ecosystem, so we thought we'd create our own instead of loading a set where we weren't going to use 90%. 

We pack [Platform Icons](https://platformui.com/icons/) right next to Platform UI, so once you've called the CDN, you have the framework and the icons all at once. 

### Utilities

We didn't go crazy with utilities, but we have created a solid selection that includes the ability to set [background images](https://platformui.com/docs/utilities/backgrounds/#background) and create [linear-gradients](https://platformui.com/docs/utilities/backgrounds/#gradient) straight in your markup! 

## Enjoy!

We hope you enjoy what we made.
 
