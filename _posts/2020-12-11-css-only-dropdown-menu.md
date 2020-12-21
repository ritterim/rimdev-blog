---
layout: post
title: "CSS Only Dropdown Menu"
date: 2020-12-11 11:29:29
tags:
- CSS
- SCSS
- Mobile UX
- UI/UX
- frontend
categories:
- development
twitter_text: "You can make cool a dropdown menu without any JS"
authors: Ted Krueger
image:
image_url:
image_credit:
---

As someone who basically gets by when it comes to writing Javascript, I tend to look at things from a “I bet I could do this with CSS” standpoint. In this post, I’ll show you how you can do more with CSS and less or no javascript.

Earlier in my dev career I leaned heavily on jQuery to get me what I needed. In a situation like this, I would probably have used the `slideDown()` function or something similar. 

Now we use plain old vanilla JS to get us what we need. Let me show you how to make a pretty nice looking drop-down navigation using mostly CSS. The secret, max-height transition. 

<br>
<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="GRJBdEZ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Simple Nav Dropdown with css transition">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/GRJBdEZ">
  Simple Nav Dropdown with css transition</a> by Ted Krueger (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
<br>

Notice in the example above, when you click Dropdown Action, the dropdown menu displays. The dropdown has a `max-height: 0;` by default. After the click, we add a class of `active` to the dropdown and change the `max-height` property. I set it to be `100vh` when active. Remember, this is just a `max-height` so by doing this I’m saying the dropdown is going to be at most the height of the window. From here you could add some overflow styles to ensure that users could scroll so they see all the content within the dropdown, or you could change the number. The important part is that the number does need to be specific. Hopefully, this is something we see in the future for CSS, but for now `max-height` it is.

To ensure the transition is nice and smooth as the menu opens and closes, we’ll add `ease-in-out` for our `transition-timing-function`. The code will look like this:

```
transition: max-height var(--speed) ease-in-out;
```

Note: the `var(--speed)` is set above as `0.3s`. The timing function is key to the menu animating nice as it opens and closes. If we had set `ease-in` then it would open nicely, but “snap” shut when you close the menu.

Notice the only JS being used is to toggle a class on the dropdown and dropdown-action. This is pretty light for sure so it got me thinking… Could we make this dropdown work with no javascript and only use CSS? Let’s give it a shot. I think that would be pretty cool.

When thinking about how I would do this, the first thing I thought of was using a checkbox. That seems like the only way that you could still target a state in your code and trigger the max-height transition of your menu.

I’m not sure about the accessibility of having your mobile menu fire with a checkbox rather than a button, but that’s not really the point I’m trying to make. What I’m trying to say is, think outside the box and push the limits of what you can do with CSS. You can use height CSS transitions to get the same look that you could get by using `.slideDown()` (shout out to all my jQuery devs). 

Check out the working example below.

<br>
<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="LYVjBEL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="css only drop down nav">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/LYVjBEL">
  css only drop down nav</a> by Ted Krueger (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
<br>

The CSS here might seem a little more complicated regarding the `&:checked + label + .dropdown` but this is necessary. Also, note the structure of the HTML. You’ll want to be sure that the `label` and `site-nav` are siblings. This makes it easier to target the site-nav when the dropdown-action is checked. Plus, you wouldn’t want your menu to be wrapped by a label. We can use this structure in the dropdown menu for our submenus as well.

```
<li class="site-nav__item">
  <input type="checkbox" id="dropdown-menu" value="Dropdown Menu" class="dropdown-toggle">
  <label for="dropdown-menu" class="site-nav__link dropdown-action" aria-label="Toggle Dropdown">
    <span class="dropdown-toggle-text">Learn</span>
  </label>
  <ul class="dropdown">
    <li class="dropdown__item">
      <a href="#" class="site-nav__link">People</a>
    </li>
    <li class="dropdown__item">
      <a href="#" class="site-nav__link">Places</a>
    </li>
    <li class="dropdown__item">
      <a href="#" class="site-nav__link">Things</a>
    </li>
  </ul>
</li>
```

I think this stuff is pretty cool, and I hope you do too. Even if you don’t, that’s fine. I’m just happy you made it this far in the post. Anyways, I think it’s important to push the limits of what we think is capable of CSS, or any language for that matter. Get out of your comfort zone and try some new stuff. 
