---
layout: ../layouts/Post.astro
title: "Be Careful Of Sinking In Elasticsearch Deep Paging Quicksand"
date: 2017-12-02 11:29:53
tags:
- elasticsearch
categories:
- elasticsearch
twitter_text: "Be careful of sinking in @elastic deep paging quicksand"
authors: Khalid Abuhakmeh
image: https://farm4.staticflickr.com/3831/13944309974_47487b0742_h_d.jpg
image_url: https://www.flickr.com/photos/pierce-martin/13944309974/in/photolist-nfdexu-9gsEyT-dRsadY-cMbd8N-6XuBxG-jVwE2-jB8GrQ-d6vfwC-9gM3Lj-85nHWx-aFHXf2-7f2k5f-2TKGKr-dU6FTL-7n5iuV-7Jbffe-8F7Esf-e4vKEA-dLaM4t-5wcpbS-buR5Ff-7JdQ4J-7J9T5t-bHSRSP-4Xbv3C-7JdPPs-dXbwyU-7J9Szz-oZNcp9-DYf7cJ-5BzGxw-7J9Tyx-7J9Tir-548zMB-gUe88U-7JdNY5-HZjWyA-boXw4e-7hp2kj-3BgS9z-y4PxA-gVpgDp-7J9UDz-4Rnp6-gUe8eA-7JdNM3-7JdQtS-7J9TBe-peVcUK-4RnqU
image_credit: Pierce Martin
---

Software development is a funny thing. As I develop my skills, I begin to form an idea of what's *right* and *wrong*, what's *up* and *down*. This innate intuition works a majority of the time, and there are times where it **bites me in the butt**. Ten years ago, developing an application meant developing a basic [CRUD][crud] application.

1. An index page with a table and rows.
1. An edit page for records.
1. A pager to help a user labor through pages 1 of a million.

In 2018, let's admit it.

> From a user's perspective, paging data is a bad experience.  
> -- Repeat To Self x3

Just because paging is a bad idea, doesn't mean a developer won't try to build it into their application. Even the best of us want to try and get away with it. Looking at you **Google**.

![Google Paging](/images/google-paging-example.png)

## Elasticsearch Pitfall

Elasticsearch, like most storage engines, allows for paging a dataset, but there is a catch: **Deep Paging in Distributed Systems**.

As explained on the documentation site of Elasticsearch:

>    To understand why deep paging is problematic, let’s imagine that we are searching within a single index with five primary shards. When we request the first page of results (results 1 to 10), each shard produces its own top 10 results and returns them to the coordinating node, which then sorts all 50 results to select the overall top 10.  
>    Now imagine that we ask for page 1,000—results 10,001 to 10,010. Everything works in the same way except that each shard has to produce its top 10,010 results. The coordinating node then sorts through all 50,050 results and discards 50,040 of them!  
>    You can see that, in a distributed system, the cost of sorting results grows exponentially the deeper we page. There is a good reason that web search engines don’t return more than 1,000 results for any query.  
> -- [Elasticsearch Documentation: Pagination][pagination]

To sum up the problem, The farther a request pages into a dataset, the more data the coordinating node will have to sift through. **The paging request can end in a catastrophic failure for an Elasticsearch cluster.** The issue is a tricky problem, as it only becomes an issue as more data enters the application. A developer is not likely to uncover this during local development as they are not likely to be producing the same amount of data as their production counterparts.

## Solutions

Like all problems, there are solutions. Here are ways I've worked around the issue.

### 1. Improve Search

Improving the search experience is the best thing any developer can do for their users. An application succeeds when a user spends less time sifting through records and find what they want.

### 2. Don't Page Large Datasets

It may be time to address the user experience when your data sees an increase in count. Build an interface or API that allows for retrieving subsets of data in more consumable chunks. Chunk options include but are not limited to:

1. Date Ranges
1. Status of record
1. Significance

Implementing an interface that already has these *"buckets"* predefined can also help formalize a business process that may exist in a select user's mind.

### 3. Summary Information

Users may want all the data because they want to derive some conclusion that can only be derived from the complete dataset. If so, the interface or API should have access to computed summary information. The access to summary information will make for a much nicer experience. Its easy to do with Elasticsearch's [Aggregation][aggregation].

### 4. Paging...To A Point

Paging may still be necessary but to a point. A good example is Google's search results. The search provider allows a user to page up to 10 pages deep, but no further. An application can reflect that limitation in its design.

### 5. Nuclear Option (Don't Do This!)

Elasticsearch will fail any paging request if it hits the `index.max_result_window`.

> Note that from + size can not be more than the index.max_result_window index setting which defaults to 10,000.  
> -- [Elasticsearch Documentation: Limit][limit]

You can always change this to allow for more documents in the `index.max_result_window` but it could have detrimental performance effects on the Elasticsearch cluster and the user experience.

Again, **Don't Do This!**.

![Don't Do This!](https://media0.giphy.com/media/Frj5mE4aGKgjS/giphy.gif?cid=5a38a5a25a22dfc3374d6f596334c4f6)

## Conclusion

Paging large datasets was a necessary evil 10+ years ago, and older relational storage engines let you continue the unfortunate practice of deep paging. As a developer, just because I can do something doesn't mean I should. Re-evaluating paging and realizing that it isn't in the best interest of the user is a fundamental first step. Choosing a better experience for users is harder. Luckily as a developer, I have access to excellent options like Elasticsearch.

*Seriously, keep paging to a minimum. Users will thank you.*

[crud]: https://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[pagination]:https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html
[limit]:https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html
[aggregation]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html