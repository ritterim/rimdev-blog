---
layout: post
title: "Building an Online Store with Platform UI and Hugo"
date: 2022-06-16 12:00:00
tags: 
- CSS
- Frameworks
- Static Sites
categories: "Platform-UI"
twitter_text: "Building an Online Store with Platform UI and Hugo"
authors: Ryan Trimble
image: https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80
image_url: https://unsplash.com/photos/c9FQyqIECds
image_credit: "@mikepetrucci"
---

With the release of our CSS Framework, [Platform UI](https://www.platformui.com/), it might be fun to actually build something with it! 

At RitterIM, we have an internal store to buy RitterIM merch, such as shirts, office supplies, and more. Employees can buy products with cash or use "Ritter Bucks". **Ritter Bucks** are not some fancy new crypto-currency, but instead a way to incentivise great work!

The Ritter Store is only at our Harrisburg office, so as the basis of this project: let's build an online store!

## What We'll Use

- [Platform UI](https://www.platformui.com/) - Our latest public release and the CSS framework we use for our applications.
- [Hugo](https://gohugo.io/) - Static Site Generator based on the Go programming language.
- [Snipcart](https://snipcart.com/) - A simple way to add a store to any website.

## Installing Hugo

The first step to working on a Hugo site is installing Hugo. There are a few ways to go about that depending on which operating system you are working on.

For MacOS, make sure you have [Homebrew](https://brew.sh/) setup and run:

```
brew install hugo
```

For Windows, you can install via [Chocolatey](https://chocolatey.org/): 

```
choco install hugo -confirm
```

See the Hugo [installation guide](https://gohugo.io/getting-started/installing) for further information and installation on other operating systems.

## Creating a Hugo Site

Hugo installs on systems globally, so you can now run Hugo commands. 

In your terminal, navigate to the directory you'd like to setup the new site. Once there, run the following command:

```
hugo new site hugo-store
```

This will scaffold a new Hugo project for us. Browse into the new site. Next we will want to create a Hugo theme to use for the store - to do that, run:

```
hugo new theme store-theme
```

Then we can apply that theme by opening the `config.toml` file and adding:

```
theme = "hugo-store"
```

To actually view the Hugo site, we can run the command:
```
hugo server
```

Though there isn't much going on there at the moment, this will start the Hugo server and serve up pages we'll create throughout this project.

Let's add in some content, then we can dive into building out our theme!

## Adding Content

Content in Hugo can be added in many different ways, however one of the simplest approaches is by adding markdown files to the `~/hugo-site/content` directory. Content can also be organized by creating subfolders of the content directory. For our store example, we want to organize products into different categories, such as "Home Goods" or "Office Supplies." Let's begin adding content by setting up our categories.

### Categories

Browse to `~/hugo-site/content` and add folders for:
- Clothes
- Home Goods
- Office Supplies

Inside each newly created category folder, add an `_index.md` markdown file. Each index file will contain very simple front matter:

`~/hugo-site/content/clothes/_index.md`

```md
---
title: Clothes
layout: list
---
```

`~/hugo-site/content/home-goods/_index.md`

```md
---
title: Home Goods
layout: list
---
```

`~/hugo-site/content/office-supplies/_index.md`

```md
---
title: Office Supples
layout: list
---
```

As noted in the markdown file's front matter, each of these pages will use the `list` layout that we will create in just a bit. This is all we will need to add categories. Feel free to add as many categories as you'd like!

### Products

We can now add products inside category folders. For example, let's create a T-Shirt markdown file inside the `clothes` folder:

`~/hugo-store/content/clothes/t-shirt.md`

```md
---
title: T-Shirt
layout: single
id: t-shirt-knight
price: 11
tags:
  - knight logo
image: /images/products/tshirt.jpeg
image_alt: T-Shirt with Knight logo.
---

RitterIM branded, t-shirt with Knight logo.
```

For each product, we are looking to add the following data:
- Title - name of the product.
- Layout - the layout the product page will use, for our demo this will be `single`.
- ID - this is a unique identifier for the product, this will come in handy later when we implement Snipcart.
- Price - the price of the product.
- Tags - used to describe the product, add as many descriptive tags as needed.
- Image - the path to an image of a product. In Hugo, static files such as images get added to the `~/hugo-store/themes/store-theme/static/` directory. I've organized mine to include an `images` folder and a `products` sub-folder.
- Image Alt - this is an alternative text description that gets included on images.

Outside of the front matter, we can include the content of the page. This will reflect as the description of a product shown on our store.

Add as many products as you'd like, I'm going to add the following:
- Clothes
  - Cardigan
  - Hoodie
  - Jacket
  - T-Shirt
- Home Goods
  - Blanket
  - Coaster
  - Frisbee
  - Picture Frame
- Office Supplies
  - Laptop Bag
  - Mouse Pad
  - Notebook
  - Pen

## Building a Theme

Let's set up a simple theme that we can use for our store.

### Adding Platform UI

A super simple way to get started using Platform UI is by [linking to the CDN](https://platformui.com/docs/getting-started/cdn/) via unpkg. 

Browse to the `~/hugo-store/themes/store-theme/layouts/partials/head.html` file and include the CDN like so:

```html
<!-- head.html -->
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="stylesheet" href="https://unpkg.com/@ritterim/platform-ui/dist/platform-ui.min.css" crossorigin>
```

This will include the main CSS stylings for the Platform UI framework. While we are in the `head.html` file, let's add a title for the site:

```html
<!-- head.html -->
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="stylesheet" href="https://unpkg.com/@ritterim/platform-ui/dist/platform-ui.min.css" crossorigin>

<title>Hugo Store</title>
```

Platform UI also includes JavaScript functionality for things like accordions, drawers, and modals. To include this in our site, add the CDN link to `~/hugo-store/themes/store-theme/partials/footer.html`:

```html
<!-- footer.html -->
<script src="https://unpkg.com/@ritterim/platform-ui/dist/js/platform-ui.min.js" crossorigin defer></script>
```

Now we can take advantage of everything Platform UI has to offer!

### Header

We can use Platform UI's [site menu](https://platformui.com/docs/menus/site-menu/) to get this set up. Open up `~/hugo-store/themes/store-theme/partials/header.html` and add in the following:

```html
<!-- header.html -->
<header id="header" class="header site-header background--lightblue">
 <div class="max-container h-100">
   <a class="site-logo p-2 h-100 flex flex--align-center text--bold text--size-lg" href="/">
      Hugo Store
   </a>
 </div>
</header>
````

A quick explanation of what is happening:
- We create a site header by adding the `site-header` class to the `<header>` element.
- We can also set the background color using the `background--lightblue` class. This is part of Platform UI's [color](https://platformui.com/docs/colors/colors/) classes.
- `max-container` on the inner `div` applies a centered, [max-width container](https://platformui.com/docs/layout/max-width/) to the header.
- On the `site-logo` we are applying flex utility classes to center the link text. We are also adding some [typographical](https://platformui.com/docs/typography/typography/) utilities to enlarge (`text--size-lg`) and bold the text (`text--bold`).

For the purposes of this demo, this is all we need, though this could be expanded further by adding in a navigation!

### Category / List Pages

The category pages will be what we use to display all the categories related products. In Hugo, this is as known as a "list" page, as it lists out all the related content. You can rename this file as something other than `list`, but for our example we will keep it as the default.

We can leverage Platform UI's layout [blocks](https://platformui.com/docs/layout/blocks/) to display the products on the page. Blocks enable a responsive grid of rows and columns to create layouts.

Inside `~/hugo-store/themes/store-theme/layouts/_default/list.html`:

```html
<!-- list.html -->
{{ '{{' }} define "main" }}
<article class="max-container pt-4">
  <div class="flex flex--center-content">
    <h2>{{ '{{' }} .Title }}</h2>
  </div>
  <ul class="list block-container blocks tablet-up-2 lg-tablet-up-3 laptop-up-4">

  </ul>
</article>
{{ '{{' }} end }}
```
Here we are outputting the `.Title` of the category and setting up the `block-container` to list products. The `blocks` class enables the mobile-first responsive layout. We can tell the container how many blocks should be in each row at different breakpoints: 

- By default a block will take up 100% of the row, which works well for mobile devices. 
- On tablet and up, `tablet-up-2` specifies that there will be two blocks per row. 
- For larger tablets and up, `lg-tablet-up-3` means there will be three blocks per row.
- Finally for laptop screens and up, `laptop-up-4` will display four blocks per row.

To actually iterate over the products available, we can use Hugo's `range` function. The range we will be looping through is the category's `.Pages`, so inside the `<ul>` we can include the following:

```html
{{ '{{' }} range .Pages }}
  <li class="block">
 
  </li>
{{ '{{' }} end }}
```

This means an `<li>` element will output for each page created within the category. 

As far as actually displaying a product, we can use Platform UI's [card](https://platformui.com/docs/components/cards/) component. We want to include the following information inside the card:
- Product Image (if available)
- Product Title
- Product Description
- Product Sizes
- Product Tags

Let's create a card inside the `<li>` element:

```html
<div class="card m-2">
  {{ '{{' }} with .Params.image }}
    <img class="card__image" src="{{ '{{' }} . }}" />
  {{ '{{' }} end }}
  <div class="card__header flex flex--align-center flex--justify-between">
    <h3 class="product__name text--navy text--bold text--uppercase text--size-md mb-0">
      {{ '{{' }} .Params.title }}
    </h3>
    <span class="product__price text--bold text--navy text--size-md">
      ${{ '{{' }} .Params.price }}
    </span>
  </div>
  <div class="card__content">
    <div class="flex">
      {{ '{{' }} with .Params.tags }} 
        {{ '{{' }} range . }}
          <span class="pill mr-1">{{ '{{' }} . }}</span>
        {{ '{{' }} end }} 
      {{ '{{' }} end }}
    </div>
    <p class="product__description">{{ '{{' }} .Content }}</p>
    <div class="product__button-container">
      <a class="button" href="{{ '{{' }} .Permalink }}">
        View Details
      </a>
    </div>
  </div>
 </div>
