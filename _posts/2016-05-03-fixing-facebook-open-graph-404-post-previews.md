---
layout: post
title: "Fixing Facebook Open Graph 404 Post Previews"
date: 2016-05-03 09:57:08
tags:
- Facebook
- Social Media
- SEO
image: https://farm9.staticflickr.com/8650/16210559169_d7ebf083ec_k_d.jpg
image_url: https://www.flickr.com/photos/manoftaste-de/
image_credit: Christian S.
categories: SEO
twitter_text: Fixing Facebook Open Graph 404 Post Previews
authors: Khalid Abuhakmeh
---

**TL;DR use the [Facebook Open Graph Debugger](https://developers.facebook.com/tools/debug/) to refresh the scraping cache.**

In 2016, a successful site must have a strong social media strategy. The best sites to promote our professional content include Facebook, Twitter, LinkedIn, and Google+. The best kind of promotion comes from our readers, traditionally known as "word of mouth". Providing share buttons enables visitors to easily share with their social networks.

Here is an example of share buttons on a recent site.

![share buttons](/images/fixing-facebook-404-share/share-buttons-agent-survival-guide.png){: .img-fluid .border }

You will also find them on this post, so please use them. We always appreciate sharing.

When we tested the share buttons, we saw our 404 page as the preview. Note the title of  "Something went wrong?" in the preview. No matter what we tried to do, we could not get Facebook to refresh the preview.

![share buttons](/images/fixing-facebook-404-share/share-404-error.png){: .img-fluid .border }

It felt like Facebook was caching our Open Graph metadata and was not refreshing. That is when we realized there was an [Open Graph debugger](https://developers.facebook.com/tools/debug/).

![Facebook Open Graph Debugger](/images/fixing-facebook-404-share/facebook-debugger-screenshot.png){: .img-fluid .border }

Note that **Time Scraped**, in the screenshot, was 18 hours ago. By pressing the button **Scrape Again**, you ask Facebook to get the latest version of your page. Now let's see what the preview looks like.

![Facebook Preview Fixed](/images/fixing-facebook-404-share/facebook-preview-fixed.png){: .img-fluid .border }

Fixed!

## Why Does This Happen?

In our case, there are two reasons this behavior happened.

1. Somehow the shared url was being previewed before it went *live*. This makes sense with Jekyll and our staging environments.
2. Some of our posts were using the **future** feature in Jekyll. Someone may have shared the post via Facebook before the post went live.

The outcome is rooted in Facebook's aggressive caching strategy. Remember, they are Facebook, servicing **billions** of individuals.

## Conclusion

SEO and promotion are important. Leveraging existing social networks is critical for promotion, but expect to make mistakes. By utilizing powerful debugging tools, we get a more accurate sharing experience and more readers.

If you know of any other great SEO debugging tools, we'd love to hear about them in the comments.
