---
layout: post
title: "Targeting Devices For Hover Effects: A web developer's journey"
date: 2022-05-06 11:11:43
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
  
```scss
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
@media (pointer: fine), 
@media (pointer: coarse) {
  &:hover {
    styles here
  }
}
```

The problem is this will target mobile devices as well. I was assuming that Jeff's cool cursor would fall under the `pointer: coarse` umbrella, "...a pointing device of limited accuracy". I was wrong. This media feature targets mobile, or touch devices. So that won't work either.

Time to do some more digging. I found `hover: hover`. I don't know why I didn't use that before. I'm going to assume it's because I first implemented this before good browser support. Anyway, this seems to make more sense to use.

`hover: hover`: "The primary input mechanism can conveniently hover over elements." Which would include devices using a mouse.

`hover: none`: "The primary input mechanism cannot hover at all or cannot conveniently hover (e.g., many mobile devices emulate hovering when the user performs an inconvenient long tap), or there is no primary pointing input mechanism."

`hover: hover` also doesn't work for Jeff but `any-hover` does. There is a slight difference between the two.

> The **`any-hover`** CSS media feature can be used to test whether _any_ available input mechanism can hover over elements.

The keyword here is _any_. There is also an `any-pointer` media feature as well.

> The **`any-pointer`** CSS media feature tests whether the user has _any_ pointing device (such as a mouse), and if so, how accurate it is.

Now we're getting somewhere with Jeff's setup. But it was still frustrating to know exactly what would work for his machine. I created this codepen to help figure out what would work for Jeff.

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="GRQpYWR" data-user="PhiloBeddoe" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/GRQpYWR">
  Do you see what I see?</a> by Ted Krueger (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

It turns out that Jeff is using one of those laptops that double as a tablet. While at his desk, he can flip the keyboard around while using a Bluetooth keyboard and a separate mouse. This turns Jeff's machine into a tablet.

When Jeff was working in what I'll call "tablet mode" he would see:
 
- Any Pointer Coarse
- Any Hover None
- Pointer Coarse

I see the same thing when I check out this pen on my phone.

To be honest, Jeff's setup is quite unique. I would assume most people don't work like this, but I've been wrong before.

When Jeff flipped the keyboard back, like a standard laptop, he was seeing:

- Any Pointer Fine
- Any Pointer Coarse
- Any Hover
- Hover
- Pointer Fine

This is a little more interesting because we still see "Any Pointer Coarse". When I view this pen on my laptop I see this same list minus "Any Pointer Coarse". After setting his cursor back to normal, and checking the pen again, Jeff's machine still shows "Any Pointer Coarse" in the list. Weird.

After all of this digging I found that Jeff's setup is a bit out of the ordinary... maybe. If he were using his machine like a laptop `@media (pointer: fine)` _would_ have done the trick. So going forward, I think I'll wrap my hover styles like this:

```scss
@media (any-pointer: fine) {
  a {
    &:hover {
      box-shadow: inset 0px 0px 0 2em var(--lightblue), 0px 2px 0px 0px var(--med-blue);
    }
  }
}
```

I try to make sure that everyone has the same experience. Even though I don't like using size media queries to target hover styles, I'm going to use one here for Jeff.

```scss
.jeffs-eyes-only {

  @media (any-pointer: coarse) {
    
    // targets tablet mode
    // output css: @media (any-pointer: coarse) and (min-width: 1024px)
    @media (min-width: 1024px) {
      display: block;
    }
    
    // covers jeff for standard laptop mode.
    // output css: @media (any-pointer: coarse) and (any-pointer: fine)
    @media (any-pointer: fine) {
      display: block;
    }
  }
}
```
