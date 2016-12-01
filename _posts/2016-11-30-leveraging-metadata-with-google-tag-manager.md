---
layout: post
title: "Leveraging Metadata with Google Tag Manager"
date: 2016-11-30 14:17:02
image: https://c5.staticflickr.com/6/5541/11033543924_0cbce68909_b.jpg
image_url: https://www.flickr.com/photos/nicolasgoulet/
image_credit: Nicolas Goulet
tags:
- metadata
- SEO
twitter_text: "Leveraging Metadata with Google Tag Manager"
authors: Kevin Hougasian
---

Our APIs expose data to [Ritter's](https://ritterim.com) quote engines based on product, marketplace, and url. As a leading FMO (Field Marketing Organization), our agents use these products and urls to service their clients.

How can we better leverage the resulting aggregation of data?

## Metadata

Metadata will provide us with richer metrics, and a means to see how our users are consuming the data.

```
<meta name="ritter" content="Ritter Insurance Marketing LLC" />
<meta name="ritter:agent" content="[name]" />
<meta name="ritter:agency" content="[agency]" />
<meta name="ritter:displaylicense" content="[license]" />
<meta name="ritter:npn" content="[npn]" />
<meta name="ritter:email" content="[email]" />
<meta name="ritter:phone" content="[phone]" />
<meta name="ritter:zipCode" content="[zipcode]" />
<meta name="ritter:state" content="[state]" />
<meta name="ritter:county" content="[county]" />
<meta name="ritter:fipsCode" content="[fipscode]" />
```

## Google Tag Manager

[New to GTM (Google Tag Manager)](https://www.google.com/analytics/tag-manager/)? We're going to assume you have an existing container for your Tags.  

### 1. Add a new GTM tag

![GTM - Add a new tag](/images/gtm/add-a-new-tag.png){: .ui.medium.bordered.image}

### 2. Configure your GTM tag for Universal Analytics

![GTM - Universal Analytics](/images/gtm/ga-universal-analytics.png){: .ui.fluid.bordered.image}

### 3. Add your [Google Tracking ID](https://support.google.com/analytics/answer/1032385?hl=en)

![GTM - Google Tracking ID](/images/gtm/ga-tracking-id.png){: .ui.medium.bordered.image}

### 4. Custom metrics

![GTM - Google custom metrics](/images/gtm/custom-metrics.png){: .ui.fluid.bordered.image}

### 5. Choose your trigger & publish

Set the trigger for your tag and you're ready to publish. Once published, your new metadata will propagate in Google Analytics.
