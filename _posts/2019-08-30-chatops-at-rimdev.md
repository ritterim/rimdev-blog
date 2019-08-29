---
layout: post
title: "ChatOps at RIMDev Using Probot"
date: 2019-08-30 11:03:06
tags: 
- devops
- rimbot
- chatops
categories: 
- development
twitter_text: ChatOps at RIMDev Using Probot
authors: 
- Thomas Sobieck
- Ken Dale
image: https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80
image_url: https://unsplash.com/photos/U3sOwViXhkY
image_credit: Franck V.
---

About a year ago, RIMDev started a DevOps transformation. As part of that transformation, we started to use slots in Azure app services, deployed to multiple regions for resilience, and a whole lot of other useful additions. We outline many of these changes in the post titled [Our DevOps Journey](https://rimdev.io/our-devops-journey-release-branches-highly-available-azure-web-apps-and-terraform/). This post is part of a series of posts about RIMDev's DevOps transformation.

## The Problem

Swapping from staging to production was a new process at RIMDev. It solved many hard problems for us, but almost immediately we realized that manually swapping in the Azure portal was a frustrating experience. Using the portal was tedious and error-prone when you are managing multiple instances in different regions. So we ended up settling on using the [swap](https://www.terraform.io/docs/providers/azurerm/r/app_service_active_slot.html) functionality built into Terraform's azure provider. This was good because we couldn't make mistakes like forgetting to swap an instance. However, it required two PRs for each deployment. A PR to swap the instances and a PR to remove the Terraform state.

> TLDR; Using Terraform to manage swaps is a pain and it was becoming irritating for the whole team.

## The Idea

We knew that we needed to create another tool to manage swaps and maybe do some other little housekeeping chores. We figured that we'd create a webpage with a traditional UI but we stalled with creating the tool even after the pain of Terraform swaps was becoming apparent. This time spent experiencing the pain of Terraform swaps led [Khalid](https://rimdev.io/authors/khalid-abuhakmeh/) to have the insight that this new DevOps tool should work as a chatbot. We could manage our infrastructure in the same places that we work, Slack and GitHub, and we'd leave a trail of breadcrumbs. Needless to say, the team thought this was an excellent idea and within a week we had some rudimentary functionality running in what we called Rimbot.

## The Stack

We wanted a bot that could work in Slack and GitHub, but GitHub is the primary place where our work happens. We manage work prioritization and assignment with GitHub issues, we create release notes in GitHub, we manage our code in GitHub, creating release branches kicks off builds to deploy to our staging environment, etc. So we were looking for a framework that would easily allow us to integrate with GitHub. This led us to [Probot](https://probot.github.io/). Probot is designed to make creating a bot that responds to GitHub events effortless. You don't have to worry about setting up anything. You just create a listener for some event you are interested in and you are off to the races. Everything is included.

Rimbot is a TypeScript app. It is our first major app written in TypeScript and it has been a great experience. We've refactored and evolved Rimbot from a simple little app to something much more complex. We felt comfortable creating massive design changes even after our team was depending on Rimbot because the type system was catching all the obvious errors. Rimbot simply wouldn't compile if it wasn't likely to work. TypeScript does take a little more ceremony to work but in the end, we think it is worth it.

## The Deployment

Rimbot was relatively simple to deploy. It just required us to register our bot with Git hub and then host Rimbot somewhere. After some pain of trying to host Rimbot on a windows azure application instance running node (hosting in IIS will not work due to a fundamental problem of how Probot and IIS handle ports), we just ended up running Rimbot on a Linux app service plan in Azure and this worked like a breeze. Rimbot is continuously deployed, when a PR is merged to `master` Rimbot is deployed to production.

## The Evolution

The first commands we deployed were `@rimbot health [service names]`, `@rimbot version [service names]`, and `@rimbot swap [service names]`. We didn't worry about Slack in our first versions of Rimbot. We wanted our swap command to be very safe. So swap built on top of the functionality we created in version and health. Swap calls out to version to make sure that all of the staging instances are running the correct code before we swap and then it checks version again after the swap is done to make sure that the version of the app is correct in production. We also make sure that the apps are reporting that they are healthy using the functionality built into health.

From that relatively simple app, Rimbot has evolved to:

- Run commands on Slack that are informational. For example, health is available to run in slack but `swap` is not.
- Run commands from Microsoft Teams with the same rules as slack (pending)
- Have the ability to cut release branches with a single command
- Monitor how much code is not deployed
- Scale-up and down the development environment to save hosting costs
- And more

## The Reception

Our team loves what Rimbot has done to our processes. Here is a sampling of unsolicited praise:

- "I cannot tell you enough...how much I love rimbot! and how we handle releases these days!" - Steliana Vassileva, Documentation Specialist
- "Y’know you really are creating a great tool. 🙂" - Beth Warner, Lead QA Developer
- "Rimbot, you're the only one that talks to me anymore. Respect 🤗'" - Khalid Abuhakmeh, Software Development Director 
- "Rimbot is so fun to work on! I am working nights and weekends because I can't stop. I'm afraid there might be an intervention soon." - Thomas Anderson Sobieck, Sr. Software Developer
  
This is a random exchange from Slack:
```
"I kind of want a `rimbot` sweatshirt" - John Vicari, Developer
"I would wear the hell out of a rimbot sweatshirt" - Jaime Jones, Lead Frontend Developer
"can we do ugly sweaters too?!" - Andrew Rady, Front End Developer
```

Sadly, this sweatshirt situation hasn't materialized. 
