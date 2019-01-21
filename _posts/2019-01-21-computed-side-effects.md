---
layout: post
title: "Computed Side Effects"
date: 2019-01-21 11:27:17
tags:
- vue
- JavaScript
categories:
- vue
- JavaScript
twitter_text: "#vuejs side effect in computed properties"
authors: Andrew Rady
image: https://images.unsplash.com/photo-1548049717-249a5f7e9189?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80
image_url: https://unsplash.com/photos/0TPmrjTXjSs
image_credit: Jana Sabeth Schultz
---

In Vue computed properties are a life saver when it comes to being able to add logic to data that we need to use in the UI. We want to keep the logic in the template to a minimal if possible and we can do that with computed properties. This is so much of a recommendation that they talk about this directly in the Vue documentation. For example, while we can do sort through an array in alphabetic order in the template,

html:
```
<p>nameList.sort((a, b) => { return a.name.localCompare(b.name) })</p>
```

Over time this will clutter the template and make it hard to read. Moving this logic into a computed value is good practice and will save a lot of headache down the road.

html:
```html
 <p>{{ sortedList }}</p>
```
JavaScript:
```javascript
export default  {
  name: 'Names',
  props: ['nameList'],
  computed: {
    sortedList() {
      return this.nameList.sort((a, b) => { return a.name.localCompare(b.name) }) 
    } 
  }
}
```

The code above is much cleaner, but we need to be careful unintended side-effects that can come with manipulating data in computed properties. Following this example, the array `nameList` is a prop that is passed into this component and could also be used somewhere else. We could end up changing that data even if that was not intended. While this will not cause any syntax errors it will cause the UI to change state where we don’t want it too which takes manual testing before you will discover this bug. We can avoid this by simply cloning the data in the computed value and the running the sort on that

JavaScript:
```javascript
export default {
computed: {
  name: 'Names',
  props: 'nameList',
  computed: {
    sortedList() {
      let clone = this.nameList.slice()
      return clone.sort((a, b) => { return a.name.localCompare(b.name) })
    }
  }
}
```

## Common Gotcha
If you are working with more complex data structures a shallow clone won’t work here, you will need to do a `deep clone`. Check out my blog post about this [here]({% post_url 2018-10-08-post-javascript-object-cloning %})
Anytime you are manipulating data in a computed property that is a prop or from `Vuex store` you should always consider if you need to clone that data as to avoid these situations. If that data is being used elsewhere and you want to keep it in the original state, then this is a good option. 
