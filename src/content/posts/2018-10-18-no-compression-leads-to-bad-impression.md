---
title: "No Compression Leads To Bad Impression"
slug: no-compression-leads-to-bad-impression
date: 2018-10-18 08:20:12
tags:
- Development
- Elasticsearch
- Debugging
categories:
- Development
twitter_text: "No Compression Leads To Bad Impression"
authors: 
- Thomas Sobieck
image: https://farm6.staticflickr.com/5004/5315466701_58b0862c87_b.jpg
image_url: https://www.flickr.com/people/midorisyu/
image_credit: midorisyu
---

Do you want to save 80% of your bandwidth to your search provider? Do you want to deliver content to your users faster?  With this one **trick** you can!

![This shows a graph showing approximately 80% reductions in data in and out of an Azure service](/images/before-after-compression.png){: .img-fluid}

As shown in the graphic above, using this **trick** we reduced the amount of bandwidth we consumed by 80%! 

## Problem

I’ve found backend services communicating without compression a few times in my career. Lack of compression is an issue because it is mostly invisible. When you interact with a RESTful API through a browser, you can see whether compression is occurring in the developer tools.  Those calls that your back-end services are making are opaque unless you are intercepting the traffic with [Fiddler](https://www.telerik.com/fiddler). 

At a previous employer, I was informed of a compression issue because the shared on-call phone was going off at around 2 AM in the morning. After some investigation, we learned that our search provider would sometimes return large result sets. When this happened to a few customers during a period of low traffic, the issue would set off **ALL THE ALERTS**. The alerts were not good for my mental health because low traffic times happened in the middle of the night. We ended up adding compression, we saved a fortune on bandwidth, and our customers were better off as well. 

The most recent example is when I found a compression issue here at RIMdev. We love using [Elasticsearch](https://www.elastic.co/products/elasticsearch) because it enables high-value scenarios that our users appreciate. One day I was attempting to optimize some queries while I had Fiddler open. I noticed that the results from Elasticsearch were not compressed. In some instances, we were getting results that were 400kb and could take more than a second to transfer! By enabling compression, we shaved more than a second off of response times while reducing the data transferred between the app and data center by ~80%.      

## The Trick for Compressing Elasticsearch Responses

To solve this issue at RIMdev, we used this code to enable compression for the Elasticsearch C# client, [NEST](https://www.elastic.co/guide/en/elasticsearch/client/net-api/6.x/index.html).

``` csharp
var settings = new ConnectionSettings(connectionPool)
    .EnableHttpCompression() // this line enables http compression!
    // a lot of other settings
    ;
    
return settings;
```

I told you it was ONE SIMPLE TRICK! You may have to configure your Elasticsearch cluster to compress results, but it just worked for us. We are ready to help you in the comments if you any questions or concerns. 

## Bottom Line

*Debug your services occasionally with Fiddler. Open and watch the network traffic your applications produce. You might find low hanging optimizations with high impact results!*