---
layout: post
title: "Deprecating Subdomains Effectively With Windows Azure and IIS"
date: 2019-07-12 09:30:05
tags:
- Windows Azure
categories:
- Windows Azure
twitter_text: "Deprecating #Subdomains Effectively With #Windows @Azure and #IIS"
authors: Khalid Abuhakmeh
image: https://images.unsplash.com/photo-1532274804934-6572ef1581e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2575&q=80
image_url: https://unsplash.com/photos/fydgZecUkk0
image_credit: Jezael Melgoza
---

We are in the process of deprecating many smaller subdomain app services and serving the same content through our flagship site. This post will walk you through our strategy of decommissioning our subdomains, maintaining active redirects, and saving your Windows Azure credits for future endeavors.

## Ingredients

In this post, we have to define all of our _ingredients_ for a successful switch.

- Subdomain usually *.yourdomain.com but could be any domain.
- Primary domain is the final target.
- DNS Records
- IIS Web.config and Rewrite Rules

Our goal is to take a subdomain (apples.yourdomain.com) and redirect traffic to a page on your main domain (yourdomain.com/apples) successfully.

## Step 1: Rewrite Rules On Main Domain

We first need to set up our primary domain to handle the traffic of our subdomain. In a later step, we will change our subdomain records to point to the main domain's URL. To do this, we need an IIS web.config rewrite rule on our primary site.

```xml
<rule name="Subdomain redirect" enabled="true">
    <match url="(.*)" ignoreCase="true" />
    <conditions>
      <!-- The subdomain you are deprecating -->
      <add input="{HTTP_HOST}" pattern="apples.yourdomain.com" />
    </conditions>
    <!-- The new targeted page on the main domain -->
    <!-- redirectType can be Temporary or Permanent -->
    <action type="Redirect"
            url="https://yourdomain.com/apples"
            redirectType="Temporary"
            appendQueryString="true" />
</rule>
```

Be sure to deploy this change to your primary domain's Azure App Service before moving on to step #2.

Note: It is essential to do this via IIS and not your DNS provider's servers, especially if you are using `HSTS.` If you do use your DNS provider's redirect, the serving SSL certificate will be theirs, and most modern browsers will fail the redirect. Again, **DO NOT USE YOUR DNS' Providers REDIRECT, IT MAY SEEM EASY BUT WILL MOST LIKELY RESULT IN PAIN.**

## Step 2: Switch DNS Record

In your DNS providers dashboard, add a `CNAME` record to the subdomain that points to your primary site's azure app service. The change effectively makes your main domain also your subdomain.

## Step 3: Setting Your Domains in Azure

Now that we've deployed the redirect rule, we need to change some domain settings in our Windows Azure settings.

1. Login to Windows Azure and go to your App Service.
1. Go to the `Custom Domains` blade.
1. Add a `Custom Domain` of your subdomain (apples.yourdomain.com).

Note: You may not be able to validate the custom domain until you verify the DNS record from Step #2.

## Step 4: Decomission Subdomain App Service

You can now stop the App Service for your subdomain. It is no longer necessary since any traffic to the subdomain is going to your primary domain's App Service. Additionally, the redirect rule will automatically redirect any subdomain URLs to the intended target URL.

Once you've confirmed all changes are working, you can delete the subdomain app service and count the money in your bank account.

## Conclusion

When complete, you should have all subdomains redirecting to your main site, be down at least one App Service, still be using your SSL certificates, and everyone will be happy. This process takes a few steps, but its reproducible and reliable. Hopefully, you found this post helpful.
