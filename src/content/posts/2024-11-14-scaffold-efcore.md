---
title: Reverse Engineering your Database into your ASP.NET Core Project
slug: reverse-engineering-efcore-dotnetcore
date: 2024-11-14 13:00:00
tags:
- ASP.NET Core
- C#
- Entity Framework Core
categories:
- ASP.NET Core
- C#
- Entity Framework Core
authors: 
- Chad Peters
twitter_text: "How do I get my database schema into my code?"
---

I've started a brand new ASP.NET Core project that will read data from an existing SQL Server database. I am completely unfamiliar with this very large database schema. I remarked to a collegue that it seems like there should be a way to automagically create the entity classes and database context in my WebAPI project. He said "There is..." while giving me the let-me-google-that-for-you stare.

🎉🎉 [Scaffolding aka Reverse Engineering](https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/) 🎉🎉

> I am working with Microsoft SQL Server and the Ef Core packages scaffold the code in C#. However, you can do this for other database providers and there are plugins for other languages. 

Scaffolding is fairly simple, but very powerful. In my project I installed the following packages:

Microsoft.EntityFrameworkCore
Microsoft.EntityFrameworkCore.SqlServer
Microsoft.EntityFrameworkCore.Design
Microsoft.EntityFrameworkCore.Tools

The documentation doesn't say you have to install the Tools package, but I found it just wouldn't work without it. 

You can run the Scaffold commands in the .NET Core CLI or in the Package Manager Console. Here is the command I ran in the PMC:

`Scaffold-DbContext 'Name=ConnectionStrings:Default' Microsoft.EntityFrameworkCore.SqlServer`

The only required required arguments are the connection string to the database, and the EF Core database provider to use. There are different ways you can specify the connection string to your database. You can also add flags to the command to get different behaviours. You can read about these in the [documentation.](https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/) You can also read about the different strategies to keep your entity classes and DBContext up to date. 

This not only kept me from having to type out all my entity classes and DBContext manually, but it also gave me a lot of insight into how the database was structured. You see all the keys, foreign keys, and the relationships between the tables. I was also able to see the Column Properties, like Description="Obsolete", that I might have missed just looking at my database in SSMS. 

The next time you need to work with an existing database in your project keep Scaffolding in mind 💡
