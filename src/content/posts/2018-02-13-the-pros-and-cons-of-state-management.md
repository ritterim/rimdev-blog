---
layout: post
title: "The Pros and Cons of State Management"
date: 2018-02-13 09:11:01
tags:
- Web
- Vue
- Vuex
- JavaScript
- StateManagement
twitter_text: "The Pros and Cons of #StateManagement"
authors: Jaime Jones
image: https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-0.3.5&s=fb28f9d00f928b34c168c4ca7c47a9fd&auto=format&fit=crop&w=1348&q=80
image_url: https://unsplash.com/photos/KigTvXqetXA
image_credit: Tim Gouw
---

Let's talk about state management for a minute. There's recently been a bunch of hubub about Redux on Twitter, and arguments about the usefulness of state management. Here at Ritter we haven't utilized Redux specifically, but we frequently leverage Vue's own state management library, Vuex.

I'm going to do a brief overview of Vuex and then talk about the pros and cons of state management. There's something that I will point out right now, and reiterate later: State management is a very useful paradigm, but it is _not_ intended for use in every single project.

## What is Vuex?
I'm going to do a quick summary of Vuex and how it works, but I recommend that you check out the [Vuex docs](https://vuex.vuejs.org/en/intro.html) if you are interested or just looking for a more in depth explanation.

Vuex is a state management library, aimed at creating a centralized source that can drive the rest of your application. It is composed of three main parts: State, Mutations, and Actions. For the sake of this explanation, we will use an example of a blog which must fetch the posts to display.

State houses the data that lives in your application, and can be referred to as your 'single source of truth.' No matter where in your application you access data that is housed in the state, it will remain the same across each component and each usage because it is coming from this single source. Note that these are all usually held in a `store.js` (or similar) and exported as a single piece via `export default { state, mutations, actions };` (or similar).
```
state: {
  posts: []
}
```

Mutations are methods where we actually modify the data properties on the state. These mutations can be accessed from anywhere within your application, but they serve as a way of interfacing with the state through your application. Mutations are called through `commit`, and must take in the state so that it can modify it, and can optionally take in a payload.
```
mutations: {
  setPosts: (state, payload) => {
    state.posts = payload;
  }
}
```

Actions are methods that trigger mutations, and actions are also where you would house any asynchronous operations. Actions are called through `dispatch`. Actions can take in the different methods that it can use (such as `commit`, or `dispatch`, and the `state`) and an optional payload.
```
actions: {
  getPosts: ({ commit, state }) => { // this is where the optional payload parameter could be passed in
    axios({ method: 'get', baseURL: state.baseUrl, url: '/posts' })
      .then(res => {
        commit('setPosts', res.data);
      })
  }
```

In this quick example built out above, we have a property called `posts` on the state. It starts off as empty, because that data lives in our database. We would begin by calling the `getPosts` action from our actual application (I usually would accomplish something like this by firing off a `this.$store.dispatch('getPosts');` from a mounted in the component that uses the posts). That action then asynchronously grabs the needed data, and then calls the necessary mutation via the `commit` to actually modify the `posts` property on the state.

This is a simplified example, but it shows the basic workflow behind state management (at least on the Vuex side of things) to give you an idea. Again, I recommend checking out the docs linked above if you'd like more information.

## The Pros and Cons of State Management
Alright, so the above workflow is really cool and we use it a lot. At least in Vue, it's fairly easy to set up and quick to get going with. It allows us to nicely separate out our concerns, keeping items that concern the entire application stored in a centralized location rather than having to trickle data multiple component levels down via props. We also know that anywhere in the application that we access that piece of data, it will always be accurate because it is coming from our single source of truth. The initial setup work more than makes up for itself in the work we don't have to do keeping data in sync and trickling things down from obscure locations.

You are able to keep local components only modifying its own local properties, and if it has to call for a change to the state, it can do so by simply calling for an action or a mutation.

This being said, sometimes we try to overutilize state management. If something isn't used application wide (or at least across multiple components) that should really be kept in the local state. Likewise, if iterating over a list of items, and you have a component for each item in the items, there may be details about each _item_ that should be held in local state, rather than attempting to hold individual details within the state. State management is something that becomes more useful as a project scales, and you should always ask yourself before you add something to your state, "Does this really need to be shared across the application?"

It's a pattern that takes practice, and if you have a small project that doesn't need to grab information from a centralized point because the root of your application itself can easily serve as that centralized point, you may be better off just sticking to that.

I think the most important thing to keep in mind when looking at state management as something you may want to use is this: **Do what works for you.** Everyone's brains work differently, everyone looks at things differently. If one paradigm really works for you, go for it! But don't be afraid to branch out either and look at different ways of doing things. Whether you end up utilizing that different way of doing something or not, you are still likely to learn things that you may be able to carry over into various points in your own work.

For me, state management is a nice pattern (especially since virtually every project we work on here boasts the scale that makes state management excel), but if you don't like it, that's okay! Nothing in software will ever be the be-all and end-all. There are pros and cons to each thing we do, and state management is no different.
