---
title: 'Vue 3 is official'
slug: vue-3-is-official
date: 2020-09-22 12:00:00
tags:
  - vue3
  - frontend
  - development
categories:
  - development
twitter_text: Vue 3 is official
authors: 
- Seth Kline
image: https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2049&q=80
image_url: https://unsplash.com/photos/gdTxVSAE5sk
image_credit: Ray Hennessy
---

Get ready to celebrate because, as of Friday, September 18, 2020, Evan You, creator of Vue.js, announced **Vue 3 is officially released**.
Here are some of the exciting features that are now available.

## Vue 3 is Faster and smaller than before

The biggest reason to upgrade to Vue 3 is that you will have an immediate performance gain. Vue 3 has a brand new, faster, virtual DOM.

- Faster component mounting
- Faster downloads
- Faster server-side rendering (2-3x)

You can also take advantage of tree shaking, where the app will only download the javascript you need for each part of your app.

## Vue 3 makes it easier to reuse code on large enterprise web applications

With Vue 2, there were limited ways to reuse your code. They supported mixins, which allowed you to move methods and datatypes from your component into a separate javascript file. The idea of mixins is good, but when used in larger applications, it can be very frustrating. Importing a single function from a mixin with multiple functions isn't possible. The names of your mixin functions are put into the global scope of the component you are using, which may cause a naming conflict. Mixins make debugging harder because in larger teams where you have to reference the mixin to find the error, especially in cases where you didn't write it.
Vue 3 solves this problem with the composition API. The composition API is similar to React hooks in that it allows you to reuse your code functionally. You can import the functions that you want and work them before your component is mounted in the new `setup` lifecycle method.

## Vue 3 fixes common pain points of Vue 2

No more single root elements! You can now write code in your component and not have to worry about making sure it is all nested in a `div` or root element. This is going to make it so much easier to work with components. In Vue 2, I would have to wrap so much of the code in templates just to get around this limitation of having one root element.
Vue 3 allows you to use multiple v-models on an element. The `v-model` syntax has changed slightly. This new approach will allow new patterns for forms that will be easier to understand.

## Teleport makes working with modals fun again

Working with modals is a breeze with the new feature teleport. You can send data from deeply nested components to the parent or another part of your app. This is a common problem I ran into using modals where the logic for the modal is in a child component, but the modal needs to display in a specific place in the parent, to avoid z-index issues (or to not look weird). This feature works by wrapping the data you want to send in a teleport and then using an id or class to target where you are sending what's inside the teleport.

## Suspense makes it easier to work with Async Data

Vue 3's `suspense` gives developers a better way of adding loading state to elements. One pattern that I have run into is loading data from an API; I would use `v-if` the data isn't loaded, to show a loading spinner. Using `suspense`, you can simplify this process by wrapping your async data element in `<suspense>`. You then use two templates with `<template #default>` or `<template #fallback>`. The default template is what you want the component to look like when the data is loaded, and the fallback is where you would put your loading spinner.

## Vue 3 is worth the wait

I am excited about the release of Vue 3! The changes that were made will make learning Vue a little harder, with some of the functional programming aspects of the composition API. The benefits of having more reusable code are worth the complexity, in my opinion. Having the ability to use multiple root elements and v-models, will make it easier to work with. The teleport feature and suspense will make it easier to keep up with the demands of a web app.

## further resources

- [vue 3 source code](https://github.com/vuejs/vue-next/releases/tag/v3.0.0)
- [Evan You Vue 3 announcement at Vuejs Global](https://www.youtube.com/watch?v=Vp5ANvd88x0&t)
- [Natalia Tepluhina // Migrating a big old codebase to Vue 3: what I'm excited about at Vuejs Global](https://www.youtube.com/watch?v=K1JoWmXh4qA&t)
- [What you'll love in Vue 3 by Alex Kyriakidis // VueConf US 2020](https://www.youtube.com/watch?v=feSVHEQ8ik4)
