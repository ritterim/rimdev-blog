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

In development it is common we don’t want to share everything in our code. Things like usernames, password, links to an api, and more should not be stored directly. Storing them in environment variables is one of the easiest ways keep them private and have our code still access these important strings. The way Vue CLI 3 accesses environment variables is different from version 2. Let's see how we would access our environment variables in version 2.

When we spin up a new vue project in the root there is a `src` directory that has the bulk of the app. What we want to work with though is in the `Config` directory. In there we will have three files `dev.env.js`, `index.js`, and `prod.env.js`. Here we can setup how to access our environment variable through out our app.

In the `prod.env.js` file located in the `Config` directory there is a `module.export` object. We can are going to added some properties to this object to access the environment variables,

```javascript
module.export = {
  NODE_ENV: “production”,
  API_URL: JSON.stringify(process.env.apiUrl)
}
```

`process.env.apiUrl` is the standard way we access environment variables in node applications, but the Vue CLI needs some additional configuration to be able to get access to these like the example above. This would set your production environment to look for these variables on your host like Heroku or Azure. Let’s say you have a test environment somewhere else, or you have a local instance running for development. You can set the changes in `dev.env.js` and it would use that in the development mode. 

With Vue CLI 3 there has been some changes to how to approach this. The new cli tries to create more abstraction from webpack to allow us to focus more on the project. This is great and everything is fine until you need to change some configurations. In this situation there is a nice explanation on how the new cli handles this [here]( https://cli.vuejs.org/guide/mode-and-env.html) which use `.env` files. I think this fine for some basic applications, but more robust apps it make me more concerned. One is that I don’t like how you must set your internal name so that you access must start with `VUE_APP_`. For example in our given situation it would set access in `.env.production` in the root of the application like

```
VUE_APP_API_URL=https://super-secert-url.com
```

I know the naming convention is a personal conviction so that might not bother you, but now you have a file you must ignore in git and manually put on the server somewhere to keep the api url hidden if you are using something like github.  

After doing some digging around, I found a nice alternative way to still be able to access environment variables like how we did in the second version of the cli. In the root of the project we are going to make a new file called `vue.config.js` and here we can make some webpack configurations.

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

With this simple additional file we can access environment variables within our Vue application and keep private information out of git repos. This is also where we can make other common configuration changes like changing the local port number.