```
There is a lot going on here, so let's break a few things down!

On each of the product markdown files, there is some default metadata each product includes, such as `.Content` and `.Permalink`. For more custom data, `.Params` match up to front matter found inside the markdown file.

Depending on the product, you might not have an image or tags params available. To make up for this, we use Hugo's `with` check to see if a parameter exists and display it if so. The `with` check also scopes the contextual data of the param, so it can then be output by using `{{ '{{' }} . }}`.

We are also using Hugo's `range` to output product tags as Platform UI [pills](https://platformui.com/docs/components/pill/).

### Product / Single Pages

Like `list` pages, Hugo uses `single` for individual pages within the site. In our demo, these are pages for specific products. We could rename this page to `product` if we wanted, but for the purposes of the example we will keep it as is.

Single pages are like the `list` file, displaying data and front matter from the markdown files.

Inside `~/hugo-store/themes/store-theme/layouts/_default/single.html` let's add the following markup:

```html
<!-- single.html -->
{{ '{{' }} define "main" }}
 <article class="max-container">
  <section class="block-container">
    <div class="block lg-tablet-up-6 p-4">
      <figure class="figure-hover">
        <img src="{{ '{{' }} .Params.Image }}" alt="{{ '{{' }} .Params.Image_alt }}">
        <figcaption>{{ '{{' }} .Params.Image_alt }}</figcaption>
      </figure>
    </div>
    <div class="block lg-tablet-up-6 my-4">
      <div class="card">
        <div class="flex flex--justify-between flex--align-center border-b border--width-2 border--color-orange mb-3">
          <h1 class="text--bold text--navy">
            {{ '{{' }}.Title}}
          </h1>
          <span class="text--bold text--navy text--size-lg">
            ${{ '{{' }} .Params.Price }}
          </span>
        </div>
        <div class="flex mb-4">
          {{ '{{' }} with .Params.Tags }}
            {{ '{{' }} range . }}
              <span class="pill mr-1"> 
                {{ '{{' }} . }}
              </span>
            {{ '{{' }} end }}
          {{ '{{' }} end }}
        </div>
        <div class="text--size-md">
          {{ '{{' }} .Content }}
        </div>
      </div>
    </div>
  </section>
