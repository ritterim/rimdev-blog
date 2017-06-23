---
layout: post
title: Making a Web Request After an AppVeyor Deployment to Start an Application
date: 2017-06-23 12:00:00
tags:
- AppVeyor
categories:
- development
twitter_text: "Making a Web Request After an AppVeyor Deployment to Start an Application"
authors: Ken Dale
---

For ASP.NET applications it can be useful to make a request to an application immediately after deployment to bring the application online. When using AppVeyor for push deployments, we can run this directly from AppVeyor!

Add the following to your **appveyor.yml** file:

```yaml
after_deploy:
  - ps: |
      if ($ENV:APPVEYOR_REPO_BRANCH -eq "master")
      {
        iex "curl https://production.example.org"
      }
      elseif ($ENV:APPVEYOR_REPO_BRANCH -eq "development")
      {
        iex "curl https://qa.example.org"
      }
```

**Note:** In this case you'll still pay the startup penalty. For performance sensitive applications you may need to bring the application online as a second instance and *swap* to the new instance, which isn't covered here.
