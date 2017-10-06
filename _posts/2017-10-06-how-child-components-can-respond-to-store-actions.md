---
layout: post
title: "How child components can respond to store actions"
date: 2017-10-06 12:47:23
tags:
- Web
- Vue
- JavaScript
twitter_text: "How child #Vue components can respond to store actions"
authors: Jaime Jones
---

At RIMdev, I spend most of my time writing Vue components. And I love it. But sometimes there's unique problems that can be encountered when trying to trickle data down to child components.

For the rest of this post, I'll be using Vuex and axios for examples. I'll give brief explanations about what each example call is doing, but if you aren't using Vuex and axios yet, the real question is: why not?

## The basic workflow

When employing a store, there's a basic workflow that's followed. Data populates initially to the store, and then different pieces are passed to the components that need knowledge of them. Any time data is updated, this process repeats, and it creates a workflow that follows the idea of a 'single source of truth.' Your data is always coming from one source, and therefore you know that it will always be accurate, and you can rely on the fact that it will always stay in sync across your components. As wonderful as this workflow is, maintaining your data in global state rather than local component state can present challenges. The one that I always seem to come across is when I'm trying to display errors.

## The scenario

The scenario that this generally happens in is this:
Imagine you have a collection of items, passed down from your global store. Those items are then iterated over, and each item is an instance of a component. Each one of these items can be deleted or updated. Going about these processes is, at face value, a very simple and easy thing. We can pretend we've got a nice little update button rendering on each item, and when we click that, we fire off our method that calls out to the store to update.

```
// in your single item's Vue template
<button @click="updateItem">Update</button>

// fires off the method
updateItem() {
  this.$store.dispatch('updateItem', this.item);
}

// triggers the store action
updateItem({ dispatch, commit }, payload) => {
  axios({ method: 'put', ...})
    .then(() => {
      dispatch('getItems');
    })
    .catch(err => {
      commit('setError', err);
    })
}

```

For your 5 second Vuex refresh, things like dispatches and commits are what help keep everything in your store in sync. A `dispatch` calls to the corresponding method on your `actions` list, which is where all asynchronous calls should be made. A `commit` takes a given payload and performs the corresponding `mutation`, which is where all changes to values on the global store should be made. In the above example, we click our update button, which calls the method `updateItem`, which then dispatches for the store to run the asynchronous `updateItem`. If we get a successful response, we go ahead and dispatch `getItems` to refresh our list. If we get a failing response, we may want to alert the user that something has gone wrong. If we get a successful response, we may want to let the user know this as well, or we can just let them assume that it worked because obviously they expect our code to work all the time (it totally does, I promise).

We can see one way of doing this in the above example, where we `commit('setError', err);` in our catch. This will display a _global_ error though. If we have something in our individual item component that renders this error from our global state, it will show up on every single instance of that component. If a user has fire off multiple actions, how in the world are they supposed to know which item caused the error?

## The solution

The solution that I found to this problem is to maintain both global errors and component specific errors, and I'll go into the details of how.

Displaying a global error is the easy part. In almost all of my projects, I build out a specific `<error v-if="globalError"></error>` component, and its only job is to display the global error that is held in the state. If there's no errors, it just won't display anything, which is certainly our ideal scenario. A global error is really nice to give feedback that relates to the entire component, for example if something goes wrong in the initial `getItems` call to populate the data for your component.

If something goes wrong in a specific instance of a child component though, I want to display which one, rather than either a global error, or an error display on every instance of that child. The store has no knowledge about which instance of a component called the dispatch, so how do we tell a specific instance that something happened in the store? The answer to this question lies in promises.

We can actually have our store action return a promise, and have our component do something based on that response. I'll modify the above example to show how this changes.

```
// in your single item's Vue template
<button @click="updateItem">Update</button>

// fires off the method
updateItem() {
  this.$store.dispatch('updateItem', this.item)
  // our dispatch now returns a promise
    .then(() => {
      if(this.globalError) {
        this.error = this.globalError;
        this.$store.commit('clearError');
      }
    })
}

// triggers the store action
updateItem({ dispatch, commit }, payload) => {
  // our action is now set to return a promise, notifying the child component when the action is completed
  return axios({ method: 'put', ...})
    .then(() => {
      dispatch('getItems');
    })
    .catch(err => {
      commit('setError', err);
    })
}
```

It's a small number of changes, really. But what this allows us to do is have the child component, the instance that fired off the `dispatch`, know when that asynchronous action is completed, and do something upon its completion. This allows us to use our global error, contained in the store, as a vehicle to transport an instance specific error. Our conditional statement lets us check if an error is currently in the store upon completion of the asynchronous action, and if it is, set our component specific error to the value of the global error. We can then clear out the global error as it isn't needed, and we don't want it to display.

There's a lot of ways to use this pattern, and I have already encountered several in my time building Vue components with RIMdev. Returning a promise from your asynchronous calls allows your components to track actions in the store, making them smarter overall, and able to respond to more specific needs. The tl;dr takeaway from all this is that JavaScript promises are wonderful.
