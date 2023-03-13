---
title: "Creating A Pagination Component With Astro"
slug: creating-a-pagination-component-with-astro
date: 2023-03-09 11:31:06
tags: 
- Astro
- JavaScript
- frontend
categories:
- JavaScript
- frontend
- Astro
twitter_text: "Creating A Pagination Component With Astro"
authors: 
- Ted Krueger
image: https://images.unsplash.com/photo-1531177071211-ed1b7991958b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTd8fHNwYWNlJTIwc2hpcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60
image_url: https://unsplash.com/photos/b3PuuRU8IPc
image_credit: Zoltan Tasi
---

Here at RIMdev, we're currently converting our static sites to use [Astro](https://astro.build/). As we switch from our current SSGs, [Hugo](https://gohugo.io/) and [Jekyll](https://jekyllrb.com/), we're creating reusable components that we'd like to document for the team. This series of posts will contain those components for not only our benefit but hopefully yours as well!

Something that Hugo did well was Pagination. It was very simple to implement but it came with some limitations. Astro does not have a specific Pagination component but it _does_ give you the tools to make your own. Here's what I came up with and used on a couple of our sites for blog sections...

## [TLDR;](#putting-it-together)
<div class="mb-3 text--center">
<img src="/images/get-to-the-point.gif" alt="Get to the point"/>
</div>

First, create your blog page within `/src/pages`. I like to add another folder here called `/blog` just to try to keep things a bit cleaner. So we have:

```
src
- pages
  - blog
```

Inside here add your page for the blog landing. This is the page that will show all of your posts, or at least what we want. You'll need the use brackets in this page title. Call it `[...page].astro`. We need the `[]` wrapping the name as this is a dynamic route.

```
src
- pages
  - blog
    - [...page].astro
```

## [Blog Landing](#blog-landing)
Now let's get to the guts of `[...page].astro`. You'll be leveraging `page.data` here. We also need 2 other components `PostSummary.astro`, which is a block of blog info like a title, image, and a teaser. You can add more to this if you need and I'll show you what this looks like in a bit. We also need a `Pagination.astro` component. This can also be customizzed to your needs but it will most likely always have the same data passed to it.

The frontmatter of `[...page].astro` should look like:

```javascript
---
import PostSummary from "../../layouts/partials/blog/PostSummary.astro";
import Pagination from '../../components/Pagination.astro';

export async function getStaticPaths({ paginate }) {
  const allPosts = await Astro.glob('./*.md*');
  const formattedPosts = allPosts.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date)).reverse();

  return paginate(formattedPosts, {
    pageSize: 5,
  })
}
const { page } = Astro.props;
---
```

Include your components, PostSummary and Pagination. We use the `getStaticPaths` function to grab each blog post. In this case it's anything in our /blog folder and we're looking for any file that ends in either a `.md` or `.mdx` file type. We want to format them by the most recent post. That's what we're doing with the `formattedPosts` variable. Once we have our posts array we can set the total number of posts we want to show. In this case it's 5. 

```javascript
  return paginate(formattedPosts, {
    pageSize: 5,
  })
```

Finally we need to get page data so we use: 

```javascript
const { page } = Astro.props;
```

If you want to see what this looks like, add `console.log(page)` in your front matter. This will show you an array of your posts and the data inside them that you can utilize.

## [Populate The Posts](#populate-the-posts)
Using `page` we can map the array:

```javascript
{
    page.data.map((post) => (
        <PostSummary 
            url={post.slug} 
            title={post.data.title} 
            thumbnail={post.data.thumbnail} 
            summary={post.data.summary} 
        />
    ))
}
```

When populated, the PostSummary looks like this:

<figure>
    <img src="/images/pagination-posts.png" style="max-width: 100%">
    <figcaption class="text--center">
      <em>Example of a rendered PostSummary.</em>
    </figcaption>
</figure>
<br/>

So a `PostSummary` is being rendered for each post, but it's only up to 5 since that's what we set the pagination limit to.

Let's add the pagination underneath the posts. Using our Pagination component:

```javascript
<Pagination 
    length={page.lastPage} 
    currentUrl={page.url.current} 
    currentPage={page.currentPage} 
    firstUrl={`/${firstPath}`} 
    prevUrl={page.url.prev} 
    nextUrl={page.url.next} 
    lastUrl={`/${firstPath}/${page.lastPage}`}
/>
```

