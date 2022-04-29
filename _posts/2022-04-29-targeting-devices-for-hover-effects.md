---
layout: post
title: "Targeting Devices For Hover Effects"
date: 2022-04-29 11:11:43
tags:
- CSS
- SCSS
- Mobile UX
- UI/UX
- frontend
categories:
- development
twitter_text:
authors: Ted Krueger
image:
image_url:
image_credit:
---

I dedicate this blog post to all the QA testers that expose all the flaws in my code.

For a few years now I thought I had it all figured out when it came to hover styles. I wanted to make sure that mobile users weren’t getting hover styles. Before, we’ve seen hover styles applied on mobile devices when a user taps a link or button. This can be confusing to users if not only frustrating. It's confusing to interact with an element and see the state change, but nothing else happens. You remain on the same page, in the same place. Since mobile devices don’t detect a hover a user would need to tap or touch twice to get the action to fire. One way I found around this is to use the `pointer` media feature.

According to MDN:  
> The **`pointer`**  [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)  [media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#media_features) tests whether the user has a pointing device (such as a mouse), and if so, how accurate the _primary_ pointing device is.

Sounds good! So all we need to do is nest our hover styles inside the pointer media feature. Since I only want to target devices with a mouse I should use `pointer: fine`.  Which looks something like this:
  
``` scss
@media (pointer: fine) {  
  a {
    &:hover {
      box-shadow: inset 0px 0px 0 2em var(--lightblue), 0px 2px 0px 0px var(--med-blue);
    }
  }
}

```

MDN defines `fine` as, "The primary input mechanism includes an accurate pointing device." This works quite well unless one of your QA devs has some sort of fancy settings on their machine to change their cursor. Then it doesn’t work as well.

While testing a recent change to the hover styles on one of our sites, one of our QA Developers, Jeff, found that none of the styles were working for him at all. It took us a while to figure out what was going on. After he bragged about the fancy cursor he uses I figured that could be the culprit.

After inspecting my code a bit I noticed that I was wrapping the hover styles in the `pointer: fine` media feature. I did some debugging, followed by a little research into `pointer`.

The other values for the pointer feature are `none` and `coarse`. `pointer: coarse` seemed to make sense if my assumptions were correct on Jeff’s fancy cursor. "The primary input mechanism includes a pointing device of limited accuracy." Based on what Jeff was seeing, or rather _not seeing_, I figured his fancy cursor had to have "limited accuracy". Turns out I was right.

To make sure the hover effects would work on devices using a mouse, as well as those using a special cursor, I nested the styles inside both `pointer: fine` and `pointer: coarse`. It looks like this:

```scss
@media (pointer: fine), (pointer: coarse) {
  &:hover {
    styles here
  }
}
```

