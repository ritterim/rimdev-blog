---
layout: ../layouts/Post.astro
title: "Platform UI background image and gradient utilities"
date: 2020-10-09 13:10:02
tags:
- UI
- UX 
- CSS
- Sass
categories:
twitter_text: "We've added background image and gradient css utilities to Platform UI!"
authors: 
- Kevin Hougasian
- Ted Krueger
image: https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1069&amp;q=80
image_url: https://unsplash.com/photos/U3cctUBucn0
image_credit: Ryan Stone
---

If you're not familiar with [Platform UI](https://style.rimdev.io/), it's a utility rich CSS framework we created.

As we look to migrate all of our apps and static sites to Platform UI, we realized that one of the core CSS issues we regularly hacked into place was background images. 

## Background image

Hack you say? Unfortunately, yes. Using [Jekyll](https://jekyllrb.com/) and [Hugo](https://gohugo.io/) regularly, we pull hero images from front matter. The only way to do that in these cases was inline. I know, gross! I agree!

```
<div style="background-image: url({% raw %}{{ .Params.backgroundImage }}{% endraw%}); background-repeat: no-repeat; background-size: cover;">
```

So how can we leverage our utilities in Platform UI to handle this - using data attributes? Welp, something like this would have been great! 

```
// HTML
data-background-image="{% raw %}{{ .Params.backgroundImage }}{% endraw%}"

// CSS
background-image: attr(data-background-image url)

```

Assigning `type` as `url` would have done it, but it's just an experimental feature for now. C'mon future CSS🤞

We were still fixed on data attributes as the solution. Enter Javascript (you had to see that coming). Same path, different implementation.

```
<div class="background-image" 
    data-background-image="{% raw %}{{ .Params.backgroundImage }}{% endraw%}"
    data-background-position="top left">
```    

## Background gradient

While the momentum was there, we thought `background-image: linear-gradient` would be a win as well! It was😀

So following the same process, we created a simple linear-gradient that takes in 3 arguments and a fallback. All are comma-separated, so you can add `to left` or `pink 20%`. 

```
<div class="linear-gradient ratio-16_9"
  data-gradient-direction="0deg"
   data-gradient-start="pink 20%"
   data-gradient-stop="skyblue"
   data-gradient-fallback="salmon">
</div>
```
Now we thought we were done - this came along.

```
<div style="background: 
  linear-gradient(to right, rgb(229, 245, 255) 35%, transparent) 0% 0% / cover, 
  url(data-background-image="{% raw %}{{ .Params.backgroundImage }}{% endraw%}") 
  center center no-repeat;">

```
## Combining background image and linear gradients

Following what we'd created to its logical conclusion, it Platform UI comes across `class="linear-gradient background-image"` we combine the 2.

```
<div class="linear-gradient background-image ratio-16_9"
  data-gradient-direction="to right"
  data-gradient-start="var(--pui-green)"
  data-gradient-stop="transparent"
  data-gradient-fallback="var(--pui-green)"
  data-background-image="{% raw %}{{ .Params.backgroundImage }}{% endraw%}" >
</div>
```

To explore more on Platform UI Background utilities, [click here](https://style.rimdev.io/section-utilities.html#pui-utilities-background).
