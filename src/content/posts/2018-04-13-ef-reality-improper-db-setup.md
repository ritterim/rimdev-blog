---
title: EF's lazy-loading might break your reality when mixed with an improper DB setup
slug: ef-reality-improper-db-setup
date: 2018-04-13 10:00:00
tags:
- EF
- SQL
categories:
- Development
twitter_text: "EF's lazy-loading might break your reality when mixed with an improper DB setup"
authors: 
- Bill Boga
image: https://farm8.staticflickr.com/7601/16766482435_c3f1293551_b.jpg
image_url: https://www.flickr.com/photos/robert_hocker/16766482435
image_credit: Robert Hocker
---

Referencing nested objects in your `LINQ to SQL` query does some pretty neat magic "behind the scenes". But, there are occasions when its magic might leave you with unexplainable exceptions. By shear happenstance (that's for you, [Scott](https://github.com/ScottSchwalm)), your database might not have foreign-keys added. Or, they're added, but not enabled. Your LINQ looks right and compiles, but runtime is just not your friend. This post outlines part of that magic and even provides a way to safeguard your query. After reading, see if you can tell where I now reside on the whole [lazy-loading](https://msdn.microsoft.com/en-us/library/jj574232(v=vs.113).aspx) debate 😉.

## The setup

Here's a breakdown of the various models and tech. stack used within the post:

  - Entity Framework 6
  - LocalDB 13
  - Lazy-loading **enabled**

```csharp
public class Business
{
    public int BusinessId { get; set; }
    public string Name { get; set; }

    public virtual ICollection<Member> Members { get; set; } 
}

public class Member
{
    public int MemberId { get; set; }
    public string Name { get; set; }
}

public class BusinessContext
{
    public virtual DbSet<Business> Businesses { get; set; }       
}
```

### DB setup

    ==========
    Businesses
    ----------
    BusinessId
    Name
    ==========

    =====================
    BusinessMembers (1:*)
    ---------------------
    BusinessId
    MemberId
    =====================

    =======
    Members
    -------
    MemberId
    Name
    =======

## Which of these snippets has the potential to throw a [NRE](https://stackoverflow.com/a/4660186/1270174)?

### Without `.Include`

```csharp
var business = context.Businesses
    .Where(x => x.Name == "Bill's Business")
    .SingleOrDefault();

if (business != null)
{
    var members = business
        .Where(x => x.Members.Name == "Bill");
}
```

### With `.Include`

```csharp
var business = context.Businesses
    .Where(x => x.Name == "Bill's Business")
    .SingleOrDefault();

if (business != null)
{
    var members = business
        .Include(x => x.Members)
        .Where(x => x.Members.Name == "Bill");
}
```

![drumroll](https://media.giphy.com/media/116seTvbXx07F6/giphy.gif)

It's the **first-one**. And here's why:

## 1. Improper or non-functioning foreign-keys means the potential for invalid data!
## 2. Lazy-loading means extra database calls!

With the first snippet, using `Members.Name` in the LINQ-statement results in an additional database-call to get info. from the `Members` table. **But**, the `BusinessMembers` table might have `MemberId`s that don't exist in the `Members` table. Accessing a property on a `null` reference means 🤯. Here's a shortened (and clarified)-version of the SQL EF generates:

```sql
select
    *
    from (select top 1 b.*, join1.*
        from Businesses b  
        left outer join BusinessMembers on Businesses.BusinessId = BusinessMembers.BusinessId as join1
        where Businesses.Name = @p__linq__0
    )  AS ...
    order by ...
```

**Remember, this query is just to get the `Business` and `BusinessMembers` info. An additional query will be executed to get `Members` once the second-query in our csharp example is executed.**

The second snippet results in an [`inner join`](https://en.wikipedia.org/wiki/Join_(SQL)#Inner_join) between `BusinessMembers` and `Members`. This effectively filters-out those invalid records:

```sql
select
    *
    from (select top 1 b.*, join1.*, join2.*
        from Businesses b
        left outer join BusinessMembers on Businesses.BusinessId = BusinessMembers.BusinessId as join1
        inner join Members on BusinessMembers.MemberId = Members.MemberId as join2
        where Businesses.Name = @p__linq__0
    )  AS ...
    order by ...
```

## Summary

*Of course, with lazy-loading disabled, using the `.Include` would be required anyway, so maybe an alternate title for this post should be* "`Lazy-loading... (╯°□°）╯︵ ┻━┻`". 😜