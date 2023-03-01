---
title: "Our DevOps Journey: Release Branches, Highly Available Azure Web Apps, and Terraform"
slug: our-devops-journey-release-branches-highly-available-azure-web-apps-and-terraform
date: 2019-08-28 8:45:00
tags:
- Azure
- DevOps
- Terraform
categories:
- development
twitter_text: "Our #DevOps Journey: Release Branches, Highly Available @Azure Web Apps, and @HashiCorp Terraform"
authors: 
- Ken Dale
- Thomas Sobieck
image: https://images.unsplash.com/photo-1548638643-b16e0ceab1cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/sEpzK_EeIcs
image_credit: John Thomas
---

## Our starting point

This past year we've been on a DevOps journey. While we haven't been in a state of stagnation or chaos as a team, we've identified areas where we could improve. We wanted to improve in areas that helped us work better as a team and deploy the best applications we can. We didn't start our transformation with no practices or principles as a team. We've been doing continuous integration, continuous delivery, and pull requests using GitHub for quite some time. We weren't starting from zero by any measure. But, **over time we've identified areas in our processes where we can improve based on how we work as a team**.

## Release branches

- **Before:** Continuously deploy the `master` branch to production and the `development` branch to our QA enviroment.
- **After:** Continuously deploy `master` to our Development environment *(replaces QA)*. At any point in time cut a release branch from `master`, verify it is working and stable in our staging environment, and swap that into production.
- **Why:** We found ourselves in a contentious state between developers and QA. We don't want to hold up merging PRs for features, enhancements, and bug fixes -- but, we also don't want to keep changing the code that QA is trying to verify stable for release. **Release branches give QA a stable place to test from while allowing developers to continue moving forward.**

## Highly available Azure Web Apps

- **Before:** Individual Azure Web Apps in their own isolated app service plans *(for the heavy hitters, anyhow)*.
- **After:** Azure Web Apps in multiple regions grouped onto fewer App Service Plans with Azure Traffic Manager controlled failover.
- **Why:** We want our applications to be stable and resilient to outage. Note that we don't feel the need to spend to get 99.999% availability, but we want the added stability of hosting in multiple datacenters.

We also found it more cost effective to group applications onto fewer app service plans. It can suffer from noisy neighbor issues, but at least we know all of the neighbors (since they're all our own applications).

## Infrastructure as code (Terraform)

- **Before:** Manually use the Azure UI in the browser to construct everything.
- **After:** Construct our web applications using [Terraform](https://www.terraform.io).
- **Why:** With the addition of multiple Azure Web Apps behind Azure Traffic Manager the amount of assets and configuration needed for each individual web application became quite high. This allowed us to construct a large number of cloud assets in a reproducible fashion.

## Continued challenges

Our biggest challenges as a team aren't C#, or JavaScript, or anything going into pull requests. It's the items that don't quite fit into a pull request. Things like configuration, whether they be permissions needing to be added, secrets for secure communication, unexpected behavior when transforming configuration, or anything else.

Basically we do very well as as team with the code items in a pull request, but there's room for improvement for items that aren't in pull requests.

## The road ahead

Everyday we strive to make our systems more functional, reliable, and available. We'll continue to improve and revise our infrastructure and processes as a team to better suit our workflow and help meet our goals. We expect the journey to continue into the future as we continue to refine and adjust what works best for our team.
