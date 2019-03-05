---
layout: post
title: "Vue Simple Group Transitions"
date: 2019-03-05 14:17:48
tags:
- Vue.js
- JavaScript
- Animations
categories:
twitter_text: 
authors:
image:
image_url:
image_credit:
---

## Simple transitions 

Vue.js has an extremely helpful was to handle animations in web apps. In a simple example if we want to display something in a fade animation all we would need to do is wrap that element in a `<transition>` tag and assign a name,

```
<transition name=”fade” mode=”out-in”>
  <h1>Hello, world</h1>
</transition> 
```

Now we need to do some styling magic to do all the work. It’s good practice to have a good amount of separation of concerns. We just use to handle when the nest component is show and assign `fade` class and let css handle everything else. It’s important to understand what Vue does in the animation to work with the css first. It’s going to wrap the name of the transition with `fade-enter-active` and `fade-leave-active` class during the transition. This is where we will do most of animation work. The result will be wrapped in `fade-enter`, and `fade-leave` classes. Below is an example of a fade that takes .2s seconds to complete fade effect.
```
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
```



If you need a more detailed explanation on transitions the (Vue documentation has a great write up)[ https://vuejs.org/v2/guide/transitions.html]. 

## Fade Transition 
In a complex but common situation in development we loop through data and want an animation for when switching from one data set to another. Vue again has this feature built in since how common this is with (transition-groups)[ https://vuejs.org/v2/guide/transitions.html#List-Transitions]. Let loops through an array of names.

```
Let names = [‘John, ‘Max’, ‘Spencer’]
<transition-group name=”fade”>
  <div v-for=”(name, index) in names :key=”index”>
    {{ name }}
  </div>
</transition-group> 
```

While this works the entrance of the new div will not wait for the old one to leave before starting. In the example before we used the `mode=”out-in”` tag to handle this. Vue will not handle this natively since how complex this can get. With a little css work we can get a simple fade transition working. The Vue code doesn’t need to change and we really just need to add one more line of css code.

```
.fade-enter-active, .fade-leave-active {
  transition: all .2s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.fade-enter-active {
  transition-delay: .2s;
}
```



Just make sure we have the timing of the transition-delay the same if not a little behind the transition depending on how we want the behavior. 

