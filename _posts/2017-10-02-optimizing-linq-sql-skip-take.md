---
layout: post
title: "Optimizing LINQ to SQL Skip/Take"
date: 2017-10-02 14:00:00
tags:
- .NET
- SQL Server
- LINQ
twitter_text: "Optimizing #LINQ to SQL Skip/Take"
authors: Bill Boga
image: https://farm5.staticflickr.com/4043/4569418430_6421dc032b_b.jpg
image_url: https://www.flickr.com/photos/lychee1968/4569418430/
image_credit: lychee1968
---

Picture a scenario where you want to page a large dataset and your LINQ statement has several `Include`-calls. The first few pages load fairly quickly, but the deeper you get into the results, the slower each page loads. You refactor the query, but still have longer wait-times the further down you go in the results. As a last-ditch effort, you decide to increase resources to your DB-server and call it a day. Things may have improved a bit, but as the dataset grows, so do your wait times. And, the cycle continues...

## Understanding how SQL executes the statement

Given a LINQ statement like:

```csharp
context.Cars
  .OrderBy(x => x.Id)
  .Skip(50000)
  .Take(1000)
  .ToList();
```

This roughly gets translated into:

```sql
select * from [Cars] order by [Cars].[Id] asc offset 50000 rows fetch next 1000 rows only;
```

Because `offset` and `fetch` are [extensions](https://technet.microsoft.com/en-us/library/gg699618(v=sql.110).aspx) of `order by`, they are **not** executed until **after** the `select`-portion runs ([google](https://www.google.com/search?q=mssql+execution+order)). This means an expensive `select` with lots of `join`-statements are executed on the whole dataset (`[Cars]`) prior to getting the fetched-results.

## How to optimize the statement

All that is needed is taking the `OrderBy`, `Skip`, and `Take` statements and putting them into a `Where`-clause:

```csharp
context.Cars
  .Where(x => context.Cars.OrderBy(y => y.Id).Select(y => y.Id).Skip(50000).Take(1000).Contains(x.Id))
  .ToList();
```

This roughly gets translated into:

```sql
exec sp_executesql N'
select * from [Cars]
where exists
  (select 1 from
    (select [Cars].[Id] from [Cars] order by [Cars].[Id] asc offset @p__linq__0 rows fetch next @p__linq__1 rows only
    ) as [Limit1]
    where [Limit1].[Id] = [Cars].[Id]
  )
order by [Cars].[Id] asc',N'@p__linq__0 int,@p__linq__1 int',@p__linq__0=50000,@p__linq__1=1000
```

So now, the outer `select`-statement only executes on the filtered dataset based on the `where exists`-clause!

Again, your mileage may vary on how much query time is saved by making the change. General rule of thumb is the more complex your `select`-statement and the deeper into the dataset you want to go, the more this optimization will help.
