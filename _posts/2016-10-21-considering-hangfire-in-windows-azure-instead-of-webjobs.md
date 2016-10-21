---
layout: post
title: "Considering Hangfire In Windows Azure Instead Of WebJobs"
date: 2016-10-21 09:25:46
tags:
- Windows Azure
- Jobs
- Hangfire
categories:
- Windows Azure
twitter_text:
authors: Khalid Abuhakmeh
image: https://farm6.staticflickr.com/5285/5362037986_dfc80c3d20_b_d.jpg
image_credit: Jameel Winter
image_url: https://www.flickr.com/photos/jameelwinter/
---

Applications are known to break, but erosion is a much sneakier adversary of the modern web developer. That is why it is important to understand your options to deal with this unwanted problem. The most common approach is to build asynchronous tasks that run in the background, commonly referred to as jobs. Jobs can sync data, remove unwanted resources, and more; something a developer doesn't want to keep doing manually.

We, at [Ritter Insurance Marketing][rim], utilize the .NET stack and host on [Windows Azure][azure]. We have a few options for running jobs:

1. [Azure WebJobs][jobs]
2. [Azure Scheduler][jobs]
3. [Hangfire][hangfire]

There are two categories that we want to consider when choosing our approach, and maybe you should too:

1. How are the development and deployment experience?
2. How will these jobs behave in our current infrastructure?

## Azure WebJobs

#### Development & Deployment

Azure WebJobs is a very competent approach to running jobs, as they are simply `console` applications. The development experience is something many developers are comfortable with, and you can undoubtedly complete. Another advantage is these jobs can be run locally by executing the `exe`.

The deployment process fits into the `git` strategy we have adopted as a team. If a job is present in a solution, it automatically gets added to the App Service. We also have two flavors of a job to pick from, Continuous and Scheduled (Cron).

#### Production

The Azure WebJob experience is an enjoyable one. The console output is displayed in a tool found in the Azure Portal and can give insight into *what* is happening.

The issues we find with Azure WebJobs is the following:

- Continuous jobs run on all instances, which is good if you trigger jobs via a queue but not any other situation.
- Scheduled jobs run on a single instance within the same App Service. Think slider. Scheduled jobs pose an issue if you have the same App Service load balanced across regions (east and west). The same scheduled job could run twice in two regions at the same time.
- No way to relate Jobs to each other. If one needs to run before the other should start, then you need to time them correctly.

If these are not issues, then Azure WebJobs is a suitable approach. You can overcome some of these matters by writing custom logic to account for them, but that may introduce more problems.

## Azure Scheduler

Azure Scheduler is a task scheduler for the cloud. It can perform actions suited for Windows Azure:

- Call an endpoint at a particular time.
- Push a message in Azure Service Bus.
- Create a record into Azure Storage.
- Trigger an Azure WebJob

#### Development And Deployment

The development experience is similar to Azure WebJobs as you write your task into a console application, or write an HTTP endpoint to perform an action.

As for setting up the scheduled task, you have two options currently:

- Do it manually (yuck).
- Automate it yourself via Azure Resource Manager (ugh).

You technically can't test Azure Scheduler locally, but you can mimic its behavior. I guess that's ok, right?

#### Production

Once setup, we found that the Azure Scheduler worked dependably and as advertised. It solved the load balancer issue we had with Azure WebJobs as we were triggering execution through the TLD in front of the load balancer and it just worked.

Note: Security is not available on the free tier of Azure Scheduler. The standard tier will cost your $15 USD a month.

## Hangfire

[Hangfire][hangfire] is an integrated job scheduler designed to work in multiple hosting environments: ASP.NET and console applications. It supports .NET 4.5+ and .NET Core. 

#### Development and Deployment

Hangfire works the same locally as it does in production. It is part of the application and exercising the jobs happens the same way. It supports multiple backing stores like SQL Azure, Redis, and more.

Since it is part of the application, it can be deployed using our approach without any changes. It just works!

Hangfire also supports many other types of jobs that are not currently available to us with Azure WebJobs: Fire and Forget, Continuation Jobs, and Logical Retries.

#### Production

We have done preliminary tests and found the problems present with Azure WebJobs and Scheduler just are not there. Since we use SQL Azure as the backing store, it doesn't matter what regions we use for load balancing. It is also very easy to know what's happening as the included dashboard is very informative.

## Conclusion

At some point, a background job is necessary to fend off the erosion of your application. In our current tech landscape, we have many options available to us. I mentioned a few above, and currently, Hangfire is the most compelling one we found. It addresses the issues we found using Azure WebJobs and then brings more to the table. It works for our developers locally, and for our users in production.

[rim]: https://ritterim.com
[hangfire]: http://docs.hangfire.io/en/latest/
[azure]: https://windowsazure.com
[jobs]: https://azure.microsoft.com/en-us/documentation/articles/web-sites-create-web-jobs/