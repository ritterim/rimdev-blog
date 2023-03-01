---
title: Beware NPoco's InsertBulk and the underlying SqlBulkCopy's case-sensitivity
slug: beware-sqlbulkcopy-case-sensitivity
date: 2019-01-04 12:00:00
tags:
- NPoco
- SqlBulkCopy
categories:
- development
twitter_text: "Beware NPoco's InsertBulk and the underlying SqlBulkCopy's case-sensitivity"
authors: 
- Bill Boga
image: https://farm3.staticflickr.com/2169/3539963093_7b9f4a0d1a_b.jpg
image_url: https://flic.kr/p/6oPeGr
image_credit: Angus Fok
---

![Image mashup from the movie "Speed" with captionL "Pop quiz hotshot! SqlBulkCopy throws an exception related to columnmapping... What do you do?"](https://i.imgflip.com/2qdhhu.jpg)

## TL;DR

Explicitly using `SqlBulkCopy` might never cause this problem since mapping is done manually, but NPoco's usage does automatic mapping which might cause a problem. However, it's easily fixable.

## I still don't grok the problem

[System.Data.SqlClient.SqlBulkCopy](https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlbulkcopy?view=netcore-2.2) lets you efficiently bulk-load data into a DB-table. It requires you to create a [System.Data.DataTable](https://docs.microsoft.com/en-us/dotnet/api/system.data.datatable?view=netcore-2.2) to provide columns and rows of data. However, the columns are **case-sensitive** to their DB-neighbor. If there is a mismatch anywhere in the DataTable, you'll receive this exception (with possibly similar stack trace):

```
"The given ColumnMapping does not match up with any column in the source or destination."

at System.Data.SqlClient.SqlBulkCopy.AnalyzeTargetAndCreateUpdateBulkCommand(BulkCopySimpleResultSet internalResults)
at System.Data.SqlClient.SqlBulkCopy.WriteToServerInternalRestContinuedAsync(BulkCopySimpleResultSet internalResults, CancellationToken cts, TaskCompletionSource`1 source)
at System.Data.SqlClient.SqlBulkCopy.WriteToServerInternalRestAsync(CancellationToken cts, TaskCompletionSource`1 source)
at System.Data.SqlClient.SqlBulkCopy.WriteToServerInternalAsync(CancellationToken ctoken)
at System.Data.SqlClient.SqlBulkCopy.WriteRowSourceToServerAsync(Int32 columnCount, CancellationToken ctoken)
at System.Data.SqlClient.SqlBulkCopy.WriteToServer(DataTable table, DataRowState rowState)
```

Ref. [SqlBulkCopy.cs#L706](https://github.com/dotnet/corefx/blob/e0ba7aa8026280ee3571179cc06431baf1dfaaac/src/System.Data.SqlClient/src/System/Data/SqlClient/SqlBulkCopy.cs#L706) for the spot where the exception gets thrown.

Unfortunately, it's not very descriptive since you don't know which part of the mapping is incorrect. Here's an example that would trigger this exception:

```sql
create table [Developers](
    [name] nvarchar(50) null
);
```

```csharp
var dataTable = new DataTable();

dataTable.Columns.Add("Name");

dataTable.Rows.Add("Bill");

using (var sqlBulkCopy = new SqlBulkCopy(connectionString))
{
    sqlBulkCopy.DestinationTableName = "Developers";
    sqlBulkCopy.WriteToServer(dataTable); //Exception will get thrown here.
}
```

And, here is the line I believe sets-up the exception: [SqlBulkCopy.cs#L568](https://github.com/dotnet/corefx/blob/e0ba7aa8026280ee3571179cc06431baf1dfaaac/src/System.Data.SqlClient/src/System/Data/SqlClient/SqlBulkCopy.cs#L568)... *it's a direct string comparison*. Originally, I was pretty quick to code a PR and 🤞, but gave secondary thought to maybe it's this way because case-insensitivity is not a given (even though it's common in modern SQL Server instances). Plus, there's a workaround...

*Direct matches increments an internal counter which is later used to determine if all the mapped-columns are found. If the count does not match mapped-columns, then `Exception`.*

## The Workaround

`SqlBulkCopy` provides a way to map source columns to what's in the DB:

```csharp
sqlBulkCopy.ColumnMappings.Add("Name", "name");
// sqlBulk.WriteToServer(dataTable);
// ...
```

### How does NPoco fit into the story?

NPoco provides an `IDatabase.InsertBulk` method which takes care of all this low-level code. However, by itself, will still generate the exception assuming the name-casing does not match. But, NPoco provides a `Column`-attribute which allows specifying the column-name:

```csharp
[TableName("Developers")]
public class Developer
{
    [Column(Name = "name")]
    public string Name { get; set; }
}

// ...

using (var database = new Database(connectionStringName))
{
    database.InsertBulk(new[]
    {
        new Developer() { Name = "Bill" }
    });
}
```

Ref. [NPoco's SqlBulkCopyHelper.cs](https://github.com/schotime/NPoco/blob/8af5466db4f4513987767c6516d3be949d44fda7/src/NPoco/SqlBulkCopyHelper.cs)