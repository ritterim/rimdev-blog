---
layout: post
title: "Creating SQL Server Express LocalDb v11, v12, v13, and MSSQLLocalDb Instances"
date: 2017-02-08 10:30:00
tags:
- LocalDb
categories:
- development
twitter_text: "Creating SQL Server Express LocalDb v11, v12, v13, and MSSQLLocalDb Instances"
authors: Ken Dale
---

Here's some copy-pastable commands for creating SQL Server Express LocalDb instances:

- `"C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SqlLocalDB.exe" create "v11.0" 11.0 -s`
- `"C:\Program Files\Microsoft SQL Server\120\Tools\Binn\SqlLocalDB.exe" create "v12.0" 12.0 -s`
- `"C:\Program Files\Microsoft SQL Server\130\Tools\Binn\SqlLocalDB.exe" create "v13.0" 13.0 -s`

You may also want to create a `MSSQLLocalDb` instance:

- `"C:\Program Files\Microsoft SQL Server\130\Tools\Binn\SqlLocalDB.exe" create "MSSQLLocalDb" -s` *(omitting the version number defaults to the latest version)*

## Test it out

To test a LocalDb instance connect to `(localdb)\v13.0` using SQL Server Management Studio or a similar tool, modifying as necessary to match the instance name.

## Credit

Credit to [http://www.khalidabuhakmeh.com/initializing-localdb-v12-0-even-after-installing-sql-express-2014](http://www.khalidabuhakmeh.com/initializing-localdb-v12-0-even-after-installing-sql-express-2014) for the strategy.
