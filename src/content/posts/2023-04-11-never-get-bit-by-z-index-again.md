---
title: "Never Get Bit by z-index Again"
slug: never-get-bit-by-z-index-again
date: 2023-04-11 14:31:06
tags: 
- frontend
- css
- custom properties
categories:
- frontend
- css
twitter_text: "Never Get Bit by z-index Again"
authors: 
- Ted Krueger
image: https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80
image_url: https://unsplash.com/photos/eMP4sYPJ9x0
image_credit: Alexander Grey
---

Sometimes I do things that make me very pleased with myself. I try to remain humble, but this is something that I thought fell into the too-good-not-to-share category. It has to do with z-index. Something that can be a developers worst enemy when writing css. What I'm about to share with you will _hopefully_ ensure you never lose your z-index order again.

I've been trying to use a lot more custom properties when writing css. So far, it has allowed us to write cleaner and more customizable css. Typically I think of values like color, font-size, and size (height, width) as values where you might set a custom property. I never thought to use one for setting z-index on a component. Until today.

In case you're not that familiar with how z-index really works, which is totally fine and understandable, let me give you a quick and dirty summary. 

- z-index will only work on those elements that are assigned a `position` other than `static`
- elements are essentially assigned a natural z-index based on their order in the stack
  - I like to think of elements like a deck of cards. Each sibling is stacked on top of the previous element
- nested eleements with z-index won't really do anything unless their parent element has a specific z-index
- For a more indepth read on z-index I encourage you to read [this post](/z-index-is-confusing/)

We're currently redesigning one of our websites, which will remain nameless, and we have some fixed elements at the top of the page. These elements require some z-index. We have a drawer that sits just below the header which contains some filters for a specific page. On this same page we want to show a table comparing selections but we still want the filters to show. Not a problem, we just need to make sure one z-index is higher than the other.

Here's what I did:

```css
.filters {
  position: fixed;
  z-index: 10;
}

.comparison {
  position: absolute;
  /* make sure the z-index is always lower than the filters */
  z-index: 9;
}
```

I added that comment so that when we look at our code we know the value is important. Also the comparison css is in a separate file and not acually directly underneath the filters css. So the comment makes a little more sense in that case. 

As I was reading my own comment I realized there is a pretty solid way we could make sure the filters z-index potentially changing never effects the z-index of the comparison. Custom Properties and sass functions to the rescue! Here's what I came up with:

```scss
:root {
  --filters-zindex: 10;
}

.filters {
  position: fixed;
  z-index: var(--filters-zindex);
}

.comparison {
  position: absolute;
  /* make sure the z-index is always lower than the filters */
  z-index: calc(var(--filters-zindex) - 1);
}
```

Voilá! We _shouldn't_ need the comment anymore but it doesn't hurt to have it. With this method, any change to the filters z-index will not effect how the 2 elements stack.
