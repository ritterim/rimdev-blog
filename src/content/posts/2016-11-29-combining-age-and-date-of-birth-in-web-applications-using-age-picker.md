---
title: Combining Age and Date of Birth in Web Applications Using Age Picker
slug: combining-age-and-date-of-birth-in-web-applications-using-age-picker
date: 2016-11-29 10:00:00
tags:
  - Development
categories:
  - OSS
twitter_text: "Combining Age and Date of Birth in Web Applications Using Age Picker #javascript #ui #ux"
authors: 
- Ken Dale
---

Imagine for a moment you're an insurance agent selling a product to a client. You're working with an web application that requires the client's age. You ask the client. They reply with their date of birth. But, the field specifically asks for numeric age.

You have a few options:

- Do the math *(uggggh)*
- Ask the client for their age instead *(...you couldn't just figure it out?)*
- **Use [Age Picker](https://github.com/ritterim/age-picker) in your web applications!**

## Age Picker

**Age Picker is a JavaScript library that simplifies inputting ages in web applications.** It seamlessly handles both age and date of birth in the same field. It optionally provides dropdowns when only a year is provided for month and day, depending on the `data-` attribute used.

**[Try out a demo!](https://ritterim.github.io/age-picker)**

## Wiring it up

Age Picker is wired up by decorating an `input` tag with an `data-age-picker` or `data-age-picker-direct-entry-only` attribute and running simple wireup JavaScript.

**It can be as simple as:**

```html
<label for="age">Age or DOB</label>
<input type="text" id="age" name="age" data-age-picker />
```

```javascript
// With age-picker available:

new AgePicker().init();
```

## Project info

Age Picker is MIT licensed and available on GitHub. It's [age-picker](https://www.npmjs.com/package/age-picker) on the npm registry.
