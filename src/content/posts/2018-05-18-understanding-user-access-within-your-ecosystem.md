---
layout: post
title: "Understanding User Access Within Your Ecosystem"
date: 2018-05-18 09:13:10
tags:
- development
categories:
- development
twitter_text: "Understanding User Access Within Your Ecosystem"
authors: Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2120/2142510328_a8fea153c8_b_d.jpg
image_url: https://www.flickr.com/photos/edesign/
image_credit: Stuart R Brown
---

Security is an essential part of any application ecosystem, but it can also be a nebulous concept for an organization to grasp. During our system rewrite, the team has had discussions on the topic of securing a system.

What we've found is there are five levels of security an application might have in regards to user access, and each access level is a prerequisite to continuing to the next.

## Level 1: Authentication (Who Are You?)

We must first identify the individual. Identity can be a simple login process or a stringent authentication process with questions, two-factor authentication, or more.

## Level 2: Permissions (What Actions Can You Perform?)

At level 2, we need to recognize what actions a user can take within the system. Can they edit a resource, or can they just read it? Permissions can make the user experience narrow or broad.

## Level 3: Responsibility (What Resources Do You Have a Stake In?)

This level identifies resources that the current user has access to directly. While the user may be able to modify records, we want to limit which resources they can change. It is also essential to constrain the view of the user to only relevant resources within their responsibility.

## Level 4: Resource Permission (What Responsibility Do You Have For A Resource?)

Resource permission, a level at which point we have identified the user, they can perform actions, they have responsibility on a particular resource, but a system may need to constrain the _kind_ of responsibility.

Can the user read a resource? Can they affect this particular resource? All crucial questions answered at this level.

*Note: Some systems may not need this level of granularity.*

## Level 5: Business Rules (Is It Possible?)

Business rules tend to be the most complex level of securing a system. This layer is dependent on the current working domain. Validating a user's actions as correct is essential. A business rule can be as simple as verifying a single resource, or as complex as validating the state of the system.

## Conclusion

Security is serious business and a complex one at that. Building systems are a balancing act between a secure one and a manageable one. An unmanageable security system is a lousy security system, while one that is naive may expose sensitive data. 

What are your thoughts? Did we miss a critical level or are we excessive? I'd love to hear your thoughts in the comments.