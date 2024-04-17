---
title: "Archive Nuget Packages From Github"
slug: archive-nuget-packages-from-github
date: 2024-04-16
tags:
- Github
- Devops
categories:
- Github
- Devops
twitter_text: "Archive Nuget Packages From Github"
authors: 
- Andrew Rady
---

# Downloading Nuget Packages Though Github's Api

Github's package ecosystem is a great place to store packages for individuals, open-source groups, and companies. Github also provides a great api for developers to use and manage their packages. It's important to understand that the api is intended to _manage_ your packages. Recently we wanted to archive all of our package releases for various reasons. We could have gone to Github's website and download each release but that can be time consuming and tediou process if you have a lot. Plus if we needed to do this again that means someone will have to do it all over.

**Disclaimer**

You'll need to get an Github api access token. Checkout [github's documentation about creating one](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28#authenticating-with-a-personal-access-token). Once you have one you can set it in your headers as a bearer token.

## Downloading off their api?

Like I mentioned their api is great for managing the existing packages, but they don't have a documented endpoint to download them. After some research I was able to find an endpoint to download nuget packages. Thanks to Josh Johanning's [blog post](https://josh-ops.com/posts/github-download-from-github-packages/)

```
https://nuget.pkg.github.com/{organization_name}/download/{package_name}/{version}/{package_name}.{version}.nupkg
```

This endpoint isn't on their official documentation but there's multiple threads of people using it and I've tested it out myself.

## Bring it all together

Knowing the endpoint exist is just half the battle, you'll need to know more about the package and it history if you want to be able to do a full archive. Luckily we can use their api to get the information we need. For these examples we're going to focus on the organization endpoints since most popular packages are associated to an organization, but you can easily change the endpoints based on the package. For a full list of endpoint you can checkout [Github's API documentation](https://docs.github.com/en/rest).

### Getting all the package

The endpoint `/orgs/{org}/packages` is where you can call to get a list of packages for an organization. The response isn't going to give much package version information. If all you're going to do is download the most current packages that's all you'll need, but we need one more endpoint to archive everything.

Example response:
```json
[
  {
    "id": 197,
    "name": "hello_docker",
    "package_type": "container",
    "owner": {
      "login": "github",
      "id": 9919,
      "node_id": "MDEyOk9yZ2FuaXphdGlvbjk5MTk=",
      "avatar_url": "https://avatars.githubusercontent.com/u/9919?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/github",
      "html_url": "https://github.com/github",
      "followers_url": "https://api.github.com/users/github/followers",
      "following_url": "https://api.github.com/users/github/following{/other_user}",
      "gists_url": "https://api.github.com/users/github/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/github/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/github/subscriptions",
      "organizations_url": "https://api.github.com/users/github/orgs",
      "repos_url": "https://api.github.com/users/github/repos",
      "events_url": "https://api.github.com/users/github/events{/privacy}",
      "received_events_url": "https://api.github.com/users/github/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "version_count": 1,
    "visibility": "private",
    "url": "https://api.github.com/orgs/github/packages/container/hello_docker",
    "created_at": "2020-05-19T22:19:11Z",
    "updated_at": "2020-05-19T22:19:11Z",
    "html_url": "https://github.com/orgs/github/packages/container/package/hello_docker"
  }
]
```

The endpoint `/orgs/{org}/packages/{package_type}/{package_name}/versions` will list all the versions for a particular package. With this information we can build http calls with the first url and archive our entire package history.

Example response:
```json
[
  {
    "id": 245301,
    "name": "1.0.4",
    "url": "https://api.github.com/orgs/octo-org/packages/npm/hello-world-npm/versions/245301",
    "package_html_url": "https://github.com/octo-org/hello-world-npm/packages/43752",
    "created_at": "2019-11-05T22:49:04Z",
    "updated_at": "2019-11-05T22:49:04Z",
    "html_url": "https://github.com/octo-org/hello-world-npm/packages/43752?version=1.0.4",
    "metadata": {
      "package_type": "npm"
    }
  },
  {
    "id": 209672,
    "name": "1.0.3",
    "url": "https://api.github.com/orgs/octo-org/packages/npm/hello-world-npm/versions/209672",
    "package_html_url": "https://github.com/octo-org/hello-world-npm/packages/43752",
    "created_at": "2019-10-29T15:42:11Z",
    "updated_at": "2019-10-29T15:42:12Z",
    "html_url": "https://github.com/octo-org/hello-world-npm/packages/43752?version=1.0.3",
    "metadata": {
      "package_type": "npm"
    }
  }
]
```


## Wrapping up

This should give an blueprint of where and how to archive you're packages. You can take these basic steps and implement them into your own code and automate a job to download everything, or just use it as a one time process.