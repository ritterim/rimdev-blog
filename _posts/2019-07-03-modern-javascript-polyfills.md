---
layout: post
title: "Modern JavaScript Polyfills"
date: 2019-07-03 12:43:23
tags:
- JavaScript
- Webpack
- Polyfills
categories: JavaScript
twitter_text: A list of polyfills the help modern JavaScript applications
authors: Andrew Rady
image: https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1308&q=80
image_url: https://unsplash.com/photos/Q7wDdmgCBFg
image_credit: Matthew Guay
---

## Standard Polyfills for Front End

One of the challenges developers face is getting their application working across different browsers. If you are writing your JavaScript of es6 or es5 then you are probably using some polyfills to be able to target old browsers (or probably Edge) to get your application working. At the time of this articles Edge is being updated to a chromium-based version which helps with cross browser discrepancies with JavaScript a lot, but some people haven’t received that update yet. For example the `spread operator` is not supported in the JavaScript engine in the non-chromium-based Edge. [Babel](https://babeljs.io/) takes care of most of the heavy lifting with working in this area. If you need to support older browsers with current JavaScript frameworks you should be using Babel. This will take care of polyfills like `promises`, `spread operators`, and more. Below is a list of polyfills that we use that’s not included in babel to get our applications to reach current browsers with a version below the current and IE 11.

[Fetch](https://www.npmjs.com/package/whatwg-fetch), most major browsers support `fetch` other then IE 11 [Browser Support](https://caniuse.com/#feat=fetch)

[Custom Events](https://www.npmjs.com/package/custom-event-polyfill), most major browsers support `Custom Events` with only partial support in IE 11 [Browser Support](https://caniuse.com/#search=custom%20event)

[URLSearchParams](https://www.npmjs.com/package/url-search-params-polyfill), most major browsers support `URLSearchParams` except for IE 11 [Browser Support](https://caniuse.com/#search=URLSearchParams)


[Custom Elements](https://github.com/WebReflection/document-register-element), this has good support with Firefox and Chrome. Only the newest version of Edge natively supports `Custom Elements` [Browser Support](https://caniuse.com/#search=custom%20el)




