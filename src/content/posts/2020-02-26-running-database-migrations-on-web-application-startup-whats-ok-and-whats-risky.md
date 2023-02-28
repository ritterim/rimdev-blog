---
layout: post
title: "Running Database Migrations On Web Application Startup: What's OK and What's Risky"
date: 2020-02-26 14:00:00
tags:
- SQL
categories:
- development
twitter_text: "Running Database Migrations On Web Application Startup: What's OK and What's Risky"
authors: Ken Dale
image: https://images.unsplash.com/photo-1470645792662-dd18394f8c97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/Esq0ovRY-Zs
image_credit: Maximilian Weisbecker
---

We run a number of web applications at Ritter Insurance Marketing. Our primary datastore for these applications is MSSQL / SQL Azure. Our deployments are brought online by swapping code from staging to production, which happens fast.

Sometimes, the latest version of an application requires some database changes to be made as it's rolled out.

## What's OK

- **Schema changes**: Changes that add, modify, and delete database tables run quickly. We choose to write defensive migrations that check if the result of it has been already applied ahead of the migration (in case we needed to load data ahead of time, apply expensive indexes, etc.).

## What's risky

- **Creating indexes** and **modifying data**: These operations, depending on the size of the database tables being used, have the potential to dramatically increase startup time.  The web application cannot safely begin to operate until the migrations have been ran to bring the database up to support the current application version.

Even with swapping staging to production for instantaneous deployments, the database migrations must run when code is swapped into production. And, it can't run them before then, as it could break the version of the code being replaced.

## Summary

The main issue is **time spent in startup running database migrations**. If running migrations delays the startup of the application significantly we may feel like there's an outage.

It's important to remember that testing locally versus in the cloud can be quite different. The cloud database could have significantly more records and could run significantly slower as well.

Let's keep moving forward together!
