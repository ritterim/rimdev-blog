---
layout: ../layouts/Post.astro
title: "Random Vue Tips"
date: 2018-06-05 10:17:26
tags:
- Vue
- Development
- JavaScript
categories: development
twitter_text: "Random Vue Tips"
authors: Chidozie Oragwu
image: https://images.unsplash.com/photo-1523540939399-141cbff6a8d7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=37e53fb0167c9adfc4e3add2ef50580f&auto=format&fit=crop&w=2700&q=80
image_url: https://unsplash.com/photos/-rF4kuvgHhU
image_credit: Photo by Sam Truong Dan on Unsplash
---

[Vue](https://vuejs.org/) has been a delightful framework to work with. The first thing I noticed about it was how easy to follow the documentation was and how quickly it was to get started - just add a script reference to your page and you are ready to write code. 

Being that I have only used it for less than a year, I wanted to share some things I found to be useful that will hopefully be useful to others. Here they are in no particular order:

## Scenario: Arbitrarily execute component methods
If you have had to develop a fairly complex app using Vue you have probably used the Vue Dev Tools. If not, [check it out](https://github.com/vuejs/vue-devtools)! It's a convenient way to debug Vue apps.

Vue dev tools allows you to inspect the data of components but at the time of writing, there is no way to execute component methods. A nice thing it does for you though, is alias the components to make them accessible from your JS console in the browser. Selecting a component in the dev tools component tree displays an alias next to the name:
![Component Alias](/images/random-vue-tips/select_alias.PNG "Component Alias")

In the example above, the alias is `$vm0`. So in our browser console we can get at the component methods (and other properties) by using `$vm0.someMethod('param1', 'param2')`.
![Component Method](/images/random-vue-tips/component_method.png "Component Method")

## Scenario: I want to stop execution at a certain point and inspect various data points
This one is probably more of a JavaScript tip than a Vue tip and probably the one I use the most. Just adding a `debugger;` statement. 
```javascript
    var vm = new Vue({
        el: '#example',
        ...
        computed: {
            reversedMessage: function () {
                debugger; // 👈 Execution pauses here  
                return this.message.split('').reverse().join('')
            }
        }
    })
```

The nice thing about that 👆 is not only can you inspect properties but you can execute methods or run other code in the context of the _current_ application state.

## Scenario: Clean way to target component element
If you have a component that manipulates it's DOM element, you can give it an id or class and target it that way. Say we have a form element with a file upload input that we want to cleanly reset after we complete the upload request. We can do so in this way:
```javascript
    Vue.component({
        template: `<div>
            Fancy File uploader
            <form class="some-form" id="some-form">
                ...
                <input type="file" @change="doUpload($event.target.files)"></file>
            </form>
        </div>`,
        ...
        methods: {
            ...
            doUpload(files) {
                asyncFileUpload(files).then(this.resetForm);
            },
            resetForm: function () {
                document.querySelector('.some-form').reset();
                // 👆 either way works 👇
                document.querySelector('#some-form').reset();
            }
        }
    })
```

But a situation arises when more than one instance of the component is used on the page. Using `document.querySelector` or `document.querySelectorAll` will return the first matching element and all matching elements respectfully; which is not what we want because we either run the risk of targetting the wrong instance or get all matching instances and have to figure out the specific one we want to call `reset` on.

A cleaner option is to use the built in `ref`. Here is our updated example:
```javascript
    Vue.component({
        template: `<div>
            Fancy File uploader
            <!-- 👇 add a ref attribute -->
            <form ref="fileUploader">
                ...
                <input type="file" @change="doUpload($event.target.files)"></file>
            </form>
        </div>`,
        ...
        methods: {
            ...
            doUpload(files) {
                asyncFileUpload(files).then(this.resetForm);
            },
            resetForm: function () {
                this.$refs.fileUploader.reset(); // 👈 Will always target the correct instance
            }
        }
    })
```

## Conclusion
That's all I have got today. Have feedback or suggestions? Do your thing in the comments!