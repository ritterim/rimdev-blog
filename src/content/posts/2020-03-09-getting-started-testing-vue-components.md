---
title: "Getting Started Testing Vue Components"
slug: getting-started-testing-vue-components
date: 2020-03-09 13:43:25
tags: 
- Vue.js
- Jest
- Testing
categories:
twitter_text: Getting started with testing your Vue components with Jest
authors: 
- Andrew Rady
image: https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/kN_kViDchA0
image_credit: Arlington Research
---

Testing is an important step we can take as developers to reduce bugs in our code, but testing seems to be one of the best practices that is skipped the most. When it comes to development I have noticed that testing is its own framework all in itself that you need to learn, and understand how it works. If you have worked on a large scale application you know how hard manual testing becomes. As front end developers who write with Vue.js Jest is one of the recommended testing framework. Let's dive into using Jest the [vue test utils](https://www.npmjs.com/package/@vue/test-utils) package in our applications.

## Install and Setup
If you are using the vue cli all you need to run is `vue add @vue/unit-jest`, but if you have a custom setup there is a little more. To install it with npm we will want to run `npm install --save-dev @vue/test-utils`. Make sure you include the `--save-dev` section since we only need this as a dev dependencies (always try and keep you production package size down). That's all you will need to get started

## Testing our components
Lets create a simple component called `ScoreBoard.vue` based on the docs to test,
```js
export default {
  template: `
    <div>
      <span class="amount">{{ amount }}</span>
      <button @click="increase" class="increase">Increase</button>
      <button @click="decrease">Decrease</button>
    </div>
  `,
  data() {
    return {
      amount: 0
    }
  },
  methods: {
    increase() {
      this.amount++
    },
    decrease() {
      this.amount--
    }
  }
}
```
When creating test with jest we want them to be unit tests. So we want to test them in isolation from each other, and test the functionality of the components. The majority of our tests should be unit tests following this concept. In our first example this component is going to use the `mount` function in the `vue/test-utils` package. In the same directory as the component lets create the test `ScoreBoard.test.js`

```js
import { mount } from 'vue/test-utils'
import ScoreBoard from './ScoreBoard.vue'

it('increases score', () => {
  const wrapper = mount(ScoreBoard)
  expect(wrapper.vm.amount).toBe(0)

  wrapper.vm.increase()
  
  expect(wrapper.vm.amount).toBe(1)
})
```

Lets breaking down this little test. First thing is `const wrapper = mount(ScoreBoard)`. This will allows us to interact with the components, and here we are mainly interaction with the `vm` property which is the vue instance. We are testing that the vue data property `amount` starts at 0, call the `increase` methods and then checking the data property again. This is a simple test that just makes sure that the method does what we intended it to do. We could also do the same thing by mocking user interactions more with the example below.

```js
import { mount } from 'vue/test-utils'
import ScoreBoard from './ScoreBoard.vue'

it('increases score', () => {
  const wrapper = mount(ScoreBoard)
  expect(wrapper.vm.amount).toBe(0)

  const increase = wrapper.find('button.increase')
  wrapper.trigger('click')
  
  expect(wrapper.vm.amount).toBe(1)
})
```

This example interactions more with the UI in the wrapper, but if your components grow there could be much more required setups in your tests. There is a trade off on how much you want or can invest in writing tests. It might be tempting to test everything, but if you have a large code base this can easily become overwhelming. I took the Application Testing in Vue.js from Vueconf US in Austin this year from [Alex](https://twitter.com/hootlex) and [Rolf](https://twitter.com/rahaug) and learned a lot. They're the founders of [vueschool.io](https://vueschool.io/) and I would highly recommend checking out their site. One of the main sections that stuck out to me in this situation is using the `setData` function in favor of testing all of the user interactions. We have some larger and complex components here at Ritter and testing creates some long files. Let create another component that is a little more complex and show how to use the `setData` to improve our tests and make them easier to read and maintain.

```js
<template>
  <div>
    <span>{{ amount }}</span>
    <span click="toggleDetails">Click me!</span>
    <div v-if="showDetails">
      <button @click="increase" class="increase">increase</button>
      <button @click="decrease" >Decrease</button>
    </div>
  </div>
</template>
export default {
  data() {
    return {
      showDetails: false,
      amount: 0
    }
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails
    },
    increase() {
      this.amount++
    },
    decrease() {
      this.amount--
    }
  }
}
```

Above is a slightly more complex component that requires a little more user interaction to increase or decrease the amount. We could easily find the `Click me!` span and trigger another click event, but this is where the test complexity could build in larger components. Our goal is to stay close to unit testing and focus on one section, so using the `setData` function helps us with the. Let's refactor our test to handle this.

```js
import { mount } from 'vue/test-utils'
import ScoreBoard from './ScoreBoard.vue'

it('increases score', () => {
  const wrapper = mount(ScoreBoard)
  expect(wrapper.vm.amount).toBe(0)

  wrapper.setData({
    showDetails: true
  })

  wrapper.vm.increase()
  
  expect(wrapper.vm.amount).toBe(1)
})
```

## Conclusion
Vue and Jest is a great combination for adding unit tests for our applications. There is much more to testing then this simple post, but I hope this is a good start for those just looking into testing. Try and keep them simple and don't get wrapped into making tests more complex then they need to be. Jest had many other built in features to handle other situations that we will cover in future posts. 
