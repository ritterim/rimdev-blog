---
layout: post
title: "The Component Life: Creating Reusable Web Components"
date: 2017-02-23
tags: 
- Web components
- Javascript
categories: 
- javascript
- frontend
twitter_text: "The Component Life: Creating Reusable Web Components #webcomponents #javascript"
authors: Nathan White
image: /images/modules.jpg
image_credit: Nathan White
external_links_target_blank: true
---

At RimDev we're trying to rethink the way we build our frontend. We have so many properties with common functionality, and it was starting to be cumbersome (not to mention a waste of time) to implement similar features across all of our products. We knew there was a better approach. This is what brought us to a redistributable component architecture. 

One of the recent components we've built is for our "Related Content." Now on the backend, it's just one simple endpoint. However, on the frontend, we have many different contexts for where/why this component is used. For example, sometimes we might utilize this component on a static blog site. Other times we might use it to show related articles inside of one of our products. We needed to build out these pieces in a very extensible manner for the frontend. There should be a minimal barrier to implementation and it should allow the frontend developer or designer an easy workflow to embed inside another site.

We decided to develop a pure vanilla, ES2015 component. We started with a simple class, whose constructor recieves an optional configuration object. This allows us to pass in any configuration parameters we might need setup, which also forces the frontend implementer to intentionally instantiate the component when needed. 

```javascript
export default class RelatedContent{
  constructor(configuration = null) {
    const defaultConfiguration = {
      dataAttribute: 'data-related-content',
      initializedDataAttribute: 'data-related-content-initialized',
      defaultDomScope: document.body,
      apiUrl: '<api_url>',
      pageSize: 10,
    };

    this.configuration = defaultConfiguration;

    if (configuration) {
      Object.assign(this.configuration, configuration);
    }
  }
}
```

I would like to note the `defaultDomScope` in the configuration object. This allows you to scope the components to a given DOM element, giving even more control to the frontend implementer. 

After configuring the settings for the component we then have an initialization method to actually create our component, allowing the implementer to pass in a new DOM scope here to be set in the configuration. 

```javascript
init(domScope = this.configuration.defaultDomScope) {

  const items = [...domScope.querySelectorAll(`[${this.configuration.dataAttribute}]`)];
  items.forEach(i => this.create(i));

  return this;
}
```

Note that we return `this` at the end of the method. Again, we want to assist the implementer with any sort of extensibility or ease-of-use that we can. Returning `this` allows the implementer to chain methods, for a quick one-liner to get their component functioning.

We use the dom scope to select any elements with our `data-` attribute, iterate through them, and pass them to a create method. Any additional setup prior to creating the elements should go here. 

In our create method we want to actually create the elements. 

```javascript
create (cmpTmp) {
  let templateContent = this.templateContent(cmpTmp);

  //Clone template
  const cmpClone = templateContent.cloneNode(true);

  //Render title
  let titleElem = cmpClone.querySelector('#rim-related-content-title');
  if (titleElem) {
    titleElem.innerText = item.title;
  }

  //Add after template
  cmpTmp.parentNode.insertBefore(cmpClone, cmpTmp.parentNode.lastChild);
}
```

After creating a clone of the template, we then modify any pieces that we'd like. We then take this cloned element and insert it in the same container as the template. We leave the template there, because we might end up needing to clone another piece later.

As a point of, again, allowing our implementer to have the control, we use HTML `<template>` elements to give our components a DOM structure to use. This makes it so that the "template" we are using doesn't render on the screen before we have a chance to modify it to our needs. Here's a portion of our template:

```html
<template data-related-content>
<div>
  <!-- Our title element -->
  <h3 id="rim-related-content-title"></h3>
  <!-- Our date element -->
  <p id="rim-related-content-date"></p>
</div>
</template>
```

This allows the implementer to decide the structure of each piece of data displayed. It also gives up control of all styling, allowing you to pick and choose how to style each portion. We've found this is very helpful as we don't always use the same CSS/SCSS framework for each of our projects. Our data is always consistent and the base functionality of the component is always consistent, but everything else is up to the implementer. 

NOTE: For IE compatibility you'll want to make sure that any template element has a CSS rule to set the `display: hidden`. You also will need this small function to grab the contents of the template:

```javascript
templateContent(template) {
    if("content" in document.createElement("template")) {
        return document.importNode(template.content, true);
    } else {
        var fragment = document.createDocumentFragment();
        var children = template.childNodes;
        for (let i = 0; i < children.length; i++) {
            fragment.appendChild(children[i].cloneNode(true));
        }
        return fragment;
    }
}
```

This is a lot to write to just setup one simple component. If you create a library of components for your products, there's going to be a lot of repeated work. Good news! RimDev already took care of that for you. We created a yeoman generator called [rim-es6-component](https://www.npmjs.com/package/generator-rim-es6-component) to scaffold out a very similar setup using Webpack/Jest. All you'll have to do is fill out the `create` method with whatever element functionality you need!

Happy coding!