</article>
{{ '{{' }} end }}
```

We are using an alternative method of Platform UI [blocks](https://platformui.com/docs/layout/blocks/) this time. Instead of defining how many columns to display on the container, we can apply these classes to the actual block elements. We want each block to take up the full row width on mobile, but then switch to 50% width on large tablet viewports and higher. To do this, we can add `lg-tablet-up-6` to the block.

Platform UI has a great [figure-hover](https://platformui.com/docs/components/figure-hover/) component to display the product image. This allows us to display the alt text of the image as a caption.

While displaying the product title, we can add a bottom border using the Platform UI [border](https://platformui.com/docs/utilities/borders/) utilities. Border utilities can determine the side, width, and color of borders.

And just like before, we are using Hugo's `range` function to loop through and output the product tags as Platform UI [pills](https://platformui.com/docs/components/pill/).

### Homepage

To finish up the theme, let's create a homepage!

Our goal for the homepage will be to display a section for all categories and a few products in each. We'll also include a link to view all products within a single category. We can reuse most of what we learned already to accomplish this!

Hugo sets the `~/hugo-store/themes/store-theme/layouts/index.html` as the homepage. 

```html
{{ '{{' }} define "main" }}
<article class="block-container max-container pt-4">
  {{ '{{' }} range .Pages }}
    <section class="category w-100 flex flex--column flex--justify-center mb-4">
      <div class="category__header">
        <h2 class="flex flex--justify-center text--bold text--navy mb-0 pb-0">
          {{ '{{' }} .Title }}
        </h2>
      </div>
      <div class="category__products">
      // Category products will go here!
      <div class="block-container w-100 flex--center-content mt-4 mb-6">
        <a class="button button--salmon text--white button--lg" href="{{ '{{' }} .Permalink }}">
          View All {{ '{{' }} .Title }}
          <i class="pi-arrow-right"></i>
        </a>
      </div>
    </div>
 </section>
 {{ '{{' }} end }}
