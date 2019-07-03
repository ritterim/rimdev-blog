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
image:
image_url:
image_credit:
---

## Standard Polyfills for Front End

One of the challenges developers face is getting their application working across different browsers. If you are writing your JavaScript of es5 or ES2015 then you are probably using some polyfills to be able to target old browsers (or probably edge) to keep your application working. At the time of this articles Edges is being updated to their chromium-based version which helps with this issue a lot, but some people haven’t received that update yet. Standard uses like the spread operators are not supported in the JavaScript engine in the non-chromium-based Edge for example. Babel takes care of most of the heavy lifting with working in this area. If you need to support older browsers with current JavaScript frameworks you should be using Babel. This will take care of polyfills like promises, spread operators, and more. Below is a list of polyfills that we use that’s not included in babel to get our applications to reach current browsers with a version below the current and IE 11.

Supporting `fetch`. Most major browsers support fetch with then IE 11
[Browser Support](https://caniuse.com/#feat=fetch)

[whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch)


Custom Events. Most major browsers support Custom Events with only partial support in IE 11

[Browser Support](https://caniuse.com/#search=custom%20event)

[Custom-event-polyfill](https://www.npmjs.com/package/custom-event-polyfill)

URLSearchParams, Most major browsers support URLSearchParams except for IE 11 

[Browser Support](https://caniuse.com/#search=URLSearchParams)

[url-search-params-polyfill](https://www.npmjs.com/package/url-search-params-polyfill)

Custom Elements, this has good support with Firefox and Chrome. Only the newest version of Edge natively supports Custom Elements

[Browser Support](https://caniuse.com/#search=custom%20el)

[Document-register-element](https://github.com/WebReflection/document-register-element)



