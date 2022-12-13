---
layout: ../layouts/Post.astro
title: "Elasticsearch With NEST Using C# nameof Not Working"
date: 2020-04-20 13:00:00
tags:
- .NET
categories:
- development
twitter_text: "Elasticsearch With NEST Using C# nameof Not Working"
authors: Ken Dale
image: https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/afW1hht0NSs
image_credit: Markus Winkler
---

Imagine you're using Elasticsearch with your strongly typed C# models and `nameof(MyProperty)` and wondering why it doesn't work. Turns out, Elasticsearch with NEST by default translates `MyProperty` to `myProperty` (initial lowercase, as one would expect from JSON conventionally).

This behavior can be adjusted though if you'd prefer to not transform the property name, which also enables `nameof(MyProperty)` to be used.

See the following examples, they both *work*. Note the difference in character case and whether `DefaultFieldNameInferrer(x => x)` is applied:

```csharp
var elasticClient = new ElasticClient(
    new ConnectionSettings(elasticSearch.Url)
);

var results = await elasticClient.SearchAsync<Person>(s => s
    .Index(TestIndex)
    .Query(
        y => y.MultiMatch(
            mm => mm.Query("test")
                    .Fields(f => f.Field("givenName")))));
```

Setting `DefaultFieldNameInferrer(x => x)` allows use of `nameof`:

```csharp
var elasticClient = new ElasticClient(
    new ConnectionSettings(elasticSearch.Url)
        // https://github.com/elastic/elasticsearch-net/issues/1528#issuecomment-134221775
        .DefaultFieldNameInferrer(x => x)
);

var results = await elasticClient.SearchAsync<Person>(s => s
    .Index(TestIndex)
    .Query(
        y => y.MultiMatch(
            mm => mm.Query("test")
                    .Fields(f => f.Field(nameof(Person.GivenName))))));
```

Full code is available here: [https://github.com/kendaleiv/ElasticsearchPropertiesCase](https://github.com/kendaleiv/ElasticsearchPropertiesCase) -> [https://github.com/kendaleiv/ElasticsearchPropertiesCase/blob/master/Tests.cs](https://github.com/kendaleiv/ElasticsearchPropertiesCase/blob/master/Tests.cs).

Hope this helps in some way!
