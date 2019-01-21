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
image:
image_url:
image_credit:
---

Computed Side Effects

In Vue computed properties are a life saver when it comes to being able to add logic to data that we need to use in the UI. The template we want to keep the logic to a minimal if possible and we do that with computed properties. This is so much a recommendation that they talk about this in the Vue documentation. For example, while we can do sort through an array in alphabetic order in the template,
```
<div id=”example”>
  {{ nameList.sort((a, b) => { return a.name.localCompare(b.name) } }}
</div>

<script>
  Let nameList = [‘Chuck Norris’, ‘Batman’, ‘Superman’]
</script>
```
It will so over clutter the template and make it hard to read down the road. Moving this logic into a computed value is good practice and will save a lot of headache down the road.
```
<div id=”example”
 {{ sortedList }}
</div>

<script>
computed: {
  sortedList() {
    return this.nameList.sort((a, b) => { return a.name.localCompare(b.name) }
  }
}
</script>
```

The code above is much cleaner, but there is something that can come back to bite people and that is unintended side-effects that can come with manipulating data in computed properties. Following this example, the array `nameList` is a prop that is passed into this component and is also used somewhere else we can end up changing that data even if that was not intended. While this will not cause any syntax errors it will cause the UI to change state where we don’t want it too which takes manual testing before you will discover this bug. We can avoid this by simply cloning the data in the computed value and the running the sort on that

```
<script>
computed: {
  sortedList() {
    let clone = this.nameList
    return clone.sort((a, b) => { return a.name.localCompare(b.name) }
  }
</script>
```

Common Gotcha
If you are working with more complex data structures a shallow clone this won’t work. You will need to do a `deep clone`. Check out my blog post about this here https://rimdev.io/post-javascript-object-cloning. 

Anytime you are manipulating data in a computed property that is a prop or from Vuex store you should always consider if you need to clone that data as to avoid these situations. If that data is being used elsewhere and you want to keep it in the original state, then this is a good option. 
