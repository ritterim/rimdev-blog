---
layout: post
title: 'Vue 3 is official'
date: 2020-09-22 12:00:00
tags:
  - vue3
  - frontend
  - development
categories:
  - development
twitter_text: Vue 3 is official
authors: Seth Kline
image: https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2049&q=80
image_url: https://unsplash.com/photos/gdTxVSAE5sk
image_credit: Ray Hennessy
---

Get ready to celebrate because as of Friday September 18 2020  Evan You creator of the framework Vuejs made the announcement that **Vue 3 is officially released**.

Here are some of the exciting features that are now available.

## Vue 3 is Faster and smaller than before

The biggest reason to upgrade to Vue 3 is that you will have an immediate performance gain just by using it. Vue 3 has a brand new faster virtual DOM. This makes mounting your components faster. The size of the Vue 3 bundle is smaller so that it will be faster to download. You can also take advantage of tree shaking where the app will only download the javascript you need for each part of your app. If your using server side rendering you can expect speed increases of 2 to 3 times of what was in Vue 2. 

## Vue 3 makes it easier to reuse code on large enterprise web applications

With Vue 2 there were limited ways to reuses your code. They supported mixins which allowed you to move methods and datatypes from your component into a separate javascript file that you can reuse on other components in  your app. The idea of mixins is good but when used in a large application it can be very frustrating. You can't just import one function from a mixin you import all the functions. Any names of the functions in your mixin are put into the global scope of the component you are using them in so you have to remember them or you will have a conflict. Mixins makes debugging harder because you have to go from the component to the mixin to find out what is going on. This is a problem for anyone working on a team larger than one person.

Vue 3 solves this problem with the composition API. The composition API is similar to react hooks in that it allows you to reuse your code in a functional way. You can import the functions that you want and work them before your component is mounted in the new `setup` lifecyle method.

## Vue 3 fixes common pain points of Vue 2

You can now just write code in your component and not have to worry about making sure it is all nested in a div or another parent element. This is going to make it so much easier to work with components. In Vue 2 I would have to wrap so much of the code in templates just to get around this limitation of having one parent element.

Vue 3 allows you to use multiple v-models on an element. The v-model syntax has changed slightly but this allows you to be able to use the multiple v-models. Multiple v-models will allow new patterns for forms that will be easier to understand.

## Teleport makes working with modals fun again

Working with modals is a breeze with the new feature teleport. You can send data from deeply nested components to the parent or another part of your app. This is a common problem I ran into using modals where I have the logic for the modal in a child component but need the modal to display in a specific place in the parent to avoid z-index issues or to not look weird. This feature works with just wrapping the data you want to send in a teleport and then using an id or class to target where you are sending whats wrapped inside the teleport. 


## Suspense makes it easier to work with Async Data

Vue 3's suspense gives developers a better way of adding loading state to elements. A common pattern that I have run into is having to load data from an API. I would use a v-if the data isn't loaded yet to show a loading spinner. Using suspense you can simplify this process by wrapping your async data element in a `<suspense>`.  You then you use two templates with `<template #default>` or `<template #fallback>` The default template is what you want the component to look like when the data is loaded and the fallback is where you would put your loading spinner. 

I am excited for Vue 3, the changes that were made will make learning Vue a little harder with some of the functional programing aspects of the composition api. The benefits of having more reusable code are worth the complexity in my opinion. Having the ability to  to use multiple root elements and multiple v-models will make it easier to work with. The teleport feature and suspense will make it easier to keep up with the demands of a web app.

## further resources
[vue 3 source code](https://github.com/vuejs/vue-next/releases/tag/v3.0.0)
[Evan You Vue 3 announcement at Vuejs Global](https://www.youtube.com/watch?v=Vp5ANvd88x0&t)
[Natalia Tepluhina // Migrating a big old codebase to Vue 3: what I'm excited about at Vuejs Global](https://www.youtube.com/watch?v=K1JoWmXh4qA&t)
[What you'll love in Vue 3 by Alex Kyriakidis | VueConf US 2020](https://www.youtube.com/watch?v=feSVHEQ8ik4)
