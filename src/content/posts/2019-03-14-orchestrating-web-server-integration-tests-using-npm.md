---
layout: post
title: Orchestrating Web Server Integration Tests Using npm
date: 2019-03-14 13:00:00
tags:
- JavaScript
- npm
categories:
- development
twitter_text: "Orchestrating Web Server Integration Tests Using @npmjs"
authors: Ken Dale
image: https://images.unsplash.com/photo-1484788984921-03950022c9ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/j4uuKnN43_M
image_credit: Alex Knight
---

It can be tricky to run integration tests targeting a web server using the command line. Essentially, we need to:

- Start the application
- Wait for the application to be ready *(begin responding to requests)*
- Run integration tests
- Terminate the server after test run is complete

**We can do all of this with a simple npm script:**

## `package.json`

```json
{
  "scripts": {
    "integration-tests": "concurrently -k -s first \"npm start\" \"wait-on http://localhost:8081/ && COMMAND_TO_RUN_HERE\""
  }
}
```

And run the script:

```
> npm run integration-tests
```

## Let's break down how it works

The [`concurrently`](https://www.npmjs.com/package/concurrently) npm package uses these arguments:

- `-k` (or `--kill-others`): kill other processes if one exits or dies
  - **After the test run concludes we terminate the web server too.**
- `-s first` (or `--success first`): Return exit code of zero or one based on the success or failure of the "first" child to terminate, the "last child", or succeed only if "all" child processes succeed. [choices: "first", "last", "all"] [default: "all"]
  - **Since the tests will terminate before the web server the exit code of the tests will be returned.**
- List each item to execute -- the commands for starting the web server and running the integration tests. Since we are inside a JSON string we can escape the inner double quotes with `\"`.
  - **We want the tests to run *after* the web server has started up and is responding to requests.** We can use the [`wait-on`](https://www.npmjs.com/package/wait-on) npm package to wait for a url to start working. *Adjust the `http://localhost:8081/` in the script as needed.*

## Final note

Lastly, don't forget to `npm install concurrently wait-on --save-dev` into your project! Happy testing!
