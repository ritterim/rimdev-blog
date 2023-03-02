---
title: "Jekyll article sell-by dates"
slug: jekyll-article-sell-by-dates
date: 2016-08-03 14:24:16
tags:
- Jekyll
- UX
categories: 
- Jekyll
twitter_text: "Tell your users how old a #Jekyll post is #UX"
authors: 
- Kevin Hougasian
image: https://c6.staticflickr.com/1/145/339331301_25e470c90a_b.jpg
image_url: https://www.flickr.com/photos/29205886@N08/
image_credit: Bill Couch
---
So much work has gone into [rimdev.io](https://rimdev.io), and we like to keep content fresh, or at least let you know you may be reading an old or outdated article. Enter the _freshness_ scale.

Leading every article on [rimdev.io](https://rimdev.io) is a heart rate icon (hover over it for our rating scale). Doesn't seem that difficult, so how did we get there using [Jekyll](https://jekyllrb.com)?

## Get the dates

Get values for `today` and `posted`; subtract `posted` from `today`. If you're new to [liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) syntax, it's the `minus` pipe.

{% raw %}
```html
{% capture today %}{{ "now" | date: "%s" }}{% endcapture %}
{% capture posted %}{{ page.date | date: "%s" }}{% endcapture %}
{% capture freshness %}{{ today | minus: posted | date: "%s" | date: "%j" | floor }}{% endcapture %}
```
{% endraw %}

## Gotcha

So this worked great, we had our _freshness_ date, right? What about articles a post dated for the same day, today? Let's see if they're the same day of the year `%j` (1-365). Note `freshness | times: 1`, `freshness` is a string until here.

{% raw %}
```html
{% capture compareToday %}{{ today | date: "%j" | floor }}{% endcapture %}
{% capture comparePosted %}{{ posted | date: "%j" | floor }}{% endcapture %}

{% if compareToday == comparePosted %}
  {% assign freshness = 0 %}
{% else %}
  {% assign freshness = freshness | times: 1 %}
{% endif %}
```
{% endraw %}

## Apply freshness stamp how you see fit

From here, we assigned classes to determine _freshness_, you can handle it how you see fit!

{% raw %}
```html
{% if freshness <= 30 %}
  {% assign class = "new" %}
{% endif %}
{% if freshness > 31 and freshness < 190 %}
  {% assign class = "old" %}
{% endif %}
{% if freshness > 191 and freshness < 364 %}
  {% assign class = "stale" %}
{% endif %}
{% if freshness > 365 %}
  {% assign class = "rubbish" %}
{% endif %}
```
{% endraw %}
