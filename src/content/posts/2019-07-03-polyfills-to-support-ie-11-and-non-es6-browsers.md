---
title: "Polyfills to support IE 11 and non ES6 browsers"
slug: polyfills-to-support-ie-11-and-non-es6-browsers
date: 2019-07-03 12:43:23
tags:
- JavaScript
- Webpack
- Polyfills
categories: JavaScript
twitter_text: A list of polyfills the help modern JavaScript applications
authors: 
- Andrew Rady
image: https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1308&q=80
image_url: https://unsplash.com/photos/Q7wDdmgCBFg
image_credit: Matthew Guay
---

## Standard Polyfills for Front End

Getting your JavaScript applications working across all browsers is challenging. If you are writing your JavaScript using ES6 or ES5, then you are probably using some polyfills to be able to target old browsers (or Microsoft Edge). At the time of this post, Microsoft is rewriting Edge to be a chromium-based browser, which helps with cross-browser JavaScript discrepancies, but folks may not have upgraded Edge just yet.

One example of unsupported functionality in Edge includes the `spread operator`. The [Babel](https://babeljs.io/) library handles many cross-browser issues for you. If you need to support older browsers with current JavaScript frameworks, you should be using Babel. Babel will take care of polyfills like `promises`, `spread operators`, and more. Below is a list of polyfills that we use that Babel *does not handle*, which will get your applications working in browsers like Edge and IE11.

[Fetch](https://www.npmjs.com/package/whatwg-fetch), most major browsers support `fetch` other then IE 11 [Browser Support](https://caniuse.com/#feat=fetch)

[Custom Events](https://www.npmjs.com/package/custom-event-polyfill), most major browsers support `Custom Events` with only partial support in IE 11 [Browser Support](https://caniuse.com/#search=custom%20event)

[URLSearchParams](https://www.npmjs.com/package/url-search-params-polyfill), most major browsers support `URLSearchParams` except for IE 11 [Browser Support](https://caniuse.com/#search=URLSearchParams)


[Custom Elements](https://github.com/WebReflection/document-register-element), this has good support with Firefox and Chrome. Only the newest version of Edge natively supports `Custom Elements` [Browser Support](https://caniuse.com/#search=custom%20el)




