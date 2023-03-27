---
title: "Leveling Up Your Project Testing with tSQLt Unit Tests for SQL Queries"
slug: leveling-up-your-project-testing-with-tSQLt-unit-tests-for-sql-queries
date: 2023-03-27
tags:
- .NET
- SQL
- tSQLt
- Unit Tests
categories:
- tSQLt
twitter_text: "Leveling Up Your Project Testing with tSQLt Unit Tests for SQL Queries"
authors: 
- Cheng Yang
image: https://images.unsplash.com/photo-1576444356170-66073046b1bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
image_url: https://unsplash.com/photos/EWLHA4T-mso
image_credit: Ferenc Almas
---

I am writing this blog post to share a cool unit testing tool that I learned about at the VS Live conference in Vegas. While many developers build tests for their code to make sure it is functioning as intended, fewer developers test their database queries. Testing your code and your database queries are equally vital to make sure your queries are working as intended and producing the expected results. In this blog article, I'll demonstrate how to use tSQLt, a unit testing framework for SQL Server, to create tests for your SQL Server database queries.

### Step 1: Install tSQLt
Go to the official website [tSQLt](https://tsqlt.org/downloads/) to download and set up tSQLt. Once the installation zipfile has been downloaded, unzip it to a spot on your hard drive, and then run the `PrepareServer.sql` file. 
<figure>
<img src="/images/tsqlt/query1.png" style="max-width: 100%">
</figure>

Next, Run the `tSQLt.class.sql` script to install the tSQLt framework in your SQL Server database.

<figure>
<img src="/images/tsqlt/query2.png" style="max-width: 100%">
</figure>

### Step 2: Create a test database
For your unit tests, you will need to set up a test database. Only the objects and information required for testing will be in this database, which will be distinct from your production database. Run the following query in SQL Server Management Studio to create the test database.

```csharp
CREATE DATABASE [tSQLtTestDB];
GO
```

### Step 3: Create a test schema
Once you've created your test database, you will need to create a schema specifically for your tests.

```csharp
USE [tSQLtTestDB];
GO

CREATE SCHEMA [Tests];
GO
```

### Step 4: Write your first test
We will need to create a test class first, According to [tSQLt](https://tsqlt.org/user-guide/test-creation-and-execution/newtestclass/)
"tSQLt.NewTestClass creates a new test class. A test class is simply a schema where the user can create test case procedure and any other related objects."

```cSharp
EXEC tSQLt.NewTestClass 'TestDatabaseQueries';
GO
```

In this example database query, we will create a temporary table #Fruit and inserting two rows of data - one for apples and one for oranges. The test case FruitTests verifies if the number of apples and oranges in the table matches the expected values.

```csharp
USE [tSQLtTestDB];
GO

CREATE PROCEDURE TestDatabaseQueries.[test if fruit returns expected result]
AS
BEGIN
    CREATE TABLE #Fruit (FruitName VARCHAR(50), Quantity INT)
    INSERT INTO #Fruit VALUES ('Apple', 10), ('Orange', 5)

    DECLARE @AppleCount INT
    DECLARE @OrangeCount INT
    SELECT @AppleCount = SUM(Quantity) FROM #Fruit WHERE FruitName = 'Apple'
    SELECT @OrangeCount = SUM(Quantity) FROM #Fruit WHERE FruitName = 'Orange'

    -- line 80 will throw error
    EXEC tSQLt.AssertEquals @expected = 22, @actual = @AppleCount
    EXEC tSQLt.AssertEquals @expected = 5, @actual = @OrangeCount

    DROP TABLE #Fruit
END
GO

```

In this test, we're using the tSQLt.AssertEquals procedure to check that if the query returns the expected number of AppleCount or OrangeCount.

### Step 5: Run your tests
Once you've written your test, you can run it using the tSQLt.Run procedure. You can run all of your tests at once by running the following command:

```csharp
EXEC tSQLt.RunAll;
```

Or, you can run an individual test by specifying the test name:

```csharp
EXEC tSQLt.Run 'TestDatabaseQueries.[test if fruit returns expected result]';
```

Here is the result: 

<figure>
<img src="/images/tsqlt/query1.png" style="max-width: 100%">
</figure>


Finally, testing your database queries is crucial, just like testing your code. You can be sure that your SQL Server database queries are functioning as expected and delivering accurate results by creating and running tests for them using tSQLt.