</article>
{{ '{{' }} end }}
```

The first `range` we'll set up loops through pages within the `~/hugo-store/content` folder. This will display a `<section>` for each of our categories. 

Metadata from the category pages allows us to output the `.Title` and `.Permalink` of the category. We are linking to the category page using a Platform UI [button](https://platformui.com/docs/components/buttons/) and the button includes a Platform Icon. [Platform Icons](https://platformui.com/icons/) are a custom icon font included with Platform UI.

Inside this `range` we will add another `range` to iterate through each of the product pages. Replace the comment `//Category products will go here!` with the following:

```html
<ul class="list block-container blocks tablet-up-2 lg-tablet-up-3 laptop-up-4">
  {{ '{{' }} range first 4 .Pages }}
    <li class="block">
      <div class="card m-2">
        {{ '{{' }} with .Params.image }}
          <img class="card__image" src="{{ '{{' }} . }}" alt="" />
        {{ '{{' }} end }}
        <div class="card__header flex flex--align-center flex--justify-between">
          <h3 class="product__name text--navy text--bold text--uppercase text--size-md mb-0">
            {{ '{{' }} .Params.title }}
          </h3>
          <span class="product__price text--bold text--navy text--size-md">
            ${{ '{{' }} .Params.price }}
          </span>
        </div>
        <div class="card__content">
          <div class="flex">
            {{ '{{' }} with .Params.tags }} 
              {{ '{{' }} range . }}
                <span class="pill mr-1">
                  {{ '{{' }} . }}
                </span>
              {{ '{{' }} end }}
            {{ '{{' }} end }}
          </div>
          <div class="product__description">
            {{ '{{' }} .Content }}
          </div>
          <div class="product__button-container">
            <a class="button" href="{{ '{{' }} .Permalink }}">
              View Details
            </a>
          </div>
        </div>
      </div>
    </li>
 {{ '{{' }} end }}
 </ul>
```

This time we add a parameter to the `range` function of `first 4` - this only outputs the first four product pages. Just like on our other pages, we can list the products metadata and front matter.

At this point, we should have a working website! There is one important piece missing from the store though, the actual store logic. Let's now explore how to add Snipcart!

## Setting up Snipcart

Snipcart is a simple tool to add an online store to any website. As you would expect, you can enable visitors to pay for products online using a credit card. You can also enable promo codes and much more!

Head over to Snipcart's website and [register](https://app.snipcart.com/register) for an account. Snipcart is a paid service for production sites, but provides free usage for development. So until you are ready to actually open up shop, you don't have to spend anything!

