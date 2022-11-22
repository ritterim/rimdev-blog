---
layout: ../layouts/Post.astro
title: "Using Environment Variables with Jekyll, Vue.js, and Netlify"
date: 2018-10-17 07:17:33
tags:
- Development
- JavaScript
- Dev Ops
- Vue
- Vue.js
- Jekyll
categories: development
twitter_text: "Using Environment Variables with Jekyll, Vue.js, and Netlify"
authors: John Vicari
image: https://images.unsplash.com/photo-1489417139533-915815598d31?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2642373de2eddf3629e9ff52550c8294&auto=format&fit=crop&w=2820&q=80
image_url: https://unsplash.com/photos/9FDKj-FrfA4
image_credit: Photo by Rebekah Howell on Unsplash
---

We operate in a typical `QA -> Production` workflow on both our front-end and back-end teams. So, what happnes when your front-end is in QA but is pointing to a Production API? Nothing good happens, son... nothing good.

As I've [mentioned before]({% post_url 2018-06-08-ie-still-breaking-promises-literally %}), we run a few websites built with [Jekyll](https://jekyllrb.com/) and [Vue.js](https://vuejs.org/), and recently launched a new site with a similar setup. Since this site had never been released, we hardcoded a handful of QA endpoints into a Vue component. This didn't present any issues during initial development, but when it was released (and the endpoints were updated to Production) and minor bugs were being worked on, front-end `QA` was pointing to back-end `Production`. Not good, especially if data is being manipulated.

## The Solution

Create a `.json` file to hold your environment specific variables and make them available to your Vue component.


### Define environment variables in Netlify

We're using [Netlify](https://www.netlify.com/) to deploy and host this site and have setup a `QA` and `Production` build. The build settings allow you to define environment variables, this is where you add the [Jekyll environment](https://jekyllrb.com/docs/configuration/environments/) variable.

```
JEKYLL_ENV=production
```
Which would look like this in the Netlify Build & Deploy settings (your development build would obviously be set to `development`, although I think `development` might be the default):
![Netlify Environment Variable Setting](/images/netlify-environment-variable.png){: .img-fluid }

### Create JSON file

In the root of your project create a `.json` file, something like
 `environment-variables.json`. Within that file we have:

```
{% raw %}
---
---
{% if jekyll.environment == "production" %}
{
    "productionUrlA": "https://production-url-a.com",
    "productionUrlB": "https://production-url-b.com",
    "productionUrlC": "https://production-url-c.com"
}
{% else %}
{
    "qaUrlA": "https://qa-url-a.com",
    "qaUrlB": "https://qa-url-b.com",
    "qaUrlC": "https://qa-url-c.com"
}
{% endif %}
{% endraw %}
```
Be sure to open the file with empty front matter so Jekyll knows to process it. When Jekyll builds, `environment-variables.json` will be in your `_site` directory with only one set of environment variables ready for your Vue component to use.
```
{
    "qaUrlA": "https://qa-url-a.com",
    "qaUrlB": "https://qa-url-b.com",
    "qaUrlC": "https://qa-url-c.com"
}
```

_Note: Jekyll will interpret line breaks where your conditional statements are, if that annoys you, start the JSON syntax at the end of the conditional line._


### Fetch the environment variables in your Vue component

Set the empty data:
```
data: function() {
  return {
    environmentVariables: {}
  }
}
```
Fetch your JSON:
```
created: function() {
  fetch('/environment-variables.json')
  .then(response => response.json())
  .then(response => {
    this.environmentVariables = response;
  })
  .catch(error => {
    console.log(error);    
  });
}
```
Now your variables are set in the `environmentVariables` object and ready to be used in your component.

Data crisis averted!



