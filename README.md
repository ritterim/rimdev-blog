# rimdev.io

Photography by JJ Walck

## Setup

1. Install Ruby v2 *(if not already installed)*
2. Clone repository
3. `cd` into repository
4. `gem install bundler`
5. `bundle install`
6. To run: `bundle exec jekyll serve` with optional `--incremental` flag

> As of Jekyll 3.3, `_config.local.yml` is [no longer needed](https://github.com/blog/2277-what-s-new-in-github-pages-with-jekyll-3-3).

## New in this release (2.0)

- [Jekyll 3.3](https://github.com/blog/2277-what-s-new-in-github-pages-with-jekyll-3-3), [release notes](https://jekyllrb.com/news/2016/10/06/jekyll-3-3-is-here/)
- [Semantic-ui 2.2](http://semantic-ui.com/)
- [Jekyll feed (now Atom flavoured)](https://github.com/jekyll/jekyll-feed)

## Creating posts

You can use the `initpost.sh` to create your new posts. Just follow the command:

```
./initpost.sh -c Post Title
```

The new file will be created at `_posts` with this format `date-title.md`.

When you're done, run `npm run check` to check it over.

### Adding an image

Adding an image is easy enough, remember to add the semantic-ui responsive image classes `.ui.fluid.image`. If you want to add a light border, use `{: .ui.fluid.image.border}`

```
[ Your image description, i.e., alt tag content ]( /path/to/image.jpg ){: .ui.fluid.image}
```

## Image captions

For an image with a caption use:

```
[![Example](https://example.org/image.png)](https://example.org)
[https://example.org](https://example.org){: .caption}
{: .ui.center.aligned.container }
```

## Front-matter

### Posts

When you create a new post, you need to fill the post information in the front-matter, follow this example:

```
---
layout: post
title: "How to use"
authors: <Your name here>
date: 2015-08-03 03:32:44
image: "/images/my-great-image.jpg"
image_url: <url/page associated with image>
image_credit: <name for image credit>
tags:
- jekyll
- template
categories:
- I love Jekyll
twitter_text: "How to install and use this template"
---
```
If the page has no image, `image:` can be omitted entirely. A default system image will be used. If `image_credit:` is specified, then `image_url:` should also be specified.

> TAGS: Check existing Tags [here](http://rimdev.io/tags/) before creating new ones

**The difference between single and multiple authors:**

```
# single author
authors: <author name>

# multiple authors
authors:
- <First author>
- <Second author>
```
### CC Attribution blog images

Using a Creative Commons image requiring attribution?

```
image: https://farm5.staticflickr.com/4103/5029857600_d8ed3aaa06_b_d.jpg
image_url: https://www.flickr.com/photos/khawkins04/
image_credit: Ken Hawkins
```

### Author pages

```
---
layout: author
author: Bill Boga
permalink: /bill-boga/
image: /images/default/annex-billboga.jpg
avatar: false
---
```
The last 2 items are optional; If the page has no image, `image:` can be omitted entirely. A default system image will be used. You only need to include `avatar: false` if omitting your avatar.
