---
layout: post
title: "Working With Nested Aggregates Using NEST and Elasticsearch"
date: 2018-10-03 11:51:38
tags:
- Elasticsearch
- NEST
- C#
categories:
- Elasticsearch
- NEST
- C#
twitter_text: "Working With Nested Aggregates Using #NEST and @elastic"
authors: Khalid Abuhakmeh
image: https://farm5.staticflickr.com/4103/5197253773_12cabba4b4_b_d.jpg
image_url: https://www.flickr.com/photos/warrick/
image_credit: Warrick Wynne
---

We love the combination of SQL and Elasticsearch and believe it is a winning combination for anyone building a modern application. Elasticsearch has enabled us to provide user experiences that were once difficult or too slow for our users utilizing traditional relational databases. In this post, you can see how we utilize nested aggregates in Elasticsearch to provide a quick breakdown for our users.

## What Are Aggregates?

Aggregates are a way to categorize existing data into groups. If you are familiar with SQL, then you'll be familiar with the `group by` clause. Aggregates in NEST are a turbo powered version of the same idea. Read more about aggregates [here][aggregates]. In this post, I'll show how to create and access nested aggregates utilizing NEST.

## Sample Data

The sample data we'll be using the accounts dataset found on [elastic.co][tutorial]. We'll be trying to answer the following question. 

To get the aggregations working, we'll need to create an index mapping first. The mapping sets the employer and gender fields to `keywords`. The mapping allows us to aggregate correctly since analyzed fields cannot be part of an aggregation.

```javascript
PUT bank
{
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "account": {
      "properties": {
        "employer": {
          "type": "keyword"
        },
        "gender" : {
          "type" : "keyword"
        },
        "*" : {
          "type" : "text"
        }
      }
    }
  }
}
```

After creating the index follow the curl instructions, and you should end up with a populated index named `bank`.

> What is the total number of employees for each employer, and what is the gender breakdown within each employer?

## Elasticsearch Query

Let's start by first crafting our Elasticsearch query in Kibana. I am limiting the search to one employer. Our query looks like this.

```javascript
GET bank/_search
{
  "size": 0,
  "aggs": {
    "employers": {
      "terms": {
        "field": "employer",
        "size": 1
      },
      "aggs": {
        "genders": {
          "terms": {
            "field": "gender"
          }
        }
      }
    }
  }
}
```

As you can see, we utilize two term queries. The parent aggregation is on `employer` while the nested aggregation is on `gender`. The result looks something like this.

```javascript
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1000,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "employers": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 998,
      "buckets": [
        {
          "key": "Xurban",
          "doc_count": 2,
          "genders": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "F",
                "doc_count": 1
              },
              {
                "key": "M",
                "doc_count": 1
              }
            ]
          }
        }
      ]
    }
  }
}
```

A 50/50 split company! To be honest, this data set is less interesting since most companies have the breakdown of one `Male` and one `Female`. I suggest you edit the `accounts.json` file to get more interesting data. Be aware the ids in the file are not-sequential, and I recommend if you are going to add more data that you select a higher id number i.e. `2000+`.

## NEST and Aggregates

We need to translate our Elasticsearch query from JSON into the NEST format. Lucky for us, the NEST API mimics the JSON structure almost identically.

```csharp
var query =
client.Search<Account>(q => q
    .Size(0)
    .Aggregations(agg => agg.Terms(
        "employers", e => 
            e.Field("employer")                        
                .Aggregations(child => child.Terms("genders", g => g.Field("gender")))
        )
    )
);
```

Now to access the data.

```csharp
/* access the parent aggregate */
var results = query
    .Aggregations
    .Terms("employers")
    .Buckets
    .Select(e => new {
        e.Key,
        count = e.DocCount, /* total employees */
        genders = e
            .Terms("genders")
            .Buckets.Select(g => new {
                gender = g.Key,
                count = g.DocCount /* total gender */
            })
            .ToList()
    }).ToList()
;
```

Note, that nested aggregates are in `buckets`. Each parent `employer` aggregate has nested buckets of `gender`. As you can see in this screenshot, we are getting our data.

![elasticsearch nested aggregates result]({{ "/images/elasticsearch-nest-aggregates-nested.png" | absolute_url }}){: .img-fluid .border }

Below is the full sample I ran.

```csharp
using System;
using System.Linq;
using Nest;

namespace nest_aggs
{
    class Program
    {
        static void Main(string[] args)
        {
            var settings = new ConnectionSettings(new Uri("http://localhost:9200"))
                .DefaultIndex("bank");
            var client = new ElasticClient(settings);

            var query =
            client.Search<Account>(q => q
                .Size(0)
                .Aggregations(agg => agg.Terms(
                    "employers", e => 
                        e.Field("employer")                        
                            .Aggregations(child => child.Terms("genders", g => g.Field("gender")))
                    )
                )
            );

            /* access the parent aggregate */
            var results = query
                .Aggregations
                .Terms("employers")
                .Buckets
                .Select(e => new {
                    e.Key,
                    count = e.DocCount, /* total employees */
                    genders = e
                        .Terms("genders")
                        .Buckets.Select(g => new {
                            gender = g.Key,
                            count = g.DocCount
                        })
                        .ToList()
                }).ToList()
            ;

            Console.ReadLine();
        }
    }

    public class Account {
        public string Gender {get;set;}
    }
}
```

## Conclusion

Nested aggregates are an excellent tool that can help build some amazing experiences for your users. Not only is it powerful, but it is fast, but I've grown to expect nothing less from Elasticsearch. I hope you found this post helpful, and if you did, please share it.

[aggregates]: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html
[tutorial]: https://www.elastic.co/guide/en/kibana/current/tutorial-load-dataset.html