---
title: "Animated Scroll Effects"
slug: animated-scroll-effects
date: 2022-05-18 12:00:00
tags:
- CSS
- SCSS
- JavaScript
- UI/UX
- Frontend
- Animations
categories:
- development
twitter_text:
authors: 
- Ryan Trimble
image: https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80
image_url: https://unsplash.com/photos/R5A_YlcSJwA
image_credit: Shubham Dhage
---

I’m a huge fan of animation on the web, especially when it comes to user interaction. A simple way to include such a thing on webpages is by triggering some sort of effect when scrolling.

Elements fading in and out to tell a story. Background colors changing to differentiate page sections. Cards and content popping in at various points on the page. These types of things can enhance the user experience on your page.

The [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) provides a vanilla JavaScript approach to adding scroll effects by triggering functions when elements intersect certain points of the viewport. Intersection observer can be difficult to work with, so a library such as [Animate on scroll](https://michalsnik.github.io/aos/) may make things simpler. 

My personal favorite library to animate with is the [GreenSock Animation Platform](https://greensock.com/). GSAP is useful for all sorts of animations, including scroll triggered effects. 

To show this off, let’s build a neat effect I came across on a website recently! The website included a hero section containing text. As you scroll the page, the text scales to highlight the importance of the message.

For this demo I have created a [Codepen](https://codepen.io/mrtrimble/pen/gOvLPgM) to follow along with. I already included HTML, CSS, GSAP, and the ScrollTrigger plugin, so no need to set anything up! We’ll focus on the JavaScript to find out that with a few lines of code, we can build a neat scroll trigger animation.

### Demo
One of the key things GSAP provides as a library is the ability to create animations based on a **timeline**. This enables much more complex animations than what CSS keyframes provide. To create a GSAP timeline, we can initialize like so:

```js 
const tl = new gsap.timeline();
```

Now we are able to describe what animations should occur within that timeline - we can do that with **tweens**. Tweens explain what the animation should do be**tween** the start and end of the timeline. 

Tweens take in two key parameters:
- The element you want to animate.
- An object explaining how the element will animate, including CSS properties to animate.

You can include as many tweens as needed to complete the animation. GSAP includes three different types of tweens:
- `.to()` - animates an element *to* something.
- `.from()` - animates an element *from* something.
- `.fromTo()` - animates an element *from* one thing *to* another.

Pretty straightforward! To create tweens, we can tack them onto the timeline. To make things even easier, we can chain tweens together.

So in our example, we want to create a tween that scales the `.scale-text` element to a large size:

```js
const tl = new gsap.timeline();

tl.to('.scale-text', {
  scale: 10
});
```

The animation should trigger, however that is not quite what we want yet - we want this to happen on scroll. This is where the GSAP ScrollTrigger plugin comes in!

Inside where we initialized our timeline, we can configure ScrollTrigger:

```js
const tl = new gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    scrub: 1
  }
});

tl.to('.scale-text', {
  scale: 10
});
```

The `scrollTrigger` object contains some configuration properties:
`trigger` - specifies what element will trigger the animation.
`start` - tells GSAP at what point to start the animation. In our example it is when the top of the element reaches the top of the viewport.
`scrub` - enables the scrollbar to become the scrubber for the animation. Setting this as `true` will enable this, but specifying a duration will smooth out an animation.

There is a lot of ways to configure ScrollTrigger. I recommend checking out the [GSAP ScrollTrigger documentaiton page](https://greensock.com/scrolltrigger/) to find out more!

Now, our animation may not look like it is doing anything, but when you start scrolling you should see it kick off. The text "empowering people" will scale up in size. Our scroll trigger animation is working and we did that with only a single tween too! 

Here are a couple of small enhancements we can add as well:

```js
const tl = new gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    scrub: 1
  }
});

tl.to('.scale-text', {
  scale: 10
})
.to('.hero', {
  opacity: 0
}, '<25%')
.to('.cards', {
  opacity: 1,
  duration: 1,
  y: 0,
  stagger: 0.5,
  ease: 'back.out(1.7)'
}, '<25%');
```

I added two more tweens:
- The first will fade out the `.hero` element as it scrolls out of view.
- The second will pop the cards into view as they scroll.

This adds slightly more interesting effects to the page. There are a couple of other fun things to note happening as well: 

- The `<25%` part is a positional timing parameter that tells the tween when to start. Tweens generally start right after another, but with this we can tell the tween to start sooner or later in the timeline. 
- GSAP can animate a single element or an array of elements, such as our `.card` elements. We don't want all the cards to animate in at the same time, so we include a `stagger` property to make each have a delay.
- Easing is a method of smoothing out animations and can make tweens feel more natural while transitioning. GSAP can handle easing with the `ease` property and has several built in easing functions. You can play with these eases with the [ease visualizer](https://greensock.com/ease-visualizer/) and find out which is best for your animations.
- GSAP also includes shorthand properties such as `x` and `y` that correspond with the CSS `transform` property. 


### Final Result
So there you have it, a super neat animated scroll trigger effect that is only a few lines of JavaScript!

<iframe height="500" style="width: 100%;" scrolling="no" title="Finished - Scroll Trigger Demo" src="https://codepen.io/mrtrimble/embed/zYRoGgZ/7545ac69b915f060e1585b886719a856?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mrtrimble/pen/zYRoGgZ/7545ac69b915f060e1585b886719a856">
  Finished - Scroll Trigger Demo</a> by Ryan Trimble (<a href="https://codepen.io/mrtrimble">@mrtrimble</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

(For best results, view on [Codepen](https://codepen.io/mrtrimble/pen/zYRoGgZ/7545ac69b915f060e1585b886719a856))