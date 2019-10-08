---
layout: post
title: 'Artifact Conference 2019'
date: 2019-10-07 12:00:00
tags:
  - care
  - performance
  - UI/UX
  - frontend
  - development
categories:
  - development
twitter_text: Artifact Conference 2019 Recap
authors: Seth Kline
image: https://images.unsplash.com/photo-1539519760679-0648579aaae4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2049&q=80
image_url: https://unsplash.com/photos/Us1YhqPT-iw
image_credit: Dwayne Hills
---

How are we building our websites? Are they truly for everyone or if we ask ourselves honestly are they just for us? The way we currently build our websites was up for discussion at Artifact Conference 2019.

[Artifact Conference](https://artifactconf.com/) is the work of [Jennifer Robbins](https://twitter.com/jenville) who wrote the book on [web design.](https://www.learningwebdesign.com/) The conference last met 5 years ago and it was at a time where people were trying to figure out how to design for phones and other devices. Today in October 2019 there are new problems as access to the web grows to more countries and one in four U.S adults has a [disability](https://www.cbsnews.com/news/1-in-4-u-s-adults-has-a-disability-cdc-says). We need to change how we build our websites by focusing on mobile performance, accessibility, and design systems.

## Mobile Performance Matters

[Tim Kadlec](https://timkadlec.com) started the conference off showing how we are building a world of excess. Our websites are growing larger.

### Over the last 5 years

- images are 191% larger
- javascript has increased in size 616%

He showed us that the average person is using a cheap android phone that is two to three years old.
["We've built a web that largely dismisses affordable typical smartphones and the people that use them."](https://noti.st/tkadlec/vK0IfW#swv6syJ)

### Solutions

- test with android phones that are two years old
- use lighter javascript frameworks like [Preact](https://preactjs.com/) instead of React, [Nuxt](https://nuxtjs.org/) instead of Vue or [Svelte](https://svelte.dev/) that compiles to Vanilla JS

## Simplifiy Javascript Frameworks

[Chris Ferdinandi](https://gomakethings.com/) made us question why our current javascript frameworks are so complicated.

- Javascript is one of the most expensive resources we send to mobile phones
- Javascript blocks rendering
- complex tools create barriers to entry

### Solutions

- use css for animations
- think small and modular
- use pollyfills
- build in layers plan for if things go wrong

## Role of Frontend Developer has changed

[Chris Coyier](https://chriscoyier.net/) talked about how things have changed in the last five years as frontend developers beyond just dealing with browsers. Its hard for any one person to be able to keep up with all of these things.

- component driven design development
- doing things that were backend only
  - changing URLs
  - making queries with GraphQL
  - security
- We also need to be able to pull off the design

## Accessibility

[Elle Waters](https://simplyaccessible.com/) talked about how it is important to test your app with people with disabilities. When testing with blind people they found that some do not use video monitors when browsing a website. Without a monitor responsive websites will go into a default size and show the mobile version of the site. They never would of thought to test screen readers in mobile view.

- keyboard accessibility is most important thing
- make it easy for people to recover from errors
- provide multiple ways for people to interact with your forms
- build accessibility testing into your workflow
- use assistive technology sparingly

[Mina Markham](http://mina.codes/) showed us the importance of giving description alt tags. When working on the Hillary Clinton Campaign website instead of using the alt tag “Hillary Clinton Logo” for the logo she used a description from the designer of the website to paint a picture of what the logo looks like.

- use fallbacks if javascript does not work
- use high contrast assets
- don't remove defaults like focus rings, create better defaults

## Design Systems

Design systems were talked about as a solution to common problem we are having with complexity. [Dan Mall](https://superfriendlydesign.systems) talked about how design systems don’t need to scare designers that they will be replaced by the design system.

- gives designers freedom from designing the same thing over and over again
- more time to work on custom elements that would of not of been finished in past

[Dave Rupert](https://daverupert.com/) showed us how he utilized a design system to improve the performance of a large clients website.

- patternize to reduce complexity
- your website is a manafestation of your organizations problems

[Brad Frost](https://bradfrost.com/) talked about how design systems and style guides can keep our sanity and align different departments of our team.

- don't fall into special snowflake snydrome
- create minimum viable artifacts
- with a good design system you may not need a comp

I enjoyed the Artifact Conference and would recommend it to any other developer or designer. The organizers did a really good job of making each attendee feel valued, and with the smaller size of the conference under 200 people it was very easy to talk to everyone, including the speakers. I hope this conference will continue next year and we won't have to wait another five years.
