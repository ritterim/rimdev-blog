---
layout: post
title: "Customizing VueJS components with scoped slots"
date: 2020-06-29 16:09:19
tags: 
- VueJS 
- Slots 
- Scoped Slots
- JavaScript
categories:
- development
twitter_text: "Customizing components with scoped slots"
authors: Chidozie Oragwu
image: https://images.unsplash.com/photo-1590336225155-d7e19a3a954f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2400&q=80
image_url: https://unsplash.com/photos/BjIALEkr_Wg
image_credit: Lee Thomas
---

If you have used slots in Vue, you know that it provides a clean way to vary content that is displayed in child components. For example, consider a Pagination component that will be used throughout your app: 

```
// Pagination.vue

<template>
  <div>
    <button @click="previous">
      <slot name="previous-page">⬅️Previous Page</slot>
    </button>
    <button @click="next">
      <slot name="next-page">Next Page ➡️</slot>
    </button>
  </div>
</template>
<script>
export default {
  methods: {
    previous() {
      // fetch previous page in result set
    },
    next() {
      // fetch next page in result set
    }
    ... //more code and logic for pagination
  }
}
</script>
```

The component provides a slot for us to override the button text if we want. 

We can then either use the component wholesale on a page that lists all clients:

```
// ClientsList.vue
...
    <Pagination></Pagination>
    //  👆🏻 "Previous Page" and "Next Page" is rendered in the respective buttons
...
```

OR we can customize the text to show in the buttons:

```
<!-- ClientsList.vue -->

...
    <Pagination>
      <template slot="previous-page"><< Previous Clients</template>
      <template slot="next-page">More Clients >></template>
    </Pagination>
    <!-- 👆🏻"<< Previous Clients" now takes the place of "Previous Page" and "More Clients >>" replaces "Next Page" -->
...
```
 
This is great! We can now easily encapsulate all the paging complexity in one component while retaining some flexibility in how it is displayed. We go ahead and use Pagination throughout our codebase, customizing the text in specific instances as we please. 

A few weeks down the line, we may have new requirements to show the available pages so that users can navigate right to a specific page in the range. To solve this, we could add some props to Pagination  to control which version of pages to display via v-if/v-else  - but then what happens if we get yet more requirements to display it another way based on yet other scenarios? Now we have the potential for `Pagination` to get unwieldy and hard to maintain. What if pagination can stay unchanged but provide a way for the consuming components have full control over how paging is displayed while still benefiting from the encapsulated logic? This is where scoped slots come in.

Lets see how we would solve the use case for Laying out all the available pages for easier navigation:

```
<!-- Pagination.vue -->

<template>
  <div>
    <slot :previous="previous" :next="next"> 
   <!-- 👆🏻we wrap all the content that can be overridden in a <slot> tag and make `previous` & `next` methods (and any other internal properties we want) available for each consumer of the component to attach to their overrides as they choose -->
      <button @click="next">
        <slot name="previous-page">⬅️Previous Page</slot>
      </button>
      <button @click="next">
        <slot name="next-page">Next Page ➡️</slot>
      </button>
    </slot>
  </div>
</template>
...
```

With the changes above, we have successfully offloaded the overriding of the mark up to the consumer and selectively expose the previous  and next methods from within the scope of Pagination  up to which ever parent wants to customize the behavior. With can now use the below code snippet to layout all the pages:

```
<Pagination>
  <template slot-scope="{ next, previous, getPage, paging }">
    <!-- 👆🏻we accept the parameters being passed up from the child scope and are able to use them within the confines of the slot markup below 👇🏻-->
    Page {{ paging.page }} of {{ paging.totalPages }}
    <ul>
      <li>
        <button @click="getPage(1)"><< First</button>
      </li>
      <li v-for="pageNumber in paging.totalPages" :key="pageNumber">
        <button @click="getPage(pageNumber)">{{ pageNumber}}</button>
      </li>
      <li>
       <button @click="getPage(paging.totalPages)">Last >></button>
      </li>
    </ul>
  </template>
</Pagination>
```

This is the result of the default usage and our cutomized usage sided by side:

<figure>
    <img src="/images/paging.png" style="max-width: 100%">
    <figcaption>
        Default usage versus customized version via scoped slots.
    </figcaption>
</figure>

<embed src="https://codesandbox.io/embed/infallible-brown-g8sl4?fontsize=14&hidenavigation=1&theme=dark" width="100%" height="500">
