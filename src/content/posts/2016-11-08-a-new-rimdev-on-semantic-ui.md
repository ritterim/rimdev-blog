---
title: "A new RIMdev on Semantic-ui"
slug: a-new-rimdev-on-semantic-ui
date: 2016-11-08 13:40:42
tags:
- Semantic-ui
- UX
twitter_text: "Switching to #Semantic-ui and loving it!"
authors: 
- Kevin Hougasian
image: https://c6.staticflickr.com/4/3719/12485014293_2b8652cff0_b.jpg
image_url: https://www.flickr.com/photos/stavos52093/
image_credit: Stavos
---
So you may have noticed a new look for the [RIMdev](https://rimdev.io) blog ;) Our blog will always be a work in progress and a chance to try new things. Version 2 showcases [semantic-ui](http://semantic-ui.com/) 2.2 while being powered by [jekyll 3.3](https://jekyllrb.com/docs/upgrading/2-to-3/) on [Github pages](https://github.com/blog/2277-what-s-new-in-github-pages-with-jekyll-3-3).


## Getting started

You can [get started](http://semantic-ui.com/introduction/getting-started.html) with semantic-ui a few ways. A straight download, as a Node [npm package](https://www.npmjs.com/package/semantic-ui) with gulp, or the CDN release.

Each has its own benefits. Both download and npm package allow you to pick and choose the components your going to use. Not knowing how the switch to semantic-ui would go, or which components were to be included, we opted for the CDN release (look in [recipes](http://semantic-ui.com/introduction/advanced-usage.html)).

## And we were up and running.

Semantic-ui is really well documented, and well suited for rapid app development. This new release has a great feature set and transitions that really leave [Bootstrap](https://getbootstrap.com/) behind. Take a look at the [kitchen sink](http://semantic-ui.com/kitchen-sink.html) for the entire overview.

## What we liked

Here are some of the features we incorporated in the new RIMdev blog.

### Built-in fonts

A complete port of [Dave Gandy's](http://twitter.com/davegandy) [Font Awesome](http://fontawesome.io/) (v4.5.6 in semantic-ui's 2.2 release). Fast implementation using `icon font awesome` <i class="icons font awesome"></i> instead of `fa fa-font-awesome`. A win for ease of implementation and not having a second CDN call.

All of the FA states are supported; stacked, rotate, etc. Semantic-ui has added [their own twists](http://semantic-ui.com/elements/icon.html#/definition) with `circular`, `bordered`, `fitted`, `corner` icons and groups!

### Sidebar

Clicking on <i class="icon newspaper o"></i>, here or in the menu, pulls our new [sidebar](http://semantic-ui.com/modules/sidebar.html).

In our 1.0, it held a static position on the left, blurred when you were reading a post. We've pushed it away entirely, and now blur the post when you're browsing the sidebar. [Blurring](http://semantic-ui.com/modules/dimmer.html#blurring) was simple to add the the main pusher `class="pusher dimmable blurring"` and triggered on the `.sidebar()` event.

{: .ui.teal.message}
Update 2017.01.18: While blurring was a nice effect, performance suffered greatly when combined with the other semantic-ui effects. Blurring has been removed.

### Simpler, when you need it grid

Semantic-ui sets itself apart from other, more verbose, frameworks with it's [grid](http://semantic-ui.com/collections/grid.html), [container](http://semantic-ui.com/elements/container.html), and [segment](http://semantic-ui.com/elements/segment.html) system. Our post layout is simple and we were able to establish a responsive layout with this simple structure using `vertical segment`, `text-container`, and `stackable`. Some of the more popular frameworks would have tripled this easily.


```
<!DOCTYPE html>
<html>
<body>

  <div class="ui sidebar very wide vertical"></div>

  <div class="pusher dimmable blurring">

    <div class="ui vertical masthead segment"></div>
    <div class="ui borderless large top fixed menu"></div>
    <div class="ui borderless large secondary menu"></div>

    <div class="ui vertical stripe segment">
      <div class="ui middle aligned stackable text container">

        <article></article>

        <div class="articles-related">

          <div class="ui three stackable cards"></div>

        </div>
      </div>
    </div>

    <footer class="ui vertical segment"></footer>
  </div>

</body>
</html>
```
Our blog is open-source, if you're curious about more (like the horror that is [liquid](https://github.com/Shopify/liquid/wiki) #neccessaryEvil), [take a look](https://github.com/ritterim/ritterim.github.io).

## Summary

In short, semantic-ui was a big win for our blog. It's fast, flexible, and scary to think how nice 3.0 will be!
