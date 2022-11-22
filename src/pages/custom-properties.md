---
layout: ../layouts/Post.astro
title: "CSS Custom Properties"
date: 2021-11-24 12:33:53
tags:
- css
- Sass
categories:
- css
twitter_text: Custom Properties allow you to change the value of a variable in your css or Sass. Find out how.
authors: "Ted Krueger"
image:
image_url:
image_credit:
---
Have you ever wanted to change the value of a Sass variable based on screen size, a state, or for any other reason that might require changing a Sass variable? Well you can’t. Not with a Sass variable anyway. But you can by using a custom CSS property. These are sometimes called CSS variables.

There have been times where I have defined a variable in Sass and then wanted to change it when that element is `.active` for example. Something like:

```
.element {
  $background: red;
  background-color: $background;

  &.active {
    $background: blue;
  }
}
```

 It was always frustrating that I couldn’t do this. Then I found out about custom properties. They work in standard CSS as well as Sass (scss files). It’s pretty awesome because now you can totally change the value of a variable. By using custom properties, the above code becomes:

```
.element {
  --background: red;
  background-color: var(--background);

  &.active {
    --background: blue;
  }
}
```

Notice the difference between how the two variables are used. When using a Sass variable, you define it with a `$` whereas with custom properties you need to start them with a double dash (`--`).

Sass variable: `$background: red`
CSS Custom Property: `--background: red`

You use them in your styles differently as well. Sass variables are more straightforward. You simply add the same variable into the style value. When using a custom property, you must return the variable name using the CSS `var()` function. 

Once you get the hang of it, you’ll never go back. I find that when inspecting websites lately, I notice things like colors and sizes being defined by custom properties a lot more. I think this has to do with how flexible custom properties are. I know I’ve been trying to use them more, but I try to learn why something is better before I dive right in. So far, I can’t say that I have seen a situation where a Sass variable would be more beneficial than a custom property, so why not just use custom properties? 

Want to learn more about custom properties? <a href="https://css-tricks.com/" target="_blank">CSS-TRICKS</a> literally wrote <a href="https://css-tricks.com/a-complete-guide-to-custom-properties/" target="_blank">A Complete Guide to Custom Properties</a>.
