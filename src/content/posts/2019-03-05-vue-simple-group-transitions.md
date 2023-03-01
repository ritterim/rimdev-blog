---
title: "Vue Group Transitions"
slug: vue-simple-group-transitions
date: 2019-03-05 14:17:48
tags:
- Vue.js
- JavaScript
- Animations
categories:
- Vue.js
twitter_text: "Fade Animations With Vue.js"
authors: 
- Andrew Rady
image:  https://images.unsplash.com/photo-1551719576-0b1f00da4c63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80
image_url: https://unsplash.com/photos/ed7nhUCdRjQ
image_credit: Claudio Büttler
---

## Simple transitions 

Vue.js has an extremely helpful was to handle animations in web apps. In a simple example if we want to display something in a fade animation all we would need to do is wrap that element in a `<transition>` tag and assign a name,

```javascript
<transition name=”fade” mode=”out-in”>
  <h1 v-if="member">Hello, Jake</h1>
  <h1 v-else>Hello, user</h1>
</transition> 
```

We are going to display one of the h1 tags based on the `v-if` conditional. Now we need to do some styling to do all the work. It’s good practice to have separation of concerns and split our code up. We are going to allow Vue to handle when to show tag, assign the `fade` class, and let css handle everything else. It’s important to understand what Vue does in the animation to work with the css first. It’s going to wrap the name of the transition with `fade-enter-active` and `fade-leave-active` class during the transition. Those classes are where we will do most of code for the animation. The end result will be wrapped in `fade-enter`, and `fade-leave` classes. The `mode="in-out"` tells Vue to let the existing  dom element to finish it's transition before starting the the new one. This gives a smooth transition between the the two elements. Below is an example of a fade that takes .2s seconds to complete the fade effect.

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
```



If you need a more detailed explanation on transitions the [Vue documentation has a great write up](https://vuejs.org/v2/guide/transitions.html). 

## Fade Transition with loops
In a more complex but common situation in development we loop through data and want an animation when switching from one data set to another in the dom. Again Vue has this feature built in since how common this is with [transition-groups](https://vuejs.org/v2/guide/transitions.html#List-Transitions). Let loops through an array of names.

```javascript
let names = [‘John, ‘Max’, ‘Spencer’]

<transition-group name=”fade”>
  <div v-for=”(name, index) in names :key=”index”>{% raw %}
    {{ name }}
  {% endraw %}</div>
</transition-group> 
```

While this works the entrance of the new div will not wait for the old one to leave before starting. In the example before we used the `mode=”out-in”` tag to handle this, but Vue doesn't use that in `transition-group`. This is because how complex this can get. With a little css work we can get a simple fade transition working though. The Vue code doesn’t need to change and we really just need to add one more line of css code.

```css
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

