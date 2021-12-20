---
layout: post
title: "Creating RSS Feeds Using Hugo"
date: 2021-12-17 09:26:27
tags:
- Documentation
- Hugo
- XML
- RSS
categories:
- Documentation
twitter_text: Creating XML Feeds Using Hugo
authors: Steliana Vassileva
image: /images/documentation/rss-feed.png
image_url: https://cdn.socialchamp.io/wp-content/uploads/2021/03/RSS-Feed-1.png
---

## Docs and Contextual Help

We recently started a push towards integrating Docs content into our software platform.

The goal is to pull information from our Documentation site and offer contextual help, allowing users to find answers to questions without opening a separate link or system.

Contextual help can improve usability and product adoption, while also decreasing user frustration. Another benefit of this approach is that we don't have to duplicate help content that already exists in our Docs repository.

## The JSON Precedent

We've been working primarily with JSON in our Hugo-based Docs project.

For example, we created a glossary of terms endpoint that can be used across multiple web properties. When our sites include references to FMOs, we can pull the definition from the JSON and display it to curious visitors.

![Glossary of Terms JSON](/images/documentation/hugo-glossary-json-endpoint.png)

## The XML Way

For the next phase, we aim to pull video tutorial resources to display in our platform. Instead of JSON, we're creating an RSS feed using Hugo.

Hugo comes with its own [RSS 2.0 template](https://gohugo.io/templates/rss/), which can be customized to add or remove nodes. You can also add logic to tailor the output. Conveniently for us, the [default output format](https://gohugo.io/templates/output-formats/#default-output-formats) for section landing pages is HTML and RSS.

With this information in mind, we're going to customize our section-level RSS template to serve our purpose.

1. Add the correct [media types](https://gohugo.io/templates/output-formats/#media-types) and [output formats](https://gohugo.io/templates/output-formats/#output-formats-for-pages) to your site config. The **baseName** is the filename used to access the feed via URL.

    ```toml
    [outputFormats]
        [outputFormats.RSS]
            mediaType = "application/rss+xml"
            baseName = "feed"
    ```

2. Update the [RSS template](https://gohugo.io/templates/rss/#the-embedded-rssxml) that ships with Hugo.

    Our first change lets us control the start and end points for summary statements that appear in the description node. Some of this logic is based on Hugo's [manual summary splitting](https://gohugo.io/content-management/summaries/#manual-summary-splitting) capabilities and the more summary divider.
    
    We also added two new video nodes containing Wistia IDs for video playback. Here we pull the first video ID from the array in the page's front matter.

    ![Hugo Section XML RSS Template Changes](/images/documentation/hugo-section-xml-rss-template-changes.png)

3. Name [the template](https://gohugo.io/templates/output-formats/#templates-for-your-output-formats). We used **section.xml**.

4. Save the new RSS template based on Hugo's [layout lookup](https://gohugo.io/templates/lookup-order/#examples-layout-lookup-for-section-pages) rules for section pages. We saved it under the **layouts/_default** directory in the root of the project.

5. Update the markdown.

    Create comments to pull the summary statement. Add the Wistia IDs to the page parameters in the front matter of your markdown file.

    ```markdown
    +++
    title = "Quote"
    wla = true
    videos = ["h00oey4l3i"]
    videosWla = ["w9zo4jpozf"]
    +++

    ## Overview

    <!--start-summary-->The Medicare Quote Engine is a 
    proprietary quoting system developed exclusively for
    agents. It allows producers to quickly quote the 
    leading types of plans in the senior insurance market.
    <!--more-->
    ```

6. To confirm the output is correct, check the XML for the section.

    ![Hugo Section XML Output](/images/documentation/hugo-section-xml-output.png)

Hugo makes the task of creating JSON and RSS feeds almost effortless. Now we're ready to pull in any videos, descriptions, or relevant links to provide help directly in our product or websites. Context-sensitive resources at specific points in the software will provide users with quick answers to their most commonly asked questions.