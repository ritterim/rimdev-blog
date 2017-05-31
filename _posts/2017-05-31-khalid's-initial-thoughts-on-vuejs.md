---
layout: post
title: "Khalid's Initial Thoughts On Vue.js"
date: 2017-05-31 11:43:15
tags: [ "Vue.js", "JavaScript", "frontend", "clientside" ]
categories:
twitter_text: ".@buhakmeh initial thoughts on @Vue.js"
authors: Khalid Abuhakmeh
image: https://Vue.js.org/images/logo.png
image_credit: Vue.js
image_url: https://Vue.js.org
---

The RIMdev team composition is a unique blend of disciplines forged in the crucible of time. We have backend developers, frontend developers, designers, quality assurance engineers, and data engineers. With that cauldron of experience, it isn't a suprise that their are a multitude of opinions about the best way to build software in 2017. From my perspective, here is a short list of consensus:

1. User experience über alles (UX is king).
1. Centralizing and *"Normalizing"* data access via APIs.
1. Thin clients with limited business logic is ideal.
1. Speed is a feature.
1. Static site generation whenever possible.

Open questions:

1. Do we want to exclusively build SPAs?
1. Which client-side frameworks / libraries to use? (Angular, React, and/or Vue.js)
1. When should we move to ASP.NET Core? (I think we can soon)
1. Docker?

This post focuses on the client-side questions and specifically my thoughts on [Vue.js](https://Vue.js.org). 

## Do We Want To Exclusively Build SPAs?

SPAs stir up a tempest of emotions in me. The first emotion is excitement:

>  "Cool, a new tool! It will solve all my problems and I love a challenge." 

The second emotion is dread:

> "What if everything goes wrong and this makes everything worse?".

Caution being the last emotion: 

> "I should think about this..." 

Should we build only SPAs? The short answer is `no`, but the long answer is more complicated.

For Ritter Insurance Marketing, there are two kinds of web properties our team builds: `Marketing Sites` and `Applications`. For marketing properties, it makes sense to sparingly use JavaScript in the form of components. Components give the appearance of a dynamic site while enhancing an otherwise static experience. This blog is a good example of that. Our search component is written by Nathan and it works amazingly. `Applications` tend to have more interactions and center around complex resources. Applications is where it makes sense to leverage a SPA approach.

### My Opinion

> To provide a productive and enjoyable user experience, we should build an `application` that leverages client-side features. When building `marketing` sites, a JavaScript heavy or exclusive experience may detract from our goals and be counter productive.

How do we provide a great `application` user experience? We want to start by picking a library or framework.

## Which Client-side Framework?

As of writing this post, there are three obvious contenders. I don't feel as a team we have to use one framework mutually exclusive of the others: Angular, React, and Vue.js. The one that is my personal favorite is **Vue.js**. Why?

1. Has a powerful yet simple model. No wondering if I need a provider, service, or factory. Also, no Fluxing yourself up. 
1. The difference between an instance and component are minimal, so working with either is an easy mental shift.
1. Two-way binding makes for clear `JavaScript-only` logic.
1. Implicit proxies utilizing `this` is awesome magic.
1. Instance/Component structure is easy with properties like `methods`, `watch`, `data`, and my favorite `computed`.
1. Did I mention reusable components?
1. An opt-in philosophy that helps avoid `The Big Rewrite` risks.
1. Lots of plain old JavaScript (and by old, I mean ES6).
1. Vue-CLI is nice.
1. Vue-loader to combine `HTML` and `JavaScript` in one file for compilation.
1. Composition is a strong concept with `components` definied on the Vue.js instance.

Those are some of my personal highlights with my admittedly short time with Vue.js. Ultimately, I admire Vue.js and its opt-in approach. Choosing when it makes sense to use a component, an entire SPA approach, or even nothing at all gets a big thumbs up. Other frameworks come across as forcing you to drink directly from their philisophical `Kool-Aid` firehose. Vue.js asks that you sip at your own pace :).

