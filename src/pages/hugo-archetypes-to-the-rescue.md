---
layout: ../layouts/Post.astro
title: "Hugo Archetypes to the Rescue!"
date: 2021-02-19 08:01:49
tags:
- Documentation
- Hugo
- Archetypes
categories:
- Documentation
twitter_text: Hugo Archetypes to the Rescue!
authors: Steliana Vassileva
image: /images/documentation/hugo.png
image_url: https://images.app.goo.gl/A9asceAGJ8aQL8yF6
---

Using our Hugo-based documentation site, we typically publish release notes once per week. My usual process includes the following:

* Manually create a markdown file in the respective directory.
* Copy the front matter from a prior markdown file.
* Paste content from the GitHub issue where we track release notes.
* Insert quote here about repetition with the same results, ending in insanity.

I recently had some time to explore a more efficient way to complete this task. That's when I came across Hugo archetypes -- a feature worth celebrating here.

While release notes are essential and helpful to capture, they can be tedious. With this discovery, they're almost a pleasure to write.

## What are Hugo archetypes?

[Hugo archetypes](https://gohugo.io/content-management/archetypes/) live in the archetypes directory of your project or secondarily under your theme.

They consist of content template files that allow you to predetermine front matter and the related page structure, with its headings and other repeatable elements.

When you run `hugo new`, Hugo looks for the appropriate archetype template to create the page. You can even use [directory-based archetypes](https://gohugo.io/content-management/archetypes/#directory-based-archetypes) to create folders with the same set of files.

## Our solution

In our context, using archetypes seems appropriate.

We have public and internal release notes, where the front matter and page organization are consistent from week to week. The only variation is the name of the markdown file and the release date.

Below are the steps used to implement archetypes for this project.

1. Navigate to the **archetypes** folder under the Hugo theme.

2. Add a **release-notes** folder that emulates the **content/release-notes** folder structure in the project.

3. Under each subdirectory, add the markdown files to use as the templates.

    I chose the **00000000.md** naming convention since we use the release date as the file name, for example, **02192021.md**. When I run `hugo new`, the file appears at the top of the markdown file list.

    ![Hugo Archetypes Release Notes Folder](/images/documentation/hugo-archetypes-release-notes.png)

4. Populate each archetype template with the front matter and page elements for reuse each week.
   
    ![Hugo Archetypes Internal Markdown](/images/documentation/hugo-archetypes-internal-md.png)

5. Run `hugo new release-notes/`. Hugo uses the provided archetypes to create the new content, inserting it into the same location under **content/release-notes**.

6. Check the **content/release-notes** directory to see the changes.

    ![Hugo After Hugo New](/images/documentation/hugo-archetypes-after-hugo-new.gif)

7. At this point, I can just update the file name and add the actual details for the release. Additionally, the front matter already contains my variables.

    ![Hugo Archetypes Internal Markdown Results](/images/documentation/hugo-archetypes-internal-result-md.png)

8. Figure out how to automate the rest of release notes to eliminate human intervention.
