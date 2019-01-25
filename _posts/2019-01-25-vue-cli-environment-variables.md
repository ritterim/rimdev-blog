---
layout: post
title: "Vue CLI Environment Variables"
date: 2019-01-25 11:05:21
tags:
- Vue.js
- JavaScript
- Webpack
categories:
twitter_text: Vue.js CLI setting env var
authors: Andrew Rady
image: https://images.unsplash.com/photo-1547575542-c56648365a4f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80
image_url: https://unsplash.com/photos/f8WsJd6zpBY
image_credit: Karl Block
---

In development it is common we don’t want to share everything in our code. Things like usernames, password, links to an api, and more don’t want to be stored directly in the code for everyone to see. Storing them in environment variables is one of the easiest ways keep them private and have our code still access these important strings. With Vue CLI 3 out now there is some changes on how it accesses environments variables that is different then the second version. Let’s go into how we would access our environment variables in the second version of the cli.

When spin up a new vue project with cli 2 the root project will have the bulk of the application in `src` directory. What we want to work with though is in the `Config` directory. In there we will have three files `dev.env.js`, `index.js`, and `prod.env.js`. Here we can set up the access for webpack to allow our Vue application to access these. 

In `prod.env.js` we have a `module.export` object we can are going to added to,

```javascript
Module.export = {
  NODE_ENV: “production”,
  API_URL: JSON.stringify(process.env.apiUrl)
}
```

Now `process.env.apiUrl` is the standard way we access environment variables in node application, but the vue cli need some additional configuration to be able to get access to these like the example above. This would set your production environment so on your host like Heroku or Azure you would want to set the api string to your live api. Let’s say you have a test environment somewhere else, or you have a local so instance running for development. You can set the same thing in `dev.env.js` and it would use that in the development mode. 

With Vue CLI 3 there has been some changes to how to approach this. The new cli tries to create more abstraction from webpack to allow us to focus more on the project. This is great and everything is fine until you need to change some configuration. In this situation there is a nice explanation on how the new cli handles this [here]( https://cli.vuejs.org/guide/mode-and-env.html). I think for some fine for some basic applications, but a few robust apps it make me more concerned. One is that I don’t like how you must set your internal name that you access must start with VUE_APP_. For example in our given situation it would set our api in `.env.production` in the root of the application like

```
VUE_APP_API_URL=https://super-secert-url.com
```

I know the naming things is person conviction so that might not bother you, but now I have a file I must ignore in git and manually put on the server somewhere to keep the api url hidden if you are using something like github.  

After doing some digging around, I found a nice alternative way to still be able to access environment variable like how we did in the second version of the cli. In the root of the project we are going to make a new file called `vue.config.js` and here we can make some webpack configurations.

```javascript
var webpack = require('webpack')
	
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'API_URL: JSON.stringify(process.env.apiUrl)
        }
      })
    ]
  }
}

```

With this simple additional file we can access environment variable within our Vue application and keep private information out of git repos. This is also where we can make other common configuration changes like changing the local port number.