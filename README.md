# rimdev.io

Photography by JJ Walck

## Setup

1. Install latest version of node *(if not already installed)*
2. Clone repository
3. `cd` into repository
4. `npm install`
5. To run: `npm run start` 

## Creating posts

- Browse to `src/content/posts/`
- Create a new markdown file
  - Filename should follow this convention: `YYYY-MM-DD-POST-TITLE.md`
  - Required Frontmatter:
    - `title` - name of the post
    - `slug` - permalink for the post
    - `date` - post date
    - `authors` - array of authors
    - `tags` - array of tags
    - `categories` - array of categories
    - `twitter_text` - text that will display when shared to twitter
    - `image` - post header image
    - `image_url` - url where image is sourced from
    - `image_credit` - owner of the image

### Adding an image

Add images to the `public/images/` directory. Inside posts you can include these by linking just off of `images/`.

### Example Markdown File

When you create a new post, you need to fill the post information in the front-matter, follow this example:

```
---
title: "How to use"
authors: 
- <Your name here>
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
### CC Attribution blog images

Using a Creative Commons image requiring attribution?

```
image: https://farm5.staticflickr.com/4103/5029857600_d8ed3aaa06_b_d.jpg
image_url: https://www.flickr.com/photos/khawkins04/
image_credit: Ken Hawkins
```

### Author pages

Author pages are located in `src/content/authors`

```
---
name: Bill Boga
slug: bill-boga
image: /images/default/annex-billboga.jpg
avatar: https://avatars2.githubusercontent.com/u/3382469?v=3
title: Senior Software Developer
desc: Polyglot with focus on C#. Also enjoy building and tinkering with hardware.
twitter: billbogaiv
github: billbogaiv
---
```

### Pets Page

Pets can be added by adding a 500x500px photo to `public/images/pets/` and adding information to the `src/data/pets.json` file. 