---
title: "Does A Property Exist On My C# Object"
slug: does-a-property-exist-on-my-c#-object
date: 2018-08-24 08:22:45
tags:
- C#
- development
categories:
- Development
twitter_text: "Does a Property Exist On My C# Object?"
authors: 
- Khalid Abuhakmeh
image: https://farm4.staticflickr.com/3139/3060151161_f3d8930e6b_o_d.jpg
image_url: https://www.flickr.com/photos/evilerin/
image_credit: Evil Erin
---

We are in the middle of writing a template engine to define dynamic forms. The user interface can only post to a known model on the server. We allow our users to configure the template in any configuration they like, with the constraint that any field they add to their form be one that can processed on the server.

Given these string paths, we would like to know if they exist on our server representation. We use a JavaScript library named [Flat](https://www.npmjs.com/package/flat), which is the reasoning behind our string path construction around arrays.

```console
"FirstName"
"Interested.LastName"
"Addresses.0.Street"
```

This is our model.

```csharp
public class Information {
    public string FirstName {get;set;}
    public string LastName {get;set;}
    public Interested Interested {get;set;}
    public IEnumerable<Address> Addresses { get;set; }
}

public class Interested {
    public bool Programming {get;set;}
}

public class Address {
    public string Street {get;set;}
}
```

## Solution

The solution was adapted from a [StackOverflow](https://stackoverflow.com/a/18870315) answer. It uses an iterative approach with reflection. We know the depth of our property graph, so there is no need for reflection.

```csharp
/// <summary>
/// Modfied from https://stackoverflow.com/a/18870315
/// </summary>
/// <param name="path"></param>
/// <param name="t"></param>
/// <returns></returns>
public static bool PropertyExists(string path, Type t)
{
    if (string.IsNullOrEmpty(path))
        return false;

    var pp = path.Split('.');

    foreach (var prop in pp)
    {
        if (int.TryParse(prop, out var result))
        {
            /* skip array accessors */
            continue;
        }

        var propInfo = t.GetMember(prop)
            .Where(p => p is PropertyInfo)
            .Cast<PropertyInfo>()
            .FirstOrDefault();

        if (propInfo != null)
        {
            t = propInfo.PropertyType;

            if (t.GetInterfaces().Contains(typeof(IEnumerable)) && t != typeof(string))
            {
                t = t.IsGenericType
                    ? t.GetGenericArguments()[0]
                    : t.GetElementType();
            }
        }
        else
        {
            return false;
        }
    }

    return true;
}
```

With the method above, you can now make calls to determine if the property exists on your model, regardless of the depth and if that property exists in an array.

Here is a full example.

```csharp
using System;
using System.Linq;
using System.Reflection;
using System.Collections;
using System.Collections.Generic;

public class Program
{
	public static void Main()
	{
		var paths = new [] {
			"FirstName",
			"LastName",
			"MiddleName",
			"Interested.Programming",
			"Interested.Football",
			"Addresses.0.Street",
			"Addresses.0.City",
		};
		
		foreach(var path in paths) {
			Console.WriteLine($"{path} : {PropertyExists(path, typeof(Information))}");
		}
		
	}
	
	/// <summary>
	/// Modfied from https://stackoverflow.com/a/18870315
	/// </summary>
	/// <param name="path"></param>
	/// <param name="instance"></param>
	/// <returns></returns>
	public static bool PropertyExists(string path, Type t)
	{
		if (string.IsNullOrEmpty(path))
			return false;
	
		var pp = path.Split('.');
	
		foreach (var prop in pp)
		{
			if (int.TryParse(prop, out var result))
			{
				/* skip array accessors */
				continue;
			}
	
			var propInfo = t.GetMember(prop)
				.Where(p => p is PropertyInfo)
				.Cast<PropertyInfo>()
				.FirstOrDefault();
	
			if (propInfo != null)
			{
				t = propInfo.PropertyType;
	
				if (t.GetInterfaces().Contains(typeof(IEnumerable)) && t != typeof(string))
				{
					t = t.IsGenericType
						? t.GetGenericArguments()[0]
						: t.GetElementType();
	
				}
			}
			else
			{
				return false;
			}
		}
	
		return true;
	}
}

public class Information {
    public string FirstName {get;set;}
    public string LastName {get;set;}
    public Interested Interested {get;set;}
    public IEnumerable<Address> Addresses { get;set; }
}

public class Interested {
    public bool Programming {get;set;}
}

public class Address {
    public string Street {get;set;}
}
```

With the expected output.

```console
FirstName : True
LastName : True
MiddleName : False
Interested.Programming : True
Interested.Football : False
Addresses.0.Street : True
Addresses.0.City : False
```

Try it out in this [Dotnetfiddle](https://dotnetfiddle.net/i93RMd). Thank you and I hope you found this post helpful. Leave a comment if you think we could do this better.