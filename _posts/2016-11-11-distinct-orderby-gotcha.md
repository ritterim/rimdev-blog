---
layout: post
title: "OrderBy Distinct Gotcha"
date: 2016-11-11 09:53:43
tags: 
- Linq
- .NET
categories: Development
twitter_text: "OrderBy Distinct Gotcha"
authors: Chad Peters
image: https://c2.staticflickr.com/9/8146/7127935057_2d9bf9c1b8_k.jpg
image_url: https://www.flickr.com/photos/khawkins04/
image_credit: Ken Hawkins
---
The boss called me over the other day to consult on an issue we were having with a result set not sorting as expected. We quickly found the code producing the results and it was relatively straight forward:
```csharp
var query = (from plan in _context.PlanTable
             from benefit in plan.BenefitTable
             where plan.PlanId == request.PlanId
             select new PlanBenefitsResult
             {
                Id = benefit.BenefitId,
                PlanId = plan.PlanId,
                Benefit = benefit.Benefit,
                SentencesSortOrder = benefit.SentencesSortOrder,
             })
             .OrderBy(x => x.SentencesSortOrder)
             .Distinct();
```
### The Problem
We dropped a break point on the code and examined the results. `SentencesSortOrder` values of 0 were displaying at the end of the result set! I examined the data in the database and the result set was in the same order as the records in the database. I added an `Order By SentencesSortOrder` to the query and, as expected, values of 0 were now first in the SQL query result.

We briefly threw around a few theories about why our results in the code were not being ordered, and the boss wondered aloud if Distinct() was messing with the OrderBy. A quick google search confirmed that theory. 

In short, the expected behavior of the IQueryable Distinct operator is that it returns an _unordered_ sequence of unique items. When implemented in LinqToSql, this means that OrderBy will be ignored when it is followed by Distinct because it can't guarantee that your results will still be ordered as you specified.

### The Solution
The solution then is simple:
```csharp
var query = (from plan in _context.PlanTable
             from benefit in plan.BenefitTable
             where plan.PlanId == request.PlanId
             select new PlanBenefitsResult
             {
                Id = benefit.BenefitId,
                PlanId = plan.PlanId,
                Benefit = benefit.Benefit,
                SentencesSortOrder = benefit.SentencesSortOrder,
             })
             .Distinct() //Distinct must preceed OrderBy
             .OrderBy(x => x.SentencesSortOrder);
```

## Conclusion
Be careful when using `Distinct()` and `OrderBy()` on IQueryables. If you don't specify them in the correct order you may not get the results you expect.
