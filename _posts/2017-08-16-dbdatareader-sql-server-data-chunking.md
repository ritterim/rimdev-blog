---
layout: post
title: "DbDataReader and SQL Server Data Chunking"
date: 2017-08-16 08:00:00
tags:
- .NET
- .NET Core 2.0
- JSON
- XML
- SQL Server
twitter_text: "DbDataReader and #SQLServer data chunking"
authors: Bill Boga
image: https://farm9.staticflickr.com/8597/15833140891_1dc8d7f5aa_k.jpg
image_url: https://www.flickr.com/photos/vitreolum/15833140891/
image_credit: vitreolum
---

## TL;DR

Using `ExecuteReader` against SQL Server with a query using `for xml` or `for json` causes data to be chunked. A single call to `ExecuteReader.Read()` will not return the expected data (for anything larger than 2,033-characters). A solution is to loop the reader until `ExecuteReader.Read()` returns `false` and append each call's result to a `List`, `StringBuilder`, or other preferred container. Alternatively, wrap the original SQL query in a `select`-statement. For more information on the problem, reference this [Microsoft Support](https://support.microsoft.com/en-us/help/310378/the-xml-data-row-is-truncated-at-2-033-characters-when-you-use-the-sql) entry.

## How we encountered this problem

Within RIMdev, some of our API responses were taking more than a second. This was mostly due to the amount of joined-tables needed to query the necessary data. However, trying to do this with EF just adds overhead–which will only increase as our datasets increase. So, we turned to our DBA who showed us SQL Server's JSON capabilities. A query was constructed to give us the necessary fields and wrapped in a call ending with `for json path, without_array_wrapper` (more info. [here](https://docs.microsoft.com/en-us/sql/relational-databases/json/format-query-results-as-json-with-for-json-sql-server)). We initially tried throwing the executed query's result right to `JsonConvert.Deserialize`, but kept getting `JsonReader` exceptions. We added a break-point and discovered our data was truncated. But, running the same query in SSMS gave us the expected result. So, we setup an experiment to loop the reader and append each iteration's result into a list. When we looked at the final list, we saw multiple entries, and when combined, gave us the expected value.

## What causes this?

Don't know. I have looked at .NET-related code available on GitHub (i.e. [SqlDataReader](https://github.com/dotnet/corefx/blob/83b606b5debad20536a581c425f66f4e9c396ed1/src/System.Data.SqlClient/src/System/Data/SqlClient/SqlDataReader.cs)) and found nothing. I'm thinking it's SQL Server which does something different for remote calls.

## Example

```csharp
using (var command = context.Database.GetDbConnection().CreateCommand())
{
    // Assume our Widgets table has thousands of records...
    command.CommandText = "select top 1 widgets = (select * from widgets for json path) from widgets for json path, without_array_wrapper;";
    command.Connection.Open();

    using (var reader = command.ExecuteReader())
    {
        if (reader.HasRows)
        {
            var results = new List<string>();

            while (reader.Read())
            {
                results.Add(reader.GetString(0));
            }

            var json = string.Join(string.Empty, results);

            var response = JsonConvert.Deserialize<object>(json);
        }
    }
}
```

## More examples

A full-featured .NET Core 2.0 sample can be found [here](https://github.com/billbogaiv/sql-server-chunk-tests).
