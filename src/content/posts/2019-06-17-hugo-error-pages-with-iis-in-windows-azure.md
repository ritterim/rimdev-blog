---
title: "Hugo Error Pages With IIS In Windows Azure"
slug: hugo-error-pages-with-iis-in-windows-azure
date: 2019-06-17 11:10:41
tags:
    - Azure
    - Static
categories:
    - Azure
    - Static
twitter_text: ".@GoHugoIO error pages with #IIS in #Windows @Azure"
authors: 
- Khalid Abuhakmeh
image: https://images.unsplash.com/photo-1491832541507-17ee9fc8d164?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80
image_url: https://unsplash.com/photos/GfDyRbLofHg
image_credit: Patrick Tomasso
---

Static site hosting is straightforward, and from our experience, less likely to have errors compared to a more dynamic site. While dynamic site problems, like missing pages or internal server errors, are not expected, they can still happen. For us, it is essential to be good internet citizens and set up proper responses to error response. If we are transmitting a 404 Page Not Found page response, we want the HTTP semantics to match what our users are seeing. In this post, I'll show you what you need to set up your Hugo static site to support proper error pages in Internet Information Services (IIS).

## Setting Up Your Error Pages

In Hugo, we can treat error pages like any other piece of content on our site. In our use cases, we usually create a file named `404.md` under our `content` folder (`/content/404.md`).

```markdown
---
title: Page Not Found
date: 2018-07-20T12:09:05-04:00
type: basic
---
**We're so sorry that you stumbled upon this page!**
```

After running the `hugo` command, you should see a generated document under the following structure.

```
> /public/404/index.html
```

Create as many error pages as you need for your site.

## Web.config Setup

IIS operates by using configuration files commonly named `Web.config`.  Place a `Web.config` file under the `static` directory of your Hugo site.

```
> /static/Web.config
```

The file contents should include a `httpErrors` section that contains some potential status codes.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <system.webServer>
    <httpErrors errorMode="Custom" existingResponse="Replace">
      <remove statusCode="400" />
      <remove statusCode="403" />
      <remove statusCode="404" />
      <remove statusCode="500" />
      <error statusCode="400" responseMode="File" path="404\index.html" />
      <error statusCode="403" responseMode="File" path="404\index.html" />
      <error statusCode="404" responseMode="File" path="404\index.html" />
      <error statusCode="500" responseMode="File" path="404\index.html" />
    </httpErrors>
    <validation validateIntegratedModeConfiguration="false" />
  </system.webServer>
</configuration>
```

Please note, **it is vital that you use back-slashes when setting the `path` attribute.** Additionally, we want to set the `responseMode` to `File`. The `existingRepsonse` attribute on the `httpErrors` element tells IIS to read the file from disk, then immediately overwrite the current response with the contents of the file.

## Conclusion

The next time you deploy your Hugo site to Azure running an IIS instance, you should have all the necessary parts required to respond semantically to your users, whether they be human or otherwise. 

As a final checklist for those that need it, remember these steps:

1. Create an error page. You can create the page via content or bespoke HTML.
2. Add the Web.config to the `static` folder. Building the site will place the file at the root of your `public` folder.
3. Modify the Web.config to alter any necessary status codes.

Good luck!