## [PostSummary Component](#postsummary-component)
Let's take a look at each component starting with `PostSummary.astro`:

```javascript
---
const { title, url, thumbnail, summary } = Astro.props;
---

<div class="block">
  <div class="block-container blocks px-3 post-summary">
    <div class="block tablet-up-4 lg-tablet-up-3">
      <img src={`/images/blog/${thumbnail}`} alt={title}>
    </div>
    <div class="block tablet-up-8 lg-tablet-up-9">
      <a href={`/blog/${url}`}>
        <h2 class="heading">{title}</h2>
      </a>
      <p>{summary}</p>
      <a href={`/blog/${url}`} class="post-summary__action text--bold">Read More</a>
    </div>
  </div>
</div>
```

## [Pagination Component](#pagination-component)

Now `Pagination.astro`:

```javascript
---
const { length, currentUrl, currentPage, firstUrl, prevUrl, nextUrl, lastUrl } = Astro.props;
const paginationList = Array.from({length: `${length}`}, (_, i) => i + 1);
---

<nav aria-label="Blog pages" class="pagination pagination-default">
    { firstUrl == currentUrl ? (
        <span class="pagination__link disabled">
            <i class="pi-angle-left"></i>
            <i class="pi-angle-left"></i>
        </span>
    ) : (
        <a href={firstUrl} class="pagination__link">
            <i class="pi-angle-left"></i>
            <i class="pi-angle-left"></i>
        </a>
    )}

    { prevUrl ? (
        <a href={prevUrl} class="pagination__link">
            <i class="pi-angle-left"></i>
        </a>
    ) : (
        <span class="pagination__link disabled">
            <i class="pi-angle-left"></i>
        </span>        
    )}
    
    {
        paginationList.map((num) => (
            <a href={`${firstUrl}${num == 1 ? "" : '/'+(num)}`} class={`pagination__link ${currentPage == num ? "disabled active" : ""}`}>
                {num}
            </a>
        ))
    }

    { !nextUrl ? (
        <span class="pagination__link disabled">
            <i class="pi-angle-right"></i>
        </span>
    ) : (
        <a href={nextUrl} class="pagination__link">
            <i class="pi-angle-right"></i>
        </a>
    )}

    { lastUrl == currentUrl ? (
        <span class="pagination__link disabled">
            <i class="pi-angle-right"></i>
            <i class="pi-angle-right"></i>
        </span>
    ) : (
        <a href={lastUrl} class="pagination__link">
            <i class="pi-angle-right"></i>
            <i class="pi-angle-right"></i>
        </a>
    )}
    
</nav>
```

The Pagination component should look something like this: (This has been styled)
<figure>
    <img src="/images/pagination-example.png" style="max-width: 100%">
    <figcaption class="text--center">
      <em>Example of the rendered Pagination.</em>
    </figcaption>
</figure>
<br/>

## Putting It Together

```javascript
---
import BlogLanding from "../../layouts/blog/BlogLanding.astro";

import PostSummary from "../../layouts/partials/blog/PostSummary.astro";
import Pagination from '../../components/Pagination.astro';

const allPosts = await Astro.glob('./*.md*');
export async function getStaticPaths({ paginate }) {
  const allPosts = await Astro.glob('./*.md*');
  const formattedPosts = allPosts.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date)).reverse();

  return paginate(formattedPosts, {
    pageSize: 5,
  })
}
const { page } = Astro.props;
const pathname = new URL(Astro.request.url).pathname.split('/');
const firstPath = pathname[1];
---
<BlogLanding frontmatter>
  <ol class="posts list">
    {
      page.data.map((post) => (
        <li class="post">
          <PostSummary 
            url={post.url} 
            title={post.frontmatter.title} 
            date={post.frontmatter.date} 
            summary={post.frontmatter.teaser} 
            tags={post.frontmatter.tags}
            categories={post.frontmatter.categories}
          />
        </li>
      ))
    }
  </ol>

  {allPosts.length > 10 ? (
    <div class="mt-4">
      <Pagination length={page.lastPage} 
        currentUrl={page.url.current} 
        currentPage={page.currentPage} 
        firstUrl={`/${firstPath}`} 
        prevUrl={page.url.prev} 
        nextUrl={page.url.next} 
        lastUrl={`/${firstPath}/${page.lastPage}`}
      />
    </div>
  ) : null}
</BlogLanding>

<style lang="scss">
  .post {

    + .post {
      margin-top: 4rem;
    }
  }
</style>
```