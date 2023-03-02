---
title: "Bulk Import Documents Into Elasticsearch Using NEST"
slug: bulk-import-documents-into-elasticsearch-using-nest
date: 2017-01-11 08:53:45
tags: 
- search
- elasticsearch
categories: 
- development
twitter_text: "bulk import document into @elastic using #NEST #dotnet #search"
authors: 
- Khalid Abuhakmeh
image: https://farm4.staticflickr.com/3669/19727429369_558c5578c8_k_d.jpg
image_url : https://www.flickr.com/photos/salvadru/
image_credit: Salvador Drusin
---

Elasticsearch is a best of breed search platform, but before you can search, you'll need to import your documents. Being a .NET shop, we have adopted [NEST][nest] as our communication mechanism to talk to our Elasticsearch cluster. This post will show you how to take a large set of documents and bulk import them into your Elasticsearch cluster with relative ease.

```csharp
var documents = /* your list of documents */;
var waitHandle = new CountdownEvent(1);

var bulkAll = _elasticClient.BulkAll(documents, b => b
    .Index(indexName) /* index */
    .BackOffRetries(2)
    .BackOffTime("30s")
    .RefreshOnCompleted(true)
    .MaxDegreeOfParallelism(4)
    .Size(1000)
);

bulkAll.Subscribe(new BulkAllObserver(
    onNext: (b) => { Console.Write("."); },
    onError: (e) => { throw e; },
    onCompleted: () => waitHandle.Signal()
));

waitHandle.Wait();
```

There are a few notables things happening in this code:

1. We create a wait handle using a `CountdownEvent`. This will tell our process when all the documents are imported.
2. We have retry logic, in case our initial attempt fails.
3. We call `RefreshOnCompleted`, which tells Elasticsearch to make sure the documents are indexed before giving clients read access.

It really is that simple, and this code is generic enough to be used in any project utilizing NEST and Elasticsearch. Also, reactive for the win!

**Note: We found this code in the [great sample project][sample] written by [Martijn Laarman][mpdreamz].**

[nest]: https://github.com/elastic/elasticsearch-net
[sample]: https://github.com/elastic/elasticsearch-net-example/tree/5.x-codecomplete
[mpdreamz]: https://t.co/hVwjKdHFjC