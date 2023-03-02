---
title: "Letting SASS build your utility classes"
slug: letting-sass-build-your-utility-classes
date: 2019-03-06 14:24:18
tags:
- SASS
categories: 
- CSS
twitter_text: "Letting SASS build your utility classes"
authors: 
- Kevin Hougasian
image: https://images.unsplash.com/photo-1504976462146-b05639c41c8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80
image_url: https://unsplash.com/photos/_5-Y5ECcoLo
image_credit: "@enriqueflores"
---

We've moved around CSS frameworks in the past few years, [Semantic UI](https://semantic-ui.com/) for our application layer, and [Bootstrap](https://getbootstrap.com/) for our static sites. As our needs and applications continue to grow, we're placing more demands on these frameworks and it can get a bit hacky.

We're beginning to build our own framework, but there are parts of each we'd like to incorporate. Let's look at spacers (margins and padding) first...

Looking at how bootstrap built their map, we added spacing closer to our needs:

```css
$spacer: 1rem;
$spacers: (
  0: 0,
  1: ($spacer * .25),
  2: ($spacer * .5),
  3: $spacer,
  4: ($spacer * 2),
  5: ($spacer * 3),
  6: ($spacer * 4.5),
  7: ($spacer * 6.5)
);
```

We're also also building utility classes for borders, so we'll use that as well:

```css
$xy-border: (
  top: t,
  right: r,
  bottom: b,
  left: l
);
```

Now let's loop through both maps and add key value pairs for margin and padding:

```css
// set key value pairs for margin and padding
@each $prop, $letter in (margin: m, padding: p) {

  // loop through top, right, bottom, and left
  @each $direction, $d in $xy-border {

    // loop through the spacers we've set
    @each $unit, $rem in $spacers {
      .#{$letter}#{$d}-#{$unit} {
        #{$prop}-#{$direction}: #{$rem};
      }

      // add in x-axis and y-axis spacing
      .#{$letter}x-#{$unit} {
        #{$prop}: 0 $rem;
      }
      .#{$letter}y-#{$unit} {
        #{$prop}: $rem 0;
      }
    }
  }
}
```

Nested looping has now generated 192 unique utility classes for us 😃. Here's a [Gist](https://gist.github.com/hougasian/63b519f6d74674087de5dcdac5ad7861) showing the output.
