---
title: "Postman: Effectively Storing and Using Tests in a Git Repository"
slug: 2016-04-14-postman-effectively-storing-and-using-tests-in-a-git-repository
date: 2016-04-14 08:00:00
image: https://farm5.staticflickr.com/4003/4651347626_f103e734c0_b_d.jpg
image_url: https://www.flickr.com/photos/pschadler/
image_credit: Paul Schadler
tags:
- Postman
twitter_text: "Postman: Effectively Storing and Using Tests in a Git Repository"
authors: 
- Ken Dale
---

[Postman](https://www.getpostman.com/) is a great tool for testing HTTP/HTTPS endpoints. It's useful for *quick tests*, as well as authoring detailed test suites. Even tests that rely on the output of other tests can be assembled!

Postman tests can be exported to JSON. And, since JSON is *text* it can be versioned as part of a repository. All the value derived from plain text in source control can be extended to Postman tests!

## Newman

Newman is a command line runner built for Postman, available on npm as [newman](https://www.npmjs.com/package/newman). A simple `npm install newman --save-dev` will install it and add it as a *devDependency* in your Node.js application.

If the application isn't a Node.js application and you don't have a *package.json* yet, simply run `npm init` to create a *package.json* file. Adding *package.json* to existing applications enables developers to install any dependencies with `npm install`. Plus, *package.json* `scripts` are a great place to match environments and test files!

## Encapsulate environment concerns

Postman includes functionality for storing information for various environments. These environments can be switched as necessary using the Postman GUI. And, they can also be downloaded as JSON files -- which is useful for a command line runner.

## Put it all together

With any environments captured and the tests saved, we wire it all up with *package.json* `scripts`. The *package.json* `scripts` is a great place to match the tests to run, the environment to use, and any other concerns as various `npm run ...` commands.

Here's an example `package.json`:

```
{
  "name": "MyApplication",

  ...

  "scripts": {

    ...

    "integration-tests": "npm run integration-tests-local",
    "integration-tests-local": "newman -c tests/Postman/MyApplication.postman_collection -e tests/Postman/MyApplication-local.postman_environment",
    "integration-tests-qa": "newman -c tests/Postman/MyApplication.postman_collection -e tests/Postman/MyApplication-qa.postman_environment",
    "integration-tests-production": "newman -c tests/Postman/MyApplication.postman_collection -e tests/Postman/MyApplication-production.postman_environment"
  },

  ...

  "devDependencies": {
    "newman": "^2.0.5"
  }
}
```

This enables us to run the following from the command line:

- `npm run integration-test` *(also available as `npm run integration-tests-local`)*
- `npm run integration-test-qa`
- `npm run integration-test-production`

The important point is, as a contributor, **you don't need to know or understand environmental differences. It's all encapsulated in these simple commands!**

## The import/export roundtrip

When using the Postman GUI, requests are stored *internally*. This *internal* storage is useful for those who primarily *(or, only)* use the GUI tool. But, this creates another *state* that may or may not match the current state of the repository. **This is perhaps the biggest pain point of this approach.**

To address this, you'll need to import the *latest* into the GUI runner as necessary, since it won't automatically be updated as the repository evolves. Then, you'll need to export any changes back out to commit them. **For this reason, I recommend leaning on the command line runner as much as possible -- and using the GUI tool only as necessary for test authoring.** Import what you need into the Postman GUI, make any changes, export the changes, and commit them.

## Possible next steps

Now that Postman tests can be easily executed from the command line, they could be wired up to a continuous integration build, as a pre and/or post deployment step, scheduled to run on an interval as a `cron` command, or something else! The only limits are your imagination *(and, Node.js + npm being installed and available)*!
