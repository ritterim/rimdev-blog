---
layout: ../layouts/Post.astro
title: "Tab Colors in Azure Data Studio"
date: 2020-10-26 13:20:19
tags:
- Documentation
- Azure Data Studio
categories:
- Documentation
twitter_text: Using Tab Colors in Azure Data Studio
authors: Steliana Vassileva
image: /images/documentation/azure-data-studio-welcome.png
---

If you've ever worked in **Azure Data Studio**, you may find tab colors very useful.

They allow you to visually separate different connections to development, staging, and production databases. Better visual indicators mean less opportunity for errors and mistakes when running queries. Below is an example of what you can accomplish using this feature.

![Azure Data Studio Color Tabs Example](/images/documentation/azure-data-studio-color-tabs-example.png)

## Why the post?

As a documentarian, I don't work with Azure Data Studio daily. But I still write about it. In addition, one of our backend developers recently introduced me to the [Feynman Technique](https://fs.blog/2012/04/feynman-technique/). Solid advice for anyone to follow.

Typically I go through all steps when documenting a process. My thinking is that I'll better understand and explain new features and functionality. In the meantime, I get to keep learning! 

So as I normally do, I set out to create these tabs. 

My first step was to read the [Azure Data Studio documentation](https://docs.microsoft.com/en-us/sql/azure-data-studio/settings?view=sql-server-ver15#tab-color). Microsoft's Docs are usually a dream resource. However, I soon found myself struggling a bit. I operate under the basic assumption that I'm usually at fault, but maybe a more thorough explanation could benefit others as well.

## Let's set up the tabs!

A critical point to remember is that connections have to be organized into server groups.

1. Click the **New Server Group** folder to create.
  
    ![Azure Data Studio New Server Group](/images/documentation/azure-data-studio-new-server-group.png)

2. Add the **Server group name, Group description,** and **Group color**. Click **OK**.
    
    ![Azure Data Studio Add Server Group](/images/documentation/azure-data-studio-add-server-group.png)

3. Go to **File > Preferences > Settings**.

4. Search for **tab color**.

5. Enable **Tab Color Mode**. I used the **Fill** setting.
    
    ![Azure Data Studio Enable Tab Color Mode](/images/documentation/azure-data-studio-enable-tab-color.png)

6. Drag your server connections to the appropriate server group.

7. And voila! The next time you create a query, the query tab will take on the color of the server group.

    ![Azure Data Studio Enable Tabs Result](/images/documentation/azure-data-studio-final-result.png)  


By the way, if you ever want to get fancy and modify the color palette, you can:

1. Go back to **File > Preferences > Settings**. 

2. Search for **color**. 

3. In the **Data > Connection** section, modify the `settings.json` to reflect your color choices.
