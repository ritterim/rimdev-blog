---
layout: post
title: "The Key to the Vue v-for"
date: 2018-10-22 11:36:00
tags:
- JavaScript
- Vue
categories:
- JavaScript
twitter_text: "The Key to the Vue v-for"
authors: Jaime Jones
image: https://images.unsplash.com/photo-1522794338816-ee3a17a00ae8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=28707e35e45dd456c20daa5dee1b5396&auto=format&fit=crop&w=1267&q=80
image_url: https://unsplash.com/photos/o9KNLaITFYw
image_credit: Debby Hudson
---

If you're familiar with Vue at all, you're probably familiar with the `v-for`. And if you've used any other front end frameworks, they each provide ways to loop over data and markup within your HTML template. The purpose of this post is to talk about the `key` attribute that is required on every `v-for`, and what makes it so important.

I'll be the first to admit, when I started writing Vue, the `key` attribute wasn't required. When it become required, I shrugged, simply added an index, and moved on.
```html
<h1 v-for="(thing, index) in things" :key="index">{{ thing }}</h1>
```

This article really is about the `key` attribute which is now strongly suggested (or can be required by a linter) on all usages of `v-for` and some of the issues that you may run into if you go the common route of using the `index`. I'd recommend reading the actual [Vue documentation](https://vuejs.org/v2/guide/list.html#key) for it as either a follow-up or some background knowledge.

The background of _why_ we are now required to include a `key` in our loops is to provide Vue with an easy way of being able to watch what items in your array (or object, since looping over objects is allowed) is changing. The default behavior of the `v-for` is to track things by the index, so the method that I showed above is actually rather redundant. By tracking the index, Vue watches for changes in the order of items, and will actually patch each item in place when the order changes. The Vue documentation even notes that "this default mode is efficient," but there are caveats to it and it is not ideal in every use case.

Whenever possible, as suggested by the Vue documentation, you should use the unique id of the item. The reason for this is so that  Vue can more accurately track changes in the items in your array and update the component state to reflect this, and also to be able to reuse and reorder existing components rather than having to essentially re-render the entire loop.

For the sake of our examples below, let's use books. We have a list of books, that we loop over and render in a `book-cmp`.

Let's say our template looks like this:
```html
<div class="book">
  <h1>{{ book.title }}</h1>
  <div v-if="isCheckedOut" class="label">Checked Out</div>
</div>
```
We display the book's title, and a label that lets us know if the book is already checked out.

Our actual component looks like this:
```javascript
export default {
  name: 'Book',
  props: ['book'],
  data() {
    return {
      isCheckedOut: null
    }
  },
  mounted() {
    this.checkBookStatus(book.id);
  },
  methods: {
    checkBookStatus() {
      axios.get(`/book-status/${book.id}`)
        .then(res => {
          this.isCheckedOut = res.data.isCheckedOut;
        })
    }
  }
}
```
For the sake of our simple example, let's say that we have the book passed in as a prop, but we have to call a separate system to actually check if the book is checked out. Perhaps this system takes into account information such as the user's local library or something.

Let's say we loop through the books like so:
```html
<book-cmp v-for="(book, index) in books" :key="index" :book="book"></book-cmp>
```

This works fine... at first. Let's say the user can add new books to the system. But we want those new books to show up at the top of the list, rather than the bottom. If we were appending to the list, nothing would break down because the `index` would still be new. But if we are prepending to the list, the indices don't change in the list until the bottom, where the previous last one has been pushed out of place to be treated as "new."

Can you see what the issue might be here, if Vue is not accurately tracking the first index as being new? The component will never re-mount, and therefore, our `checkBookStatus` will never run to update whether our book is checked out. Instead, the value of `isCheckedOut` will be that of the previous book.

To elaborate, let's say the book at the top of my list was "Harry Potter & The Sorcerer's Stone" and this book had `isCheckedOut: true` after the check ran. I then added "The Stand" to my list of books, which appeared at the top of my list as a result of an `unshift` on our `books` array. The problem is that now, the component containing "The Stand" still contains the state from "Harry Potter & The Sorcerer's Stone" because the `index` never changed, the only thing that changed was the `book` passed through as a prop. Therefore, "The Stand" will show that it `isCheckedOut: true`, regardless of whether this is actually the case or not.

We could argue that maybe `isCheckedOut` should be a `computed` value (which it probably should), but an easy fix for this would actually be to just rely on the `key` attribute. If we instead use the `book.id` as the key, Vue will be able to properly track the changes and add a new component to the top and re-order the rest.
```html
<book-cmp v-for="book in books" :key="book.id" :book="book"></book-cmp>
```

## The tl;dr
The tl;dr from all this is that it's easy to just use the `index` and not run into any problems as long as you're always appending to the end, or have a simple list. This is a great way to do things (and the default used by Vue) as long as you aren't doing more complex list manipulation. But the moment that you start having state in the component itself that relies on the prop, or changing the lists in a way that isn't just tacking things on at the end, use a unique id.

Again, for more information on the `key` used in the `v-for` I would recommend checking out the [Vue documentation](https://vuejs.org/v2/guide/list.html#key), which is excellent!
