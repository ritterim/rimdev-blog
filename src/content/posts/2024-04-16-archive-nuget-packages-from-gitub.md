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

You'll need to get an Github api key from [your account]("https://google.com") and set it in your headers as a bearer token.

## Downloading off their api?

Like I mentioned their api is great for managing the existing packages, but they don't have a documented endpoint to download them. After some research I was able to find an endpoint to download nuget packages. Thanks to {insert name}'s [blog post]("link to his blog post")

```
https://nuget.pkg.github.com/{organization_name}/download/{package_name}/{version}/{package_name}.{version}.nupkg
```

This endpoint isn't on their official documentation but there is threads of multiple people using it and I've tested it out myself.

## Bring it all together

Knowing the endpoint exist is just half the battle, you'll need to know more about the package and it history if you want to be able to do a full archive. Luckily we can use their api to get the information we need. For these examples we're going to focus on the organization endpoints since most popular packages are associated to an organization, but you can easily change the endpoints based on the package. For a full list of endpoint you can checkout [Github's API documentation]("githubs documentation website")

### Getting all the package

`endpoint` is where you can call to get a list of packages for an organization. The response is going to give the latest package version information. If all you're going to do is download the most current packages that's all you'll need, but we need one more endpoint to archive everything.

Example response:
```json
[
    {
        "version": "2.3.4",
        "name": "package_name"
    }
]
```

`getAllPackageVersionsOwnedByOrg` will list all the versions for a particular package. With this information we can build http calls with the first url and archive our entire package history.

Example response:
```json
[
    {
        "version": "1.0.0",
        "name": "pakage_name"
    }
]
```


## Wrapping up

This should give an blueprint of where and how to archive you're packages. You can take these basic steps and implement them into your own code and automate a job to download everything, or just use it as a one time process.