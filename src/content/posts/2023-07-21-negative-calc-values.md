---
title: "Setting A Negative Value With Custom Properties"
slug: setting-a-negative-value-with-custom-properties
date: 2023-07-21 11:27:06
tags: 
- frontend
- css
- Sass
categories:
- frontend
- css
twitter_text: "Here's how you can set a custom property to a negative value using the calc() css function."
authors: 
- Ted Krueger
image: https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80
image_url: https://unsplash.com/photos/3-Tc_5LROrM
image_credit: Kelly Sikkema
---

I want to show a quick demo of how you can use custom properties and set them to a negative value. I don't want to bore you with any explaination. This ain't no Pintrest recipe about a great german potato salad. Let's check out the code.

```css
--header-height: 150px;

header {
  height: var(--header-height);
}

.other-class-that-needs-negative-something {
  margin-top: calc(var(--header-height) * (-1));
}
```

_Now_ I'll explain. If you were to try `-#{var(--header-height)}` you would get something like, `margin-top: -var(--header-height)`, which the browser will not know what to do with. You can instead use the `calc()` css function to take your variable and multiply it by `-1`, boom. 

