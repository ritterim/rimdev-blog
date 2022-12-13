---
layout: ../layouts/Post.astro
title: "The story of our OpenID Connect implementation, live at NDC Oslo 2016!"
date: 2016-06-02 12:00:00
tags:
  - Authentication
  - OpenID Connect
  - Stuntman
image: https://c3.staticflickr.com/4/3850/15168077058_ecaae7debd_h.jpg
image_url: https://www.flickr.com/photos/jorneriksson/15168077058
image_credit: Jørn Eriksson
categories:
  - Events
twitter_text: "The story of our OpenID Connect implementation, live at NDC Oslo 2016!"
authors: Ken Dale
---

Last year we embarked on a mission to update the overall authentication and authorization strategy for [Ritter Insurance Marketing](https://www.ritterim.com/). After evaluating the different options, we replaced our existing home-grown multi-application solution with a cloud hosted OpenID Connect implementation, using [IdentityServer3](https://github.com/IdentityServer/IdentityServer3) and [BrockAllen.MembershipReboot](https://github.com/brockallen/BrockAllen.MembershipReboot).

As part of that, in order to meet our development-time impersonation needs we launched [Stuntman](http://rimdev.io/stuntman). Stuntman enables ASP.NET developers to have on-the-fly user switching in their applications, right in the browser. No application restart required!

I'm excited to be speaking about that experience at [NDC Oslo](http://ndcoslo.com/) this year! This will be my first time at an NDC conference, and my first visit to Oslo. Next week will be exciting! If you're attending NDC Oslo this year, I'll see you there! If you won't be attending, that's OK too -- just wait for the video. ;-)
