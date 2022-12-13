---
layout: ../layouts/Post.astro
title: "Using Sass Maps to Extend Bootstrap"
date: 2018-10-12 11:28:03
tags:
- sass
categories:
- css
twitter_text: "Using Sass maps to extend @getbootstrap #sass"
authors: Kevin Hougasian
image: https://farm3.staticflickr.com/2238/2348956889_ae2a24afdc_b.jpg
image_url: https://www.flickr.com/photos/neilspicys/
image_credit: Neils Photography
---

If you're not familiar, or just haven't used Sass maps, here's your chance to dive in.

Our latest static site was built on [Jekyll](https://jekyllrb.com/) using [Bootstrap](https://getbootstrap.com). Sass maps helped us extend Bootstrap to include branded colors while keeping the familiar bootstrap naming conventions.

Sass maps let you group variables to retrieve individually using `map-get` and loop through each key/pair value to create a group of styles based on your map.

Grouping vars like `$brand-colors` and `$fonts` keeps everything in one place, easily accessible. Adding the front-matter `---` bars also lets us pull any Jekyll `site` vars from the config file.

```
---
# css
---
// Brand colors
$brand-colors: (
  'grey':    #3D4D55,
  'lt-grey': #bfc0bf,
  'sage':    #9DAF92,
  'salmon':  #F48B7F,
  'magenta': #F4526A,
  'yellow':  darken(#FBCCAD,10%),
  'white':   white
);

// Fonts per branding guide
$fonts: (
  'base': #{'Open sans', sans-serif},
  'headline': #{'Sanchez', serif},
  'size': 1.2rem
);

$slideAnimationDuration: .2s;
$logo: '{% raw %}{{ site.logo }}{% endraw %}';
```

Using Bootstrap's `.btn` and  `.btn-primary` naming convention, we wanted to extend that structure to include buttons for all of the brand colors. Being that we had access to all of our brand colors in one place, why not add a few other niceties at the same time?

```
@each $name, $color in $brand-colors {

  // set brand colors as backgrounds
  .#{$name} {
    background-color: $color;
  }

  // set a lighter background for jumbotron overlays
  .overlay-#{$name} {
    background-color: lighten($color, 15%);
  }

  // extend .btn
  .btn-#{$name} {
    background-color: $color;
    border: .1rem solid darken($color, 7%);
    color: map-get($brand-colors, 'white');
    transition: .3s;
    &:hover {
      background-color: darken($color, 7%);
      border-color: lighten($color, 7%);
      color: map-get($brand-colors, 'white');
    }
  }

  // extend text color
  .#{$name}-text {
    color: $color;
  }
}
```

Using our Sass map, we looped through each color and  were able to quickly generate 35 new classes based on our `$brand-colors` map. All with minimal effort.

What are you going to do with Sass maps?
