---
title: "Namespace changes with Entity Framework 6 migrations"
slug: namespace-changes-with-ef-migrations
date: 2016-04-29 8:00:00
tags:
- EF
- .NET
image: /images/namespace-changes-with-ef-migrations/ducks-flying.jpg
image_url: https://www.flickr.com/photos/gidzy/10569823385/
image_credit: Gidzy
categories:
- Development
twitter_text: "Namespace changes with #entityframework 6 migrations"
authors: Bill Boga
---

*This post originally appears on [https://www.billboga.com/posts/namespace-changes-with-entity-framework-migrations](https://www.billboga.com/posts/namespace-changes-with-entity-framework-migrations).*

**Note: this is only applicable for EF versions less than or equal to six. Version seven (part of .NET Core) has a completely different migration strategy.**

[EF code-first migrations](https://msdn.microsoft.com/en-us/data/jj591621.aspx) are an easy way to keep your domain models and database schemas synchronized. However, if you ever decide to refactor your migration namespace, then remember this piece of wisdom: *the migration history table stores migration-file namespaces as a column-value*. For a quick refresher, here is the schema and sample dataset:

![EF migrations database schema](/images/namespace-changes-with-ef-migrations/ef-migrations-schema.png)

---

![EF migrations sample dataset](/images/namespace-changes-with-ef-migrations/ef-migrations-data.png)

---

For our sample, assume the pictured migration-file created a new table called `Cars`. Further, let us assume I refactor the namespace in the migration-file to `Better.Namespace.Migrations`. When I run the app., the following exception is thrown:

> SqlException: There is already an object named 'Cars' in the database.

This is due, in part, to the migration runner looking in the history table and trying to match `MigrationId` and `ContextKey` with migration filenames and namespaces. It cannot find a match, so it thinks it needs to run our refactored file again. To fix this problem, we just need to update `ContextKey` for the `MigrationId` row matching our migration filename:

```sql
update [__MigrationHistory] set [ContextKey] = 'Better.Namespace.Migrations' where [MigrationId] = '201408121529377_initial_migration';
```

Restart the app. and we are back in business.
