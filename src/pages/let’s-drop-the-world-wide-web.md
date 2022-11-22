---
layout: ../layouts/Post.astro
title: "Let’s drop the world wide web"
date: 2016-12-07 11:54:30
tags:
- Web
- Development
twitter_text: "Let’s drop the world wide web - a plea to the internet"
authors: Kevin Hougasian
video: /video/dont-type-www
---
World Wide Web, that's what the "www" stands for in [www.rimdev.io](https://rimdev.io) - a show of hands for those who knew that?

## Why do we perpetuate a marker that has outstayed it's welcome?

It's a relic from the days of 56k modems and the golden age of [AOL](http://aol.com) when we had to explain the internet. When you could walk away from your computer, get coffee, have breakfast, come back and the page at the end that domain name might be loaded.

Antiques are fun to collect, and in today's culture, use ironically, but we don't wait for milk to be delivered, we don't have a chunk of ice delivered for the ice box? If you're [Apple](http://apple.com), you don't even use USB Type-B. Anyone remember USB Type-A? No, you don't! That's the point.

We've gone through over a decade of innovation in hardware, software, the internet of things, but we can't let go of a standard introduced by [Sir Tim Berners-Lee](https://www.w3.org/People/Berners-Lee/) in the world's [first web page](http://info.cern.ch/hypertext/WWW/TheProject.html) in the late 1980's. Even in it's introduction, Berners-Lee quickly abbreviated www to W3, which would become the World Wide Web Consortium, or [W3C](http://w3.org), the curators of modern web standards. Special thanks to [Jeffrey Zeldman](http://zeldman.com) for pointing out web standards to the internet with [Desiging with Web Standards](https://www.amazon.com/Designing-Web-Standards-Jeffrey-Zeldman/dp/0321616952) (you can also grab his free book [Taking your talent to the web](http://takingyourtalenttotheweb.com/)). So why do we persist?

## It will break the internet

The internet seems to cling to the antiquity that is the www prefix?

### Will my website break?

No. We've been building resilient re-directs for years! With very few exceptions, dropping the www will get you to the same domain. Type `google.com` and magically `www.google.com` is the link that appears.

We actively plan for this scenario, redirecting to the www prefixed domain. Why? Is it because no one will realize they're on the world wide web, ...er, internet?

### Why should I?

The short answer is progress. The long answer; you're actually going to a sub-domain of the main website. Any other instance of this practice is generally frowned upon. A sub-domain is treated, in any other case, as an entirely different website (and you're fracturing your SEO). The early mobile practice of `m.yourwebsite.com` has since been corrected thanks to [responsive web design](https://abookapart.com/products/responsive-web-design). `m` was the sub-domain  you were re-directed to when a *mobile* browser was detected. Why? Bandwidth and processors. Mobile devices weren't as powerful as your desktop or laptop, nor where cellular networks. Once again, this practice has mostly been abandoned as cellular networks improved and devices rival desktop and laptop experiences. Why is the www is still with us?

## An open plea to the internet

**Developers**: Stop redirecting to www, actively fight against it.

**Internet**: Stop referring to www, stop typing www, it won't break you.
