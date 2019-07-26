---
layout: post
title: "IIS Rewrite Maps and Redirecting On Url Paths"
date: 2019-07-26 11:45:20
tags:
  - IIS
  - Azure
  - SEO
categories:
  - IIS
  - Azure
  - SEO
twitter_text:
authors:
  - Khalid Abuhakmeh
  - Kevin Hougasian
  - Bill Boga
image: https://images.unsplash.com/photo-1452567489037-30d54d84ad60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2581&q=80
image_url: https://unsplash.com/photos/PQvRco_SnpI
image_credit: darylgio agoncillo
---

URLs are the bridges that connect our little island of a website to the bigger continent known as the Internet. Preserving URL integrity is the utmost importance for providing an excellent experience for new and existing users alike. Sadly, from a development and management standpoint, keeping old paths working for a new site can be a real pain in the butt. In this post, we'll show you how to use redirect maps to create a lookup dictionary for old URL paths. This post will also help you preserve query string parameters.

## Configuration

We started by exploring the [Microsoft documentation site](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/using-rewrite-maps-in-url-rewrite-module) around rewrite maps. For rewrite maps, you will need to make sure you are running your site on Internet Information Services with the rewrite module.

What you will in your web.config is a `rewriteMaps` section with all of your old URL paths and their new destinations.

```xml
<rewrite>
    <rewriteMaps>
        <rewriteMap name="StaticRewrites" defaultValue="">
            <add key="/one" value="/new-one" />
            <add key="/two" value="/new-two" />
        </rewriteMap>
    </rewriteMaps>
</rewrite>
```

This rewrite map then needs a subsequent rule to match the URL path.

```xml
<rule name="Redirect rule for StaticRewrites" stopProcessing="true">
    <match url=".*" />
    <conditions>
        <add input="{StaticRewrites:{URL}}" pattern="(.+)" />
    </conditions>
    <action type="Redirect" url="{C:1}" redirectType="Permanent"/>
</rule>
```

Note that the use of `{URL}` in our rule. The rule makes sure we look into the rewrite map using _only_ the URL's path. If you were to use anything else, you likely will not get a match. If you need to match on anything else, please look into the IIS documentation to understand your options.

Try it out and hopefully we've saved you some keystrokes :)
