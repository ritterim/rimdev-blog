---
layout: ../layouts/Post.astro
title: "Writing a Browser Compatible Date Input"
date: 2019-10-24 13:00:00
tags:
- JavaScript
- Vue
- HTML
categories:
- JavaScript
twitter_text: "Writing a Browser Compatible Date Input"
authors: Jaime Jones
image: https://images.unsplash.com/photo-1435527173128-983b87201f4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1347&q=80
image_url: https://unsplash.com/photos/FoKO4DpXamQ
image_credit: Eric Rothermel | @erothermel
---

Working with dates can seem a little daunting sometimes. We need specific formatting, and hopefully we don't have to deal with timezones at all. Dates come up a lot though, so it's important to be able to work with them. Luckily, we have the handy `<input type="date">`, which we can just use and have things nicely formatted and know that the user is going to provide the date in an expected format.

## The Problem

We decided that we can use `<input type="date">` to easily tackle this issue, right? Unfortunately, if you have to support legacy browsers at all, it isn't that simple. Internet Explorer and Safari do not support date inputs.

## The Solution

I'll break down the solution and why it works, but if you'd like to get a look at the code and play with it yourself, there is a CodePen demo available.

[**WORKING DEMO ON CODEPEN**](https://codepen.io/jaime-lynn/pen/MWWmrbN)

Luckily, the solution to this is relatively painless. Here at RIMdev, we use Vue.js, and so our solution will examine how to write a simple date input with our favorite front end framework, but this kind of behavior could absolutely be translated to other use cases.

**The important part to note here is that even if you have `<input type="date">` in Internet Explorer or Safari, it will render as `<input type="text">`.**

The fact that the input type renders as text when date is not supported allows you to check whether or not the user's browser supports date inputs without having to do any kind of checking about what browser the user is on. If the input is a date input, you can simply exit out of any additional methods (or run anything you would, such as additional events) and move on. If the input is a text input, then we can fall back into some good old fashioned regex to trim and format the date input as the user types.

A caveat to the solution - if you are checking to format the input on any type of keyup or keypress event, it is a good idea to ignore the backspace and delete actions so that the user doesn't run into unintended formatting as they are clearing the input.

**This solution has been confirmed to work in Internet Explorer, Safari, and even Netscape!**

## A Breakdown of the HTML Attributes

There are additional values that you can put on your input that will only take effect in the case of it being a text input. We ended up with something like this:

```html
<input
  ref="dateInput"
  type="date"
  v-model="myDate"
  @keyup="trimDate"
  maxlength="10"
  placeholder="yyyy-mm-dd">
```

- The `ref` is a value to get the element or component instance in Vue. This just allows us to quickly reference the input itself and check whether or not it is a date input or a text input.
- We set it to type of date, since that's what we want in compatible browsers, and we know it will render as a text input if it is not supported.
- Placeholder does not have an effect on date inputs, but for text inputs, we can have this in place to notify the user of the format they should follow for their date. We used the standard format of `yyyy-mm-dd` used by the date input so that we could always be sending dates formatted the same way without additional parsing on our end.
- Maxlength also does not do anything on a date input, but in the case of a text input, it will go into effect and ensure that our users do not enter anything longer tha a standard date.
- In our use case in Vue, we have the value of the input linked to our `myDate` property, which will work regardless of the rendered type of the input.
- We have our `trimDate` method that checks whether or not the input is rendered as date or text, and then if it is a text input, enforces formatting to follow the expected `yyyy-mm-dd` pattern (the breakdown of this method can be seen in the [CodePen demo](https://codepen.io/jaime-lynn/pen/MWWmrbN)).

This provides a relatively easy solution to working with date inputs and having suitable fallbacks for older browsers without having to pull in extra libraries. If you'd like to play around with this a bit more, remember that a demo can be found [here](https://codepen.io/jaime-lynn/pen/MWWmrbN)!
