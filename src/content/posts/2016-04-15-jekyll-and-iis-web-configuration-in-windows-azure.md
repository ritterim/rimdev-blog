---
title: "Jekyll and IIS Web Configuration in Windows Azure"
slug: jekyll-and-iis-web-configuration-in-windows-azure
date: 2016-04-15 10:00:00
tags:
- Jekyll
- Azure
- IIS
image: https://farm5.staticflickr.com/4113/5441989960_8d97061ac8_b_d.jpg
image_url: https://www.flickr.com/photos/alldread/
image_credit: Ryan Allred
categories:
- Development
twitter_text: "Configure #Jekyll in @windowsazure and #IIS"
authors: 
- Khalid Abuhakmeh
---

In a previous post, ["Deploying Jekyll on Windows Azure"](/deploying-jekyll-to-windows-azure-app-services), I detailed how to get a [Jekyll](https://jekyllrb.com/) based site on to Windows Azure with relative ease. During that time, the team has done several deployments to our cloud provider. With those deployments, we realized we needed to commit more work into the site's `web.config` to get the solution we really wanted. We are happy with our current outcome, but understand there may be edge cases we still haven't hit, and hope to come back and update this post when necessary. 

## HTTP Errors

It is rare to have server-side errors on a staticly generated site, and the most common one will be `404`. Right now, we are just leaning on the `httpErrors` element under `system.webServer` to redirect to a default error page.

```xml
<httpErrors defaultPath="/woops.html" defaultResponseMode="Redirect"></httpErrors>
```

## HTML5 Static Content

HTML5 is a part of our site building strategy, but the initial IIS configuration is not supportive of our strategy. With some help from [Mads Kristensen](http://madskristensen.net/post/prepare-webconfig-for-html5-and-css3), we modified our `web.config` with the `staticContent` element.

```xml
<staticContent>
    <mimeMap fileExtension=".mp4" mimeType="video/mp4" />
    <mimeMap fileExtension=".m4v" mimeType="video/m4v" />
    <mimeMap fileExtension=".ogg" mimeType="video/ogg" />
    <mimeMap fileExtension=".ogv" mimeType="video/ogg" />
    <mimeMap fileExtension=".webm" mimeType="video/webm" />
    <mimeMap fileExtension=".oga" mimeType="audio/ogg" />
    <mimeMap fileExtension=".spx" mimeType="audio/ogg" />
    <mimeMap fileExtension=".svg" mimeType="image/svg+xml" />
    <mimeMap fileExtension=".svgz" mimeType="image/svg+xml" />
    <remove fileExtension=".eot" />
    <mimeMap fileExtension=".eot" mimeType="application/vnd.ms-fontobject" />
    <mimeMap fileExtension=".otf" mimeType="font/otf" />
    <mimeMap fileExtension=".woff" mimeType="font/x-woff" />
</staticContent>
```

## Rewrite Rules

Rewrite rules are the most critical part of our Jekyll/IIS configuration and account for much of the necessary behavior we are looking for. Not all the rewrite rules you will see below are Jekyll specific. Rewrite rules are normally located under `system.webServer/rewrite`.

### Redirecting to HTTPS

All of our sites will run on **HTTPS** by default. To enforce the secure behavior we used an **inbound** rule.

```xml
<rule name="Redirect to HTTPS" stopProcessing="true">
    <match url="(.*)" />
    <conditions>
        <add input="{REMOTE_PORT}" pattern=".*" />
        <add input="{HTTPS}" pattern="^OFF$" />
    </conditions>
    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

### Support Non-Trailing Slash Urls

Trailing slashes are no longer a default in [Jekyll 3]( https://jekyllrb.com/docs/upgrading/2-to-3/#permalinks-no-longer-automatically-add-a-trailing-slash). If you find yourself on a previous version those slashes can be annoying. Additionally, you may have someone accidentally add a trailing slash, because old habits die hard. Generally, this isn't a behavior we liked, so we needed to create a rule that supported access to pages without the trailing slash. 

```xml
<rule name="RewriteHtml">
    <match url="^(.*)$" />
    <conditions logicalGrouping="MatchAll">
        <add input="{REMOTE_PORT}" pattern=".*" />
        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
    </conditions>
    <action type="Rewrite" url="{R:1}.html" />
</rule>
```

All Jekyll pages are statically generated and suffixed with `html`. Using the rewrite module, we are able to write the contents of an HTML file directly into the response.

### Remove WWW

We wanted a canonical url for our site. This meant specifically removing the `www` from our urls and reducing the possible permutations.

```xml
<rule name="Remove WWW" patternSyntax="Wildcard" stopProcessing="true">
    <match url="*" />
    <conditions>
        <add input="{REMOTE_PORT}" pattern=".*" />
        <add input="{CACHE_URL}" pattern="*://www.*" />
    </conditions>
    <action type="Redirect" url="{C:1}://{C:2}" redirectType="Permanent" />
</rule>
```

### Relative Urls to Absolute Urls

For [SEO reasons](https://moz.com/blog/relative-vs-absolute-urls-whiteboard-friday), we wanted to make all our links and images use absolute urls. This is easy to do with the `outboundRules` element. 

```xml
<outboundRules rewriteBeforeCache="true">
    <rule name="Rewrite relative to absolute" preCondition="IsHtml">
        <match filterByTags="A, Img" pattern="^/(.*)" />
        <action type="Rewrite" value="https://{HTTP_HOST}/{R:1}" />
    </rule>
    <preConditions>
        <preCondition name="IsHTML">
            <add input="{RESPONSE_CONTENT_TYPE}" pattern="^text/html" />
        </preCondition>
    </preConditions>
</outboundRules>
```

I want to note a really **BIG** gotcha with the outbound rule above.

```xml
<outboundRules rewriteBeforeCache="true">
...
</outboundRules>
```

By default, Windows Azure wants to `gzip` your static content. You **cannot** apply an outbound rule on content that has been compressed. If your Jekyll site begins to fail after adding this rule, you probably forgot the `rewriteBeforeCache` attribute.

## The Complete Configuration

Putting all of these configuration settings together, we get the following `web.config`:

```xml
<?xml version="1.0"?>
<configuration>
    <system.webServer>
        <httpErrors defaultPath="/woops.html" defaultResponseMode="Redirect"></httpErrors>
        <modules runAllManagedModulesForAllRequests="true" />
        <rewrite>
            <rules>
                <rule name="Redirect to HTTPS" stopProcessing="true">
                    <match url="(.*)" />
                    <conditions>
                        <add input="{REMOTE_PORT}" pattern=".*" />
                        <add input="{HTTPS}" pattern="^OFF$" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
                </rule>
                <rule name="RewriteHtml">
                    <match url="^(.*)$" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REMOTE_PORT}" pattern=".*" />
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="{R:1}.html" />
                </rule>
                <rule name="Remove WWW" patternSyntax="Wildcard" stopProcessing="true">
                    <match url="*" />
                    <conditions>
                        <add input="{REMOTE_PORT}" pattern=".*" />
                        <add input="{CACHE_URL}" pattern="*://www.*" />
                    </conditions>
                    <action type="Redirect" url="{C:1}://{C:2}" redirectType="Permanent" />
                </rule>
            </rules>
            <outboundRules rewriteBeforeCache="true">
                <rule name="Rewrite relative to absolute" preCondition="IsHtml">
                    <match filterByTags="A, Img" pattern="^/(.*)" />
                    <action type="Rewrite" value="https://{HTTP_HOST}/{R:1}" />
                </rule>
                <preConditions>
                    <preCondition name="IsHTML">
                        <add input="{RESPONSE_CONTENT_TYPE}" pattern="^text/html" />
                    </preCondition>
                </preConditions>
            </outboundRules>
        </rewrite>
        <staticContent>
            <mimeMap fileExtension=".mp4" mimeType="video/mp4" />
            <mimeMap fileExtension=".m4v" mimeType="video/m4v" />
            <mimeMap fileExtension=".ogg" mimeType="video/ogg" />
            <mimeMap fileExtension=".ogv" mimeType="video/ogg" />
            <mimeMap fileExtension=".webm" mimeType="video/webm" />
            <mimeMap fileExtension=".oga" mimeType="audio/ogg" />
            <mimeMap fileExtension=".spx" mimeType="audio/ogg" />
            <mimeMap fileExtension=".svg" mimeType="image/svg+xml" />
            <mimeMap fileExtension=".svgz" mimeType="image/svg+xml" />
            <remove fileExtension=".eot" />
            <mimeMap fileExtension=".eot" mimeType="application/vnd.ms-fontobject" />
            <mimeMap fileExtension=".otf" mimeType="font/otf" />
            <mimeMap fileExtension=".woff" mimeType="font/x-woff" />
        </staticContent>
    </system.webServer>
</configuration>
```