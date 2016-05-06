---
layout: post
title: "Displaying Progress for Long Running Processes"
date: 2016-04-27 08:00:00
tags:
- Progress
image:
    src: https://c6.staticflickr.com/3/2130/5771388485_7e2e003dc2_b.jpg
    url: https://www.flickr.com/photos/runnever/5771388485
    credit: Denise P.S.
categories:
- Development
twitter_text: "Displaying Progress for Long Running Processes"
authors: Ken Dale
---

As developers, sometimes it's necessary to write a console application or script that takes hours (or, days!) to run. Perhaps you need to update *all the data*. Or, you need to use CSV files to update data in a system. Or, maybe you are performing a data migration of an existing in-production application. Fill in the blank for *your* long running task.

**One problem you can encounter here is no indication of overall progress.** If it's a long running task, you may be asked *"how long will it take?"*. Or, you may wonder to yourself *"will the script finish by the end of the day?"*.

In situations with long running tasks you could be torn between *terminate and optimize* or *let it run to completion*. This decision can be tricky if there's no progress indication to gauge which action to take. Or, worse -- it could be a tense situation and you don't have an estimate to resolve a critical problem!

## Howto

In a situation where you know the full count of items, consider prefixing console output with that information.

For example, the console output might look like:

```
[123 / 12345] Processing order: 1234567 ...
[124 / 12345] Processing order: 2345678 ...
[125 / 12345] Processing order: 3456789 ...
```

This strategy doesn't provide a time estimate, but can help formulate an *at-a-glance* estimate.

## Examples

In C#, it could look like this:

```csharp
var ordersCount = orders.Count();
for (var i = 0; i < ordersCount; i++)
{
    var order = orders[i];

    Console.WriteLine($"[{i + 1}/{ordersCount}] Processing order: {order.id} ...");

    ProcessOrder(order);
}

//
// or
//

var orderIndex = 0;
var ordersCount = orders.Count();
foreach (var order in orders)
{
    Console.WriteLine($"[{orderIndex + 1}/{ordersCount}] Processing order: {order.id} ...");

    ProcessOrder(order);

    orderIndex++;
}

// or, another option: http://stackoverflow.com/a/4337706
```

Using ES2015 JavaScript, it could look like:

```javascript
const ordersCount = orders.length;
orders.forEach((order, index) => {
  console.log(`[${index + 1}/${ordersCount}] Processing order: ${order.id} ...`);

  processOrder(order);

  // Note: processOrder(order) here should probably be synchronous / blocking.
  // If it's a method that takes a callback and/or returns a promise
  // (rather than running in a synchronous / blocking fashion)
  // we may need to some additional work here
  // to prevent the items from running 'all at once'.
});
```

## Wrapup

Providing a simple progress indication is important for long running processses. It doesn't *need* to have a time estimate associated with it -- simply being able to ballpark guess at-a-glance based on visible output can be helpful. It might even save you in a tense situation!
