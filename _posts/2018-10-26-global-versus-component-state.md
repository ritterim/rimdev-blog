---
layout: post
title: "Global State versus Component State"
date: 2018-10-26 09:00:00
tags:
- JavaScript
- Vue
categories:
- JavaScript
twitter_text: "Global State versus Component State"
authors: Jaime Jones
image: https://images.unsplash.com/photo-1533279443086-d1c19a186416?ixlib=rb-0.3.5&s=b6dae2d6ebc4219fad08914b598b318f&auto=format&fit=crop&w=1489&q=80
image_url: https://unsplash.com/photos/t0SlmanfFcg
image_credit: Fredy Jacob
---

State management, Redux, Vuex... whatever you want to call it or whatever flavor you use, people have a lot of opinions about it. I've written about [my opinion](https://rimdev.io/the-pros-and-cons-of-state-management/) before, but the long and short of it is that people should do what works for them and that there's pros and cons to _every_ paradigm. Personally, I find that having a global state is a useful design pattern, but it can be one that is difficult to do correctly. This is why I've decided to write a few tips for how to use it correctly and how to decide what belongs in your global state and what belongs in your component state!

This article will be in terms of using Vuex, which has a global state and then components with their own state. However, the advice here should be able to be more widely used for the paradigm of state management as a whole.

## Some good questions to ask yourself

**Will this piece of data be the same across the entire application?**
This may be a good candidate for global state, but the follow up question below should be asked.

**Will this piece of data be used across more than one component?**
If the answers to both this question and the one above are Yes, then this piece of data should ideally be stored in global state. The idea being that if you are using this same piece of data all over your application, it makes more sense to be able to pull that from a single, central location. This guarantees that this piece of data will be the same no matter where it is viewed from, since you are grabbing it from your single source of truth.

**Is this piece of data generated based on other data in the application?**
This one depends, and we'll use two different examples to demonstrate how to decide. If this piece of data is generated off of other data that is global, and will not change based on the individual component data, then it should be in the global state. An example of this would be if I had a list of books in a library, and then generated another set of data with statistics about the books, such as the number of books that are currently checked out. But if it is generated based off of component level data then it should live in that component. Following the library example, let's say this is to show statistics about a specific book, such as if that book is currently checked out or the total number of times that book has ever been checked out. Another tip when looking at arrays like this, if a piece of data applies to the array as a whole - again following the library example, our books would be stored in global state - then that piece of data should be in the global state. If the piece of data applies to an individual item in the array - a book in our list of books - then that piece of data should be in the component state. Keep things grouped with what they apply to.

**Will this piece of data be used in a component that renders multiple times, such as through looping?**
This question comes down to instances. If it is the same instance of the data used in each component, then it can live in the global state. But if that piece of data requires a unique instance for each instance of the component, then it should be in the component state.

**Will the data be changed from multiple places?**
If the data will be changed from multiple places, it can make a lot of sense to have it live in the global state where you can easily mutate it and guarantee that change will persist across all uses of it. If there is only a single instance of that data, it should live in the global state. If, however, we are talking about a piece of data that relates directly to a component's state and its children, then it may be good to emit events to manipulate that prop instead. Using our library example again, we could want to mutate our overall statistics when a book is checked out, which should be global, but if we want to manipulate the statistics for that individual book being checked out, then we should modify that within the component.

## Belongs in global state
- Stays the same across the application
- Can be changed from multiple places across the application
- Only one instance of the data exists

## Belongs in component state
- Used within a component and its direct children only
- Data changes based on other data within the component
- An separate instance of the data is needed for each component instance

## Summary
In conclusion, I really like the pattern of state management. This is a personal preference, of course, but I think it's one that can add a lot to how you organize and build out your application. It comes with its own pitfalls and learning curve though as you figure out what belongs where. Some of it just requires experimentation, but hopefully these tips have been helpful!
