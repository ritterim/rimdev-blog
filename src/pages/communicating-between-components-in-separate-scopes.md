---
layout: ../layouts/Post.astro
title: "Communicating between components in separate scopes"
date: 2018-02-12 16:20:15
tags:
- Web
- Vue
- JavaScript
twitter_text: "Communicating between #Vue components in separate scopes"
authors: Jaime Jones
image: https://images.unsplash.com/photo-1464851707681-f9d5fdaccea8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=195a5b97e8f03fed4b1beadfb78204da&auto=format&fit=crop&w=1405&q=80
image_url: https://unsplash.com/photos/VuPIUePS_vU
image_credit: Nick Baker
---

Here at RIMdev, we are big fans of Vue.js, as we've written about before. It scales well and is very versatile whether you're starting up a new project from scratch or incorporating into a larger, existing infrastructure.

But what happens when you have multiple Vue instances in a single project and you need to communicate between them? Why not just continue to leverage Vue to create an event system across your entire project? Enter the EventBus.

```
import Vue from 'vue';
export const EventBus = new Vue();
```

We can actually just initialize an empty Vue instance that allows us to take advantage of the emission system already built into Vue itself and then there's no need to reinvent the wheel.

Now, anywhere we want to utilize this, we can just bring it in and then use it from there!
```
import { EventBus } from 'EventBus';
```

We can easily send out any information that we might need to.
```
EventBus.$emit('eventName', eventData);
```

And on the other end, we can set ourselves up to listen for it.
```
EventBus.$on('eventName', (data) => {
  // handle the data
});
```

Now this idea of using Vue as an EventBus is not new, but I do think that it's worth noting due to its ease of use and versatility! In our case it provided an elegant solution to a difficult problem.

One of our projects features many completely separate Vue instances, each boasting with their own Vuex store. Most of the time, these truly are completely separate in terms of the information they present as well, but every now and then we came across a situation where we would want to share a small piece of information from one component to another. These small bits of information were usually just little UI pieces (think display number of items held in a separate component on a dashboard or menu), and certainly not worth making a duplicate (and ultimately unrelated to the scope of the displaying component) call for the data.

## Summary
We had run into the problem of separate scopes, and how to pass information across these scopes in an elegant manner. We were able to easily solve this by using the EventBus to emit events from one Vue instance, while the other Vue instance was set up to listen. Ultimately, this is just one small use case for the EventBus, but I think that it highlights the wide variety of uses and how a difficult question was solved quickly and efficiently, and taking advantage of technologies that we were already utilizing, just using them in different ways!
