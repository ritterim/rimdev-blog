---
title: ".finally understanding the promise chain"
slug: finally-understanding-the-promise-chain
date: 2022-07-28 12:00:00
tags:
- JavaScript
- Async
- Promises
categories:
- JavaScript
twitter_text: ".finally understanding the promise chain"
authors: 
- Jaime Jones
image: https://images.unsplash.com/photo-1570460147789-4e2e622bbb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80
image_url: https://unsplash.com/photos/2zGTh-S5moM
image_credit: Miltiadis Fragkidis
---

The value of Promises in Javascript cannot be overstated. They are used everywhere, helping to navigate the asynchronous maze that comes with frontend development. There is an intimate familiarity with `.then` and `.catch`, allowing the handling of whether asynchronous actions were successful or not.

But if `.then` runs once upon the resolution of a promise and `.catch` runs on the rejection of a promise, when exactly does `.finally` run? `.finally` runs after a promise is settled, regardless of whether it was resolved or rejected - this means that `.finally` runs after either the `.then` or the `.catch`.

This sounds obvious, but what does it actually mean? Let's look at a few examples - although for the sake of clarity I will be using `Promise.resolve()`, it applies to any promise that you may have there.

If the following code block were to execute...

```javascript
Promise.resolve()
  .finally(() => {
    return 'Finally!';
  })
```

...what value would be returned? You might think that we would get back `'Finally!'`, but in this case, we would actually get back `undefined`.

Let's dive into this a little bit deeper. The promise runs, and it either resolves or rejects (in the case of the code above, it resolves). If it resolves or rejects, a `.then` or `.catch` will trigger respectively if provided. At this point, the promise is considered settled, and _then_ our `.finally` will trigger. However, as the promise is already settled by the time the `.finally` triggers to run, it is impossible to `return` a value from it.

Let's look at another example:

```javascript
let response = null;

Promise.resolve()
  .then(() => {
    response = 'Resolved!';
    Promise.resolve()
      .then(() => {
        response = 'x2!';
      })
  })
  .finally(() => {
    response = 'Finally!';
  })
```

In the example above, we are setting `response` with a different string value based on where we are in the execution of the code. We also have a second promise nested within the `.then`.

We would expect `response` to first be `null`. Once the promise resolves, it would set to `Resolved!` as the `.then` triggers, both setting the response value and calling another promise.

This is where it gets a little tricky. We actually end up with a race condition. In the case of our explicit `Promise.resolve()`, it resolves before the promise is finished settling, and so we end up setting the value to `x2!` and then the promise settles, the `.finally` triggers, and we get `Finally!`. While this scenario is unlikely in practice as asynchronous calls do not resolve quite that quickly, it is still good to be aware of.

If this were a true asynchronous call happening, we would instead have the `.finally` trigger, setting the value to `Finally!`, and then our second promise would resolve, setting our variable to its final value of `x2!`.

In summary, asynchronous code always adds complication into development, and it's important to be able to accurately track what code is running in what order so that you can properly anticipate the state of your application. Hopefully this was helpful in giving an idea of when `.finally` runs on our promises!
