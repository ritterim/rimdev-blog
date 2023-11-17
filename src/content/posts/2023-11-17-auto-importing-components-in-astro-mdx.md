---
title: Automatically import Components in Astro MDX
slug: automatically-import-components-in-astro-mdx
date: 2023-11-17 12:00:00
tags:
- frontend
- Astro
- SSG
categories:
- frontend
twitter_text: How to automatically import components in Astro MDX files.
authors: 
- Ryan Trimble
image: https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=3913&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_url: https://unsplash.com/photos/silhouette-photo-of-mountain-during-night-time-ln5drpv_ImI
image_credit: Vincentiu Solomon
---

One of my (very few) complaints while working with Astro was that using components in MDX files tends to be a bit clunky, especially for those who may not be as familiar with how to import things. For example, we have some non-developers that make content updates to our static sites who are most likely unaware of this crucial step.

## The Problem

We are converting sites from Hugo to Astro and in Hugo there is a concept of "shortcodes" used inside markdown to easily generate snippets of code. Hugo automatically knows about shortcodes, as long as they reside inside the `shortcodes/` folder, in order to be used throughout a markdown file without having to do any imports. 

Astro doesn't have a "shortcodes" concept per se, but components are a pretty straightforward replacement. There are two main differences though:

- Regular markdown does not understand components, which leads us to utlize MDX instead.
- Components are not automatically imported into these MDX files.

Now importing components may not sound like the end-of-the-world, but might cause a lot of unneeded stress the first time someone unknowingly uses a component without importing it first.

## The Solution

Over on Mastodon, Roma Komarov had the answer with a recent post called [Astro MDX Components](https://blog.kizu.dev/astro-mdx-components/). 

In the post, Roma explains a very similar use-case for Astro components to our problem with shortcodes. Roma figured out that when rendering a dynamic `<Content />` component, you can actually provide it a `components` prop in order to pass in whichever components you want to be automatically included in the MDX files.

Definitely check out Roma's post for all the details!

## Implementation

For my implementation of Roma's solution, I created a mixin file called `mixins/autoImportComponents.js` which has the one job of returning all the components I've created "shortcodes" for:

```js
import DetailSummary from '../shortcodes/DetailSummary.astro';
import MessageBlock from '../shortcodes/MessageBlock.astro';

export const components = {
  DetailSummary,
  MessageBlock
}
```

I chose to do this as a mixin file to quickly include these components in any layout files I might need.

Within `[slug].astro` (or whatever layout file needed) used for MDX content, I can now import the mixin file and pass these shortcode components into the dynamically created render component via the `components` prop:

```js
---
import {components} from '../mixins/autoImportComponents';

const { Content } = await entry.render();
---

<Content components={components} />
```

Now anyone can freely use these shortcode components within MDX files without needing to import first!