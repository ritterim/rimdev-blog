---
title: "Working At Work: This And Other Thoughts On High Availability"
slug: our-devops-journey-release-branches-highly-available-azure-web-apps-and-terraform
date: 2019-08-29 14:00:00
tags:
- Azure
- DevOps
categories:
- development
twitter_text: "Working At Work: This And Other Thoughts On High Availability"
authors: 
- Ken Dale
- Thomas Sobieck
image: https://images.unsplash.com/photo-1463330101503-c181c5d4d107?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/KX476JMkya0
image_credit: Ross Sokolovski
---

Over the previous year we've been working to improve our overall uptime. While we aren't prepared to offer 99.999% availability in the way a cloud provider may, we're better prepared to meet unplanned outages. Not only is high availability making us more reliable, it means we can perform more tasks during the day.

# Benefits

## More resilient to outages

This is what you expect: Applications that stay online when unexpected things happen. That's good news for everyone.

## Work during the workday

A reason you may not immediately consider but has been a great benefit for us: **working *during* the workday**. If you work on systems with an expectation of core *available* hours that aren't suitable for planned downtime during your typical workday, you can still take part of the system offline safely. This has enabled us to move applications to different Azure App Service Plans during the workday, which wouldn't be feasible without another available instance to handle the incoming requests.

**We can also scale our App Service Plans up or down** -- and, as long as we don't scale *all* instances at the same time Azure Traffic Manager will stop routing traffic to the unavailable instances and favor the online ones *(after it discovers they are down and the DNS TTL expires...)*. Sure, Azure Traffic Manager is DNS based so there's some latency with failover. But, that can be overcome by eagerly disabling endpoint routing before the planned outage (in our case, we can use Terraform to easily stop an entire region from receiving requests).

**We're able to rebuild infrastructure, make changes, and experiment *(within reason)* all in production during the workday.** As long as we do things in the proper order we're OK. Sure, there is the risk of error doing things out of order but if something goes sour you've got a team to help who are available -- not eating dinner, putting their kids to bed, or relaxing for the evening.

# Challenges

Adding additional Azure Web Apps into the mix doesn't come without additional complexity. These applications need to be able to move traffic between instances seamlessly and handle multiple instances starting up simultanously.

## Shared secrets

If you need to access encrypted cookies and similar data between instances you'll need to share the encryption/decryption capability with the other instances. This *just works* if you have a single instance. But, once you have a completely separate Azure Web App *(not using the scale out feature)* you'll need to handle ASP.NET full framework machine keys ASP.NET Core Data Protection keys yourself.

## Health checks

We needed an endpoint to know when an app is healthy and should have traffic routed to it, as needed by Azure Traffic Manager. For ASP.NET full framework we ended up creating a NuGet package to reuse ASP.NET Core health checks. See our post [Using ASP.NET Core Health Checks With ASP.NET Full Framework]({% post_url 2019-02-12-using-aspnet-core-health-checks-with-aspnet-full-framework %}) for more details.

## A few more assets

With high availability comes the need for load balancing between instances and shared backend state, if needed.

## Architect applications for multiple instances

Applications themselves need to be able to handle being on multiple instances. Any file system that is local to the instance shouldn't be used (other than for temporary items, for example something generated during a request). And, database migrations and other behavior happening on startup needs to handle multiple simultaneous startups between apps, which happens when we swap all staging slots into production at the same time.

# In closing

High availability doesn't come free but we feel it has been worth the investment overall.
