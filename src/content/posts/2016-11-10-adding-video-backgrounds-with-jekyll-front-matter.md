---
title: "Adding video backgrounds with jekyll front-matter"
slug: adding-video-backgrounds-with-jekyll-front-matter
date: 2016-11-10 13:27:57
tags:
- jekyll
- video
- liquid
categories:
- Development
authors: 
- Kevin Hougasian
video: /video/liquid
twitter_text: Adding video backgrounds with jekyll front-matter
---
Most of our web properties run on [jekyll](https://jekyllrb.com), [ebrokersoftware.com](https://ebrokersoftware.com), [theagentsurvivalguide.com](https://theagentsurvivalguide.com), and more slated for the coming year.

The RIMdev blog lets up both document and play with what may, or may not, work.

## What about Video headers?

Glad you asked! We currently check the post front matter and, if `image:` is listed, serve accordingly.

{% raw %}
```
{% if page.image %}
  {% assign postImage = page.image %}
{% elsif post.image %}
  {% assign postImage = post.image %}
{% else %}
  {% assign postImage = site.default_image %}
{% endif %}
```
{% endraw%}

{: .ui.info.message }
Why `page` AND `post`? Our main page is `assigned` [as a post](https://gist.github.com/nimbupani/1421828).

### HTML5 video and fallback

Let's load the video in our front matter, and handle fallback and poster image in the post in our include. We're only dealing with `.mp4` and `.webm` here. Video conversion? [Cloud convert](https://cloudconvert.com/mp4-to-webm) does a decent job for now. So now we have:

```
---
layout: post
video: /video/clouds_over_the_mountain
---
```
We could have used a collection and repeated our 3 formats with the same name, but a single entry with now extention makes more sense while listing the path.

Now we're checking for and image or video:

{% raw %}
```html
{% if page.image %}
  {% assign postImage = page.image %}
{% elsif post.image %}
  {% assign postImage = post.image %}
{% else %}
  {% if page.video %}
    {% assign postVideo = page.video %}
  {% elsif post.video %}
    {% assign postVideo = post.video %}
  {% else %}
    {% assign postImage = site.default_image %}
  {% endif %}
{% endif %}

<video class="background"
	loop
	muted
	autoplay
	preload="auto"
	poster="{{ postVideo }}.png">
<source src="{{ postVideo }}.mp4" type="video/mp4">
<source src="{{ postVideo }}.webm" type="video/webm">
</video>
```
{% endraw %}

### What options do I have?

The [HTML5 Video Events and API](https://www.w3.org/2010/05/video/mediaevents.html) page is a good place to start. You can see everything the API exposes and what may suite your needs. Check out this link for more on the [element itself and attribute definitions](https://www.w3.org/TR/html5/embedded-content-0.html#the-video-element).

### Setting as background

Now we have to emulate `background-position: cover;` and we're done.

```css
  video.background {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    transform: translate(-50%, -50%);
  }
```

## Summary

Enjoy adding video to your jekyll project. Video content in this post is from the good folks at [DISTILL](http://www.wedistill.io/).
