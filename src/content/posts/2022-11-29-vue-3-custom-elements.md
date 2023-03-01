---
title: "Using custom elements and pinia with Vue 3"
slug: vue-3-custom-elements
date: 2022-11-29 12:00:00
tags:
- JavaScript
- Vue
- pinia
categories:
- JavaScript
twitter_text: "Using custom elements and pinia with Vue 3"
authors: 
- Jaime Jones
image: https://images.unsplash.com/photo-1558195955-c4751542e89b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80
image_url: https://unsplash.com/photos/HrdNNoG_y-A
image_credit: Juno Jo
---

Custom elements provide an excellent way to encapsulate more complex code into a convenient and simple HTML tag. Custom elements can also be combined with Vue to leverage this further, going as far as to embed full applications with a single tag - we could even embed _multiple_ applications.

Vue 3 even provides us an easy way to accomplish this task via the `defineCustomElement` method. More information about this specific method can be found in the (as always) excellent [Vue docs](https://vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue).

For a very quick overview, `defineCustomElement` can be used by passing in a component and the desired name to register your custom element as. Note that the component can either be imported from a single component `.vue` file, or created within the method itself.

```javascript
import { defineCustomElement } from 'vue';
import App from './App.vue';

const vueElement = defineCustomElement(App);

customElements.define('my-app', vueElement);
```

Using the above, our app can now be used by simply calling `<my-app></my-app>` wherever we'd like to use it. This setup can even take in props that can be added to the custom element.

But what happens when we have an application complex enough to warrant using a store and add [pinia](https://pinia.vuejs.org/) into the mix? It still works great! Until we start to really complicate things by having multiple instances of a custom element on a page. My point is - for most use cases, the Vue 3 `defineCustomElement` needs no help. It's extremely useful and works well, but sometimes we need a little finer control.

That's where we can leverage `defineCustomElement` further by building our own wrapper around it. Let's go step by step (there is a tl;dr at the end with comments if you just want to skip down).

First, we'll create our wrapper function.

```javascript
export const createElementInstance = ({ component = null } = {}) => {
  return defineCustomElement({
    setup() {
      const app = createApp();
    },
    render: () => h(component)
  })
}
```

Then, we'll adjust our defining of the custom element. Instead of calling `defineCustomElement`, we'll call our newly created function and pass a config into it.

```javascript
const config = {
  component: App
}

customElements.define('my-app', createElementInstance(config));
```

At this point, our `createElementInstance` function is not doing much - it's just taking in the component that we want to define as a custom element, which isn't really doing anything that `defineCustomElement` doesn't, and it's adding needless obfuscation at this point.

But once we add pinia in, our use case will become clear. By default, when defining a custom element like this, it will have a shared pinia instance. This means that data in the store that changed in one application would be reflected in all of them. Using the counter example that the pinia documenation employs, let's imagine that our custom element was a counter which stored the count in the store. If the count was incremented from one custom element instance, that updated count would be reflected on every rendering of the custom element.

Sometimes that shared instance is an advantage, perhaps if you have different root elements that you'd like to render that share the same data. But in other cases, that shared instance becomes a hindrance, in the case where we'd like each rendering of the custom element to have its own dataset. This is where our custom element instance can really shine.

```javascript
export const createElementInstance = ({ component = null } = {}) => {
  return defineCustomElement({
    setup() {
      const app = createApp();

      const pinia = createPinia();
      app.use(pinia);

      const inst = getCurrentInstance();
      Object.assign(inst.appContext, app._context);
      Object.assign(inst.provides, app._context.provides);
    },
    render: () => h(component)
  })
}
```

The above will now create a unique pinia instance for each occurrence of the custom element. We then use `getCurrentInstance`[^1][^2] to pass the pinia assigned via `app.use` on to the rendered component's context. 

[^1]: There are some caveats to keep in mind here. `getCurrentInstance`, while [previously documented](https://github.com/vuejs/docs/pull/590/files), was later [removed from documentation](https://github.com/vuejs/docs/commit/1ea66dc0e67abe5c518d487218bb7e2d6a5c5324) and is considered an internal API. While it is widely used in Vue core, it is not really intended for usage outside of official libraries. It should be used with great caution both due to the fact that it may not be subject to the same [SemVer](https://semver.org/) standards as it is not publicly documented and with the internal exposure that it grants, it can be easy to break your application.
[^2]: This was what I found that worked for our needs after quite a bit of research, and so I made the decision to use it. If I find a better way, I will update this post. If someone else knows of a better way, please get in touch and let me know!

That's helpful, but we just identified above that there are times when we _do_ want a shared store instance. This can easily be accomplished with a few changes.

```javascript
export const createElementInstance = ({ component = null, sharedStoreInstance = false, plugins = [] } = {}) => {
  return defineCustomElement({
    setup() {
      const app = createApp();

      if (!sharedStoreInstance) {
        const pinia = createPinia();
        app.use(pinia);
      }

      plugins.forEach(plugin => app.use(plugin));

      const inst = getCurrentInstance();
      Object.assign(inst.appContext, app._context);
      Object.assign(inst.provides, app._context.provides);
    },
    render: () => h(component)
  })
}
```

Now our `createElementInstance` config can take in couple of new parameters. Let's look at what a config would take in to accomplish this.

```javascript
const pinia = createPinia();

const config = {
  component: App,
  sharedStoreInstance: true,
  plugins: [pinia]
}

customElements.define('my-app', createElementInstance(config));
```

We specify that we will have a `sharedStoreInstance`, so we don't create the pinia when defining the custom element, and instead we pass in our shared pinia instance as part of a `plugins` array. This has the added benefit that we can provide other plugins to our application as well!

This is almost perfect, but it's still missing a couple of important features. Most notably, it's missing `props`, which are a huge piece of functionality in Vue, and especially with any kind of embedded application, there's likely configuration data needed.

No problem, we can add in `props` and while we're at it, let's go ahead and include some options to be used during rendering as well.

```javascript
export const createElementInstance = ({ component = null, props = [], sharedStoreInstance = false, plugins = [], renderOptions = {} } = {}) => {
  return defineCustomElement({
    props: props,
    setup() {
      const app = createApp();

      if (!sharedStoreInstance) {
        const pinia = createPinia();
        app.use(pinia);
      }

      plugins.forEach(plugin => app.use(plugin));

      const inst = getCurrentInstance();
      Object.assign(inst.appContext, app._context);
      Object.assign(inst.provides, app._context.provides);
    },
    render: () => h(component, renderOptions)
  })
}
```

We can now update our config to include these.

```javascript
const pinia = createPinia();

const config = {
  component: App,
  props: { title: String },
  sharedStoreInstance: true,
  plugins: [pinia],
  renderOptions: { ref: 'component' }
}

customElements.define('my-app', createElementInstance(config));
```

We can now pass in `props` as part of our config options. Note that you can use either the syntax in the example above or the array syntax. These props are then accessible in your rendered component via `this.$root[prop]`. In the example above, we'd have access to `this.$root.title`.

If you'd like to include options to be used in the render function, such as this example which adds a `ref`, you can as well.

This leaves us with the following as a wrapper to create custom elements for our applications and components that can handle various needs such as shared or separate pinia instances without losing out on existing Vue functionality.

### The tl;dr

As the promised tl;dr, I'm including the finished wrapper function here with a few comments for easy reference:

```javascript
export const createElementInstance = ({ component = null, props = [], sharedStoreInstance = false, plugins = [], renderOptions = {} } = {}) => {
  return defineCustomElement({
    props: props,
    setup() {
      const app = createApp();
      // if we do not want a shared store instance, which is the default
      // we create a fresh pinia instance when creating each element
      if (!sharedStoreInstance) {
        const pinia = createPinia();
        app.use(pinia);
      }
      // if we do want a shared store instance, it should be included as a plugin
      // additional plugins can be used here as well
      plugins.forEach(plugin => app.use(plugin));

      const inst = getCurrentInstance();
      Object.assign(inst.appContext, app._context);
      Object.assign(inst.provides, app._context.provides);
    },
    render: () => h(component, renderOptions)
  });
}
```
