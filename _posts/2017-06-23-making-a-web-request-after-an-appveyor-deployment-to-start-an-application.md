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

If your users are lucky, AppVeyor will pay the start-up cost penalty a real human would normally experience. If luck is unacceptable, you may consider using a staging slot and only switch to production once your application is fully warmed up.
