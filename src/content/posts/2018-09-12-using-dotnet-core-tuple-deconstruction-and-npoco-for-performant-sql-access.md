---
layout: post
title: "Using .NET Core, Tuple Deconstruction, and NPoco For Performant SQL Access"
date: 2018-09-12 11:05:12
tags: 
- .net core
- sql
categories:
- .net core
- sql
twitter_text: "Using @dotnet Core, Tuple Deconstruction, and #NPoco For Performant #SQL Access"
authors: Khalid Abuhakmeh
image: https://farm8.staticflickr.com/7434/11242864913_9ed52d3d0e_k_d.jpg
image_url: https://www.flickr.com/photos/cost3l/
image_credit: Costel Slincu
---

Regardless of your opinion on Object Relational Mappers (ORM), I think they are a great tool for prototyping ideas. Over time, they can lead to lackluster performance as your application's ideas begin to cement. Replacing an ORM with a Micro-ORM is a great way to regain some performance. In this post, I'll show you how to fetch multiple SQL results using NPoco while keeping your code concise.

## Dependencies

This example is Using PostgreSQL, .NET Core, and NPoco. You are welcome to use any database that NPoco supports, including SQL Server.

## The Problem

Entity Framework is the ORM we use, and to get multiple collections we have several options:

- Select them in the same query (resulting in a join)
- Use a third party library / extension to do multiple result sets.
- Make multiple queries.

These options work, but sometimes you just want to run the query you want.

## The Solution

Below, we are using the `FetchMultiple` method in NPoco to execute multiple SQL queries over a single connection. The method returns a `Tuple<T1,T2>`. We can use Tuple deconstruction to map those result sets into variables.

```csharp
using System;
using NPoco;
using ConsoleTables;

namespace NpocoExample
{
    class Program
    {
        static void Main(string[] args)
        {
            var factory = Npgsql.NpgsqlFactory.Instance;

            var database =
                new Database(
                    "host=localhost;user id=admin;password=admin;database=postgres", 
                    DatabaseType.PostgreSQL,
                    factory
                );

            using (var connection = database.OpenSharedConnection())
            {
                var (friends, family) =
                connection.FetchMultiple<Friend,Family>(
                    @"select * from public.Friends fetch first 10 rows only;
                      select * from public.Family fetch first 10 rows only;"
                );

                ConsoleTable
                    .From<Friend>(friends)
                    .Write(Format.Alternative);

                ConsoleTable
                    .From<Family>(family)
                    .Write(Format.Alternative);
            }
        }
    }

    public class Friend {
        public int Id {get;set;}
        public string Name {get;set;}
    }

    public class Family {
        public int Id {get;set;}
        public string Name {get;set;}
    }
}
```

## Result

After executing the code above, we see our result sets in the console output. Both queries were efficiently executed without the need to do expensive expression compilation, object tracking, or database joins. I'd call that a win!

```console
+----+---------+
| Id | Name    |
+----+---------+
| 1  | Lavinia |
+----+---------+
| 2  | Lavinia |
+----+---------+
| 3  | Rhea    |
+----+---------+
| 4  | Alfreda |
+----+---------+
| 5  | Justina |
+----+---------+
| 6  | Imani   |
+----+---------+
| 7  | Yvette  |
+----+---------+
| 8  | Mira    |
+----+---------+
| 9  | Bevis   |
+----+---------+
| 10 | Doris   |
+----+---------+

+----+---------+
| Id | Name    |
+----+---------+
| 1  | Rhona   |
+----+---------+
| 2  | Phoebe  |
+----+---------+
| 3  | Colton  |
+----+---------+
| 4  | Malachi |
+----+---------+
| 5  | Olympia |
+----+---------+
| 6  | Noble   |
+----+---------+
| 7  | Rebecca |
+----+---------+
| 8  | Amal    |
+----+---------+
| 9  | Ulric   |
+----+---------+
| 10 | Noble   |
+----+---------+
```

## Conclusion

NPoco is one of the best Micro-ORMs and with the addition of Tuple deconstruction we get a much nicer development experience.