After registering, browse to the [API Keys section](https://app.snipcart.com/dashboard/account/credentials) of your account to find your public test API key. This is used to connect your Hugo site to Snipcart.

### Adding Dependencies

Snipcart requires surprisingly little to get running, we will just need to include the following bit of JavaScript in our footer.

Open up `~/hugo-store/themes/store-theme/partials/footer.html` and add JavaScript here:

```html
<!-- footer.html -->
<script src="https://unpkg.com/@ritterim/platform-ui/dist/js/platform-ui.min.js" crossorigin defer></script>
<script>
  window.SnipcartSettings = {
    publicApiKey: "[YOUR API KEY]",
    loadStrategy: "on-user-interaction",
  };

  (function(){var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).currency)!=null||(s.currency="usd");var l,p;(p=(l=window.SnipcartSettings).timeoutDuration)!=null||(l.timeoutDuration=2750);var w,u;(u=(w=window.SnipcartSettings).domain)!=null||(w.domain="cdn.snipcart.com");var m,g;(g=(m=window.SnipcartSettings).protocol)!=null||(m.protocol="https");var f,v;(v=(f=window.SnipcartSettings).loadCSS)!=null||(f.loadCSS=!0);var E=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,y=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(y.forEach(function(t){return document.addEventListener(t,o)}),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],n=document.querySelector("#snipcart"),i=document.querySelector('src[src^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][src$="snipcart.js"]')),e=document.querySelector('link[href^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][href$="snipcart.css"]'));n||(n=document.createElement("div"),n.id="snipcart",n.setAttribute("hidden","true"),document.body.appendChild(n)),$(n),i||(i=document.createElement("script"),i.src="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.js"),i.async=!0,t.appendChild(i)),!e&&window.SnipcartSettings.loadCSS&&(e=document.createElement("link"),e.rel="stylesheet",e.type="text/css",e.href="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.css"),t.prepend(e)),y.forEach(function(h){return document.removeEventListener(h,o)})}function $(t){!E||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
</script>
```

Replace `[YOUR API KEY]` with the public test API key provided in your Snipcart account.

### Add to Cart Button

The add to cart button could potentially be used in many places, so it would be a great time to build a Hugo partial.

Browse to `~/hugo-store/themes/store-theme/layouts/partials/` and create a file called `add-to-cart.html`.

Inside this file, lets add the following button:

```html
<!-- add-to-cart.html -->
<button
 class="snipcart-add-item buy-button button button--salmon text--white my-3"
 data-item-id="{{ '{{' }} .Params.id }}"

 {{ '{{' }} if .Params.Image }}
  data-item-image="{{ '{{' }} .Params.Image }}"
 {{ '{{' }} end }}

 data-item-name="{{ '{{' }} .Title }}"
 data-item-price="{{ '{{' }} .Params.Price }}"
 data-item-url="{{ '{{' }} .Permalink }}"
 data-item-description="{{ '{{' }} .Content }}"
>
  Add to Cart
</button>
```

Snipcart utilizes data attributes on the add to cart button to discover what products get added to the cart. We can use the same product metadata and front matter params we set up to pass along this information. We are conditionally passing over an image, if it is present.

With the partial added, it can now be included inside layout files. We will want to add this in a few spots: products displayed on the home page, category list page and the product's single page.

Open `~/hugo-store/themes/store-theme/layouts/index.html` and add the partial beside the "View Details" button.

```html 
<div class="product__button-container">
 {{ '{{' }} partial "add-to-cart" . }}
 <a class="button" href="{{ '{{' }} .Permalink }}">
     View Details
 </a>
 </div>
```

The exact same thing can happen inside `~/hugo-store/themes/store-theme/layouts/default/list.html` for category pages.

Finally, let's add the partial on the single product page, by opening `~/hugo-store/themes/store-theme/layouts/default/single.html` and including it after the `.Content` section:

```html
<div class="text--size-md">
 {{ '{{' }} .Content }}
</div>

{{ '{{' }} partial "add-to-cart" . }}
```

Now when visitors click the "Add to Cart" button, the product will be added to the cart. This will also open the Snipcart drawer to display all of the cart information.

### View Cart Button

We want to include a button that allows visitors to open the cart at anytime. This can easily be added to the theme by adding a button inside the `~/hugo-store/themes/store-theme/layouts/default/_baseof.html` file. 

Right before where we include the `footer` partial, let's add the button like so:
```html
<div class="snipcart-checkout pos-fix pin-bottom pin-right mr-4 mb-4">
 <button class="snipcart-summary button button--lg button--salmon text--white">
  <span class="mr-2 flex flex--align-center">
  <span class="ml-2">Cart: </span>
  </span>
  <span class="snipcart-total-price"></span>
 </button>
</div>
```

With Platform UI's [position](https://platformui.com/docs/utilities/position/) utilities, we can fix the button to the bottom right of the viewport with `pos-fix pin-bottom pin-right` classes. 

Snipcart's JavaScript will update the `snipcart-total-price` to display the current total cart cost. Now clicking the button will open the cart, allowing visitors to checkout!

## Wrapping Up

With Snipcart now integrated into our Hugo site, we have a fully-functioning online store! We could expand the store in a few different ways as well:
- Options for product sizes, colors, and more.
- Better navigation to allow for easier browsing around.
- Store search functionality.
- A footer that provides more information.

I definitely encourage exploring things further, but this should be a great baseline example for setting up an online store with Platform UI, Hugo, and Snipcart. 

If you would like to view the completed code, please check it out over on [Github](https://github.com/mrtrimble/hugo-store)!