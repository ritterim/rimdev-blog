---
title: "Debugging Hugo Site Data and Page Variables"
slug: debugging-hugo-site-data
date: 2018-09-13 00:00:00
tags:
- Hugo
- JAMStack
- Static
categories:
twitter_text: "Debugging @gohugoio Site Data and Page Variables"
authors: 
- Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2276/2335756492_6c45911ddc_o_d.jpg
image_url: https://www.flickr.com/photos/jitze1942/
image_credit: Jitze Couperus
---

Hugo is an amazing static site generator, but getting lost when templating is easier than we'd like. We've found a way to evaluate variables present on the page that makes it easy to get back on track. If you're curious what value a variable currently holds, just use a `console.log`. 

In this example, I have placed a data file named `colors.json` in my data directory and want to know its values.

```html
<h1> Debugging, Check Console </h1>
<script>console.log({% raw %}{{ $.Site.Data.colors }}{% endraw %});</script>
```

The results from the Chrome Dev Tools.

![hugo console log]({{ "/images/hugo-console-log.png" | absolute_url }})

You can also just use the standard [`printf`](https://gohugo.io/templates/template-debugging/) debugging that comes with Hugo, but we find the Chrome Dev tool offers a nicer experience. Hope you found this helpful.