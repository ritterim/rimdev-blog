---
layout: post
title: "Testing Vue Components"
date: 2020-03-06 10:43:25
tags: 
- Vue.js
- Jest
- Testing
categories:
twitter_text: Testings your vue components with jest
authors: Andrew Rady
image:
image_url:
image_credit:
---

Testing is an important step we can take as developer to reduce bugs in our code, but testing seems to be one of the best practices that is skipped the most. When it comes to development I have noticed that testing is it's own framework all in itself that you need to learn, and understand how it works. It's an additional process to ensure good coding processes. I think developers build up their skills on how to make applications, but don't want to learn this entire new process so they just do manuel testing. If you have worked on a large scale application you know how hard and futile this becomes. As front end developers who write with Vue jest is the recommended testing framework. Let's dive into using jest the `vue test utils` package in our applications.


## Install and Setup
If you are using the vue cli all you need to run is `vue add @vue/unit-jest`, but if you have a custom setup there is a little more. To install it with npm we will want to run `npm install --save-dev @vue/test-utils`. Make sure you include the ``--save-dev` section since we only need this as a dev dependencies (always try and keep you production package size down!). That's all you will need to get started

## Testing our components
Lets create a simple component called `ScoreBoard.vue` based on the docs to test,
```js
export default {
  template: `
    <div>
      <span class="amount">{{ amount }}</span>
      <button @click="increment" class="increment">Increment</button>
      <button @click="decrease">Decrease</button>
    </div>
  `,

  data() {
    return {
      amount: 0
    }
  },

  methods: {
    increment() {
      this.amount++
    },
    decrease() {
      this.amount--
    }
  }
}
```
When creating test with jest we want them to be unit tests. So we want to test them in isolation from each other, and test the functionality of the components. The majority of our tests should be unit tests following this concept. In our first example of testing this component we are going to use the `mount` function in the `vue/test-utils` package. In the same directory as the component lets create the test `ScoreBoard.test.js`

```js
import { mount } from 'vue/test-utils`
import ScoreBoard from './ScoreBoard.vue`

it('increases score', () => {
  const wrapper = mount(ScoreBoard)
  expect(wrapper.vm.amount).toBe(0)

  wrapper.vm.increment()
  
  expect(wrapper.vm.amount).toBe(1)
})
```

Lets breaking down this little test. First thing is `const wrapper = mount(ScoreBoard)`. This will allows us to interact with the components, and here we are mainly interaction with the `vm` property which is the vue instance. We are testing that the vue data property `amount` starts at 0, call the `increment` methods and then checking the data property again. This is a simple test that just makes sure that the method does what we intended it to do. We could also do the same thing by mocking user interactions more with the example below.

```js
import { mount } from 'vue/test-utils`
import ScoreBoard from './ScoreBoard.vue`

it('increases score', () => {
  const wrapper = mount(ScoreBoard)
  expect(wrapper.vm.amount).toBe(0)

  const increase = wrapper.find('button.increment')
  wrapper.trigger('click')
  
  expect(wrapper.vm.amount).toBe(1)
})
```

This example interactions more with the UI in the wrapper, but if your components grow there could be much more required setup in your tests. There is a trade of on how much you want or can invest in writing tests. I took the Application Testing in Vue.js from Vueconf US in Austin this year from [Alex](https://twitter.com/hootlex) and [Rolf](https://twitter.com/rahaug) and learned a lot. They are the founders of [vueschool.io](https://vueschool.io/) and I would recommend checking out their site. 
