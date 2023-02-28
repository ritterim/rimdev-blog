---
layout: post
title: 'Vue 3 Composition API'
date: 2019-10-21 12:00:00
tags:
  - vue3
  - composition
  - frontend
  - development
categories:
  - development
twitter_text: Vue 3 Composition API
authors: Seth Kline
image: https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2049&q=80
image_url: https://unsplash.com/photos/ImcUkZ72oUs
image_credit: Israel Palacio
---

Have you found yourself getting lost in large Vue components that have multiple features? The Composition API is a new optional syntax in Vue 3 that provides developers a new way to create components and organize them by feature instead of operation.

## Vue 2 Single File Components overtime can become complex and hard to read

- Code organized by operation (data, methods, computed)
- Components become more complex over time
- Each new feature added, split up in sections, makes your code harder and harder to read
- Looking at code from another person forces you to search from section to section
- Need to use the this keyword to reference other methods or reactive properties
- Functions can end up being large and complex because it is harder to reference other sections with the this keyword.

## Vue 3 Composition API creates organized maintainable components

- Code organized by feature, placing all of the feature's code into its own function
- Features can be modularized into its own separate function or its own javascript file.
- Functions can be made small and be referenced without using the this keyword
- Less time spent scanning from section to section following the flow of the code

# Working with the Composition API

The Composition API is available to try out with Vue 2 as a [plugin](https://github.com/vuejs/composition-api).

## Basic Code Example

taken from Vue's [request for comment](https://vue-composition-api-rfc.netlify.com/#basic-example).

```javascript
<template>
  <button @click="increment">
    Count is: {{ state.count }}, double is: {{ state.double }}
  </button>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2)
    })

    function increment() {
      state.count++
    }

    return {
      state,
      increment
    }
  }
}
</script>
```

## Setup Function

The setup function is where you put your data and functions for your feature. You could also move your feature code into its own function outside of the setup or its own javascript file and then would have to declare the code in the setup function and return it to use.

- Takes two optional arguments props, and context
- Create methods, data state, functions inside setup function
- All of the methods, functions need to be returned from the setup function
- Shared code can be imported and then declared in the setup function (must be returned)
- Does not have access to this

## Refs vs Reactive

There are two ways to deal with state and reactivity in the setup function, _refs_ and _reactive_. Using one over the other is a matter of preference and coding style. They both allow Vue to keep track of your state.

- Need to be imported to be used
- Data using _refs_ or _reactive_ need to be returned as objects from setup function

Knowing when to use refs and reactive can be confusing and best practices are still being [developed](https://vue-composition-api-rfc.netlify.com/#ref-vs-reactive)

- Refs are great for declaring single variables
- Reactive is great for listing all your state inside objects
- Reactive objects cannot be destructured or spread without using the _toRefs method_

## Working with refs

[Ref example](https://vue-composition-api-rfc.netlify.com/#api-introduction)

```javascript
<template>
  <button @click="increment">
    {% raw %}Count is: {{ count.value }}, double is: {{ count.value * 2 }}{% endraw %}
  </button>
</template>

<script>
  import { ref, watch } from 'vue'

  let count = ref(0)

  function increment() {
    count.value++
  }

  const renderContext = {
    count,
    increment
  }

  watch(() => {
    renderTemplate(
      `<button @click="increment">{{ count }}</button>`,
      renderContext
    )
  })
</script>
```

Refs in the setup function work differently then refs in the rest of Vue. In the setup function when using a ref you declare the variable and set the initial value using `ref()`.
{% raw %}`let todo = ref('')`{% endraw %}
Working with your data in the template section of the component you need to reference the data with the name of the ref and _add .value_ at the end

{% raw %} `<h1> {{ todo.value }} </h1>` {% endraw %}

## Working with reactive

Reactive takes an object and returns a reactive object

```javascript
setup() {
Const todos = reactive({
item: ''
}) }
```

- Computed properties can be included inside a reactive object
- Use the toRefs method (creates a plain object with reactive properties) when destructuring or spreading an object
  `return {...toRefs(todos)}`

## Using computed properties

Used with refs or reactive when you have state that depends on other state.
`let firstTodo = computed(( ) => {return todo[0] } )`

- Can be used inside a reactive objects
- If you are using refs you will need to remember to add .value to the end of your ref name to access the value.

## Context argument

The second optional argument in the setup function that allows you to call methods like emit that are not available in the setup function.

- Examples: _context.attrs, context.slots, context.parent, context.root, context.emit_

## Life-cycle hooks

- Three lifecycle methods: _onMounted, onUpdated, onUnmounted_
- Declare them inside setup function

If you want to [start experimenting with the composition API](https://github.com/vuejs/composition-api) you can use it as a plugin with Vue 2.

## Resources

[Vue Mastery's Composition API Cheat Sheet](https://www.vuemastery.com/vue-3-cheat-sheet/)

### Videos

- [Kaizen Codes](https://www.youtube.com/watch?v=8jOVi4fRSKo&t=162s) code along introduction to Composition API, build todo app
- [Program with Erik](https://www.youtube.com/watch?v=zPViRHZfKv4) code along build a brewery search app
- [Vue Mastery](https://www.vuemastery.com/courses/vue-3-essentials/) subscription required
- [Natalia Tepluhina](https://www.youtube.com/watch?v=dy_ZB1TyFx4) talk from Component Conference 2019.
- [Jason Yu](https://www.youtube.com/watch?v=JON6X6Wmteo) build a musical keyboard using Composition API.

### Articles

- [Composition API Request for Comment](https://vue-composition-api-rfc.netlify.com/)
- [Comparing React Hooks to Composition API](https://dev.to/voluntadpear/comparing-react-hooks-with-vue-composition-api-4b32)
- [Initial reaction to Composition API](https://dev.to/danielelkington/vue-s-darkest-day-3fgh)
