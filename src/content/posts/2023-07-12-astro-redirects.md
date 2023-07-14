---
title: "Creating A Redirect in Astro"
slug: creating-a-redirect-in-astro
date: 2023-07-14 11:27:06
tags: 
- frontend
- Astro
- SSG
categories:
- frontend
- css
twitter_text: "Creating A Redirect in Astro"
authors: 
- Ted Krueger
image: https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80
image_url: https://unsplash.com/photos/eMP4sYPJ9x0
image_credit: Alexander Grey
---

We needed to redirect a current URL to a different page. In our case, we wanted `/agenda` to redirect to an event page. So, to explain it like you're a five-year-old, who knows a decent amount of developer knowledge, when someone would go to `website-name.com/agenda` they would _actually_ go to `website-name.com/desired-page`.

Now it looks like you _used_ to be able to do this, and still might depending on your version of Astro. The [Astro.redirect](https://docs.astro.build/en/reference/errors/static-redirect-not-available/) method is depricated as of version 2.6. No worries though. I'll be showing you a different method that Astro reccomends using the `meta refresh attribute`.

Before I get into the nuts and bolts of the post, I must admit that my attention to detail in the Astro docs was pretty lacking because I missed them suggesting the use of the meta refresh. I did, however, see this in [Lloyd Atkinson's post](https://www.lloydatkinson.net/posts/2022/static-site-redirects-with-astro/) on his blog. In his post, Atkinson shows us how he uses the meta refresh attribute to redirect to his latest blog post. In our case, we wanted our redirect to be specific so we didn't need to worry about some of the extra stuff Lloyd was doing.

I decided to start in the file that I would be redirecting from. For this post, I'll create a redirect page.

```
- src
 - pages
  - redirect
   index.astro
```

In here I'll add a `redirect` variable. I want to drive some more traffic to our Pets of RIMdev page so I'll set that url to the value of the redirect. The frontmatter looks like this:

```
const redirect = "/the-pets-of-rimdev"
```

Now that we have our redirect defined we need to get that info to the `Head.astro` component. We pass the parameters to the layout component we are using. In this case, it's our `MainLayout.astro`.

```html
<MainLayout title={title} image={image} redirect={redirect}>
  <h1>Redirects!</h1>
</MainLayout>
```

Let's head to the `MainLayout` and add `redirect` to our props.

```js
const { title, image, authorImage, author, imageCredit, imageUrl, url, redirect } = Astro.props;
```

Our `Head.astro` component is used inside the `MainLayout` file so we need to pass the redirect prop there as well.

```html
<Head title={title} image={image} permalink={url} redirect={redirect} />
```

Inside our `Head.astro` component we want to add the meta refresh tag. 

```html
<!-- redirects -->
{redirect ? (
  <meta 
    http-equiv="refresh" 
    content={ `0; url=${ redirect }` } 
  />
) : null}
```

Here we check for `redirect` because not every page will have one so there's no point to render this. The redirect is used in the `content` which tells the browser what page to redirect to. Check it out [here](/redirect). Pretty cool. 

This definitely works but I feel like we could make it a little better. We can by using [Content Collections](https://docs.astro.build/en/guides/content-collections/) and [Dynamic Pages](https://docs.astro.build/en/core-concepts/routing/#example-dynamic-pages-at-multiple-levels).

## [Using Dynamic Pages](#using-dynamic-pages)

We already have a dynamic page, `[slug].astro`, created for our posts. This allows us to create specific slugs for our posts. We'll use this for our redirects because we'll want to specify slugs for these redirects. Our dynamic page lives right in our `pages` folder. 

```
src
 - content
  - authors
  - posts
  - redirects
 - pages
  [slug].astro
```

Using Content Collections, we have a content folder inside our src directory. This is where we need to create a redirects folder. Inside the redirects folder we can add our files or pages for each redirect. Each file will represent an individual redirect. Because we're using the dynamic `[slug]` page, we can name these .md files anything we want. This will help other devs know what the file is _doing_. So we can name our redirect, `gotopets.md`. 

```
<!-- gotopets.md -->
---
title: "Sample Redirect"
slug: show-me-cute-animals
redirect: 
  url: "/the-pets-of-rimdev"
  timing: null
---
```

I created a redirect object in the frontmatter because I figured why not give someone the option to set the timing for the redirect. It might not always be instant or 0. In the meta tag in the head, however, it will default to 0 unless a timing function is specified. Take a look:

```html
Head.astro

<!-- Add redirect to the list of props -->
const { title, description, image, permalink, redirect } = Astro.props;

<!-- redirects -->
{redirect ? (
  <meta 
    http-equiv="refresh" 
    content={ `${ redirect.timing ? redirect.timing : '0' }; url=${ redirect.url }` }
  />
) : null}
```

Our dynamic `[slug].astro` needs updates too.

```js
export async function getStaticPaths() {
  const entries = [
    ...(await getCollection('posts')),
    ...(await getCollection('redirects')),
  ];
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
```

We need to add `redirects to the entries array. Then we'll wrap our current Post related code checking for the posts collection. We'll do the same thing for collections.

```js
{
  entry.collection === 'redirects' ? (
    <MainLayout
      title={title}
      url={entry.slug}
      redirect={redirect}
    >
      <div class="container" data-pagefind-body>
        <article>
          <Content />
        </article>
      </div>
    </MainLayout>
  ) : null
}
```

Wanna see how it works? So you see how it works I'll add a timing param of 5 seconds. Check this out [show-me-cute-animals](/show-me-cute-animals). 