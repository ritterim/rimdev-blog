---
layout: post
title: "Understanding Dart Sass modules and namespaced variables"
date: 2019-11-01 11:48:26
tags:
- Sass
- Dart Sass
categories: CSS
twitter_text: "Understanding Dart Sass modules and name spaced variables"
authors: Kevin Hougasian
image: https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=1000
image_url: https://unsplash.com/photos/W8KTS-mhFUE
image_credit: "@billy_huy"
---

For a long time, we were dependent on the CSS frameworks of others -- and we were quite happy. 😀

As our needs grew, we needed a framework that suited all of them. So we created [Platform UI](https://style.rimdev.io), our custom framework written Sass, BEM, and vanilla JS for our static sites and application platform.

Sass recently launched the new [Dart Sass module system](https://github.com/sass/dart-sass/releases/tag/1.23.0), which [Miriam Suzanne](@mirisuzanne) did a great job of introducing in a recent [CSS-Tricks post](https://css-tricks.com/introducing-sass-modules/).

One of the largest considerations was the move away form `@import` in favour of the `@use` rule. `@import` places all variables, mixins, and functions into the global scope creating confusion at times as to the origin of that-thing-your-trying-to-call.

Based on this, and Miriam's post, we were prompted to do two things:

1. Convert our framework to Dart-Sass 1.23.0.
1. Introduce a config file for anyone wanting to leverage our framework in their project.

Here are some of the things we learned along the way...

## @use and namespacing

> The @use rule loads mixins, functions, and variables from other Sass stylesheets, and combines CSS from multiple stylesheets together. Stylesheets loaded by @use are called "modules." Sass also provides built-in modules full of useful functions.

Moving away from `@import` and `@include` wasn't difficult; getting used to including files we needed to use was. Now all variables in our `_config.scss` and `_variables.scss` files needed to be included with `@use`.

The config file is a single file. `@use 'config';` Done.
Our variables, however, are arranged in a file structure called with `@use` and an `_index.scss` in the `/variables` folder. We then `@forward` variables for use elsewhere.

```css
// /variables/_index.scss
@forward "color";
@forward "flex";
@forward "spacing";
@forward "typography";
```

This structure allows `@use 'variables` to skip the folder and go directly to the index as a single source of truth. Win!

If you don't want to type `variables` everywhere, you can also `@use 'variables' as vars` and call `vars.$myVar`.

## Using built-in modules

Since we'll be checking the `_config.scss` file first, we don't have access to all of our variables. What we do have are maps that someone may, or may not, choose to use.

Here is an example of using our colors:

```css
// _config.scss

$brand-colors: (
  'navy':   #003f70,
  'salmon': #e58967,
  'brown':  #866657,
  'orange': #f48418
) !default;
$secondary-colors: (
  'red':    tomato,
  'olive':  #b5cc18,
  'yellow': #FBBD08
) !default;
```

What if someone has no use for a `$secondary-colors` map? We should make sure it's there.

Calling built-in modules, we're going to use at the top of the file. `@use` rules must come before any rules other than `@forward`, so it's safe to add at the top of the file and will load it's module once in the compiled CSS output, no matter how many times it's loaded.

```css
@use 'sass:map';
@use 'sass:meta';
```

Now we can use them in the file.
First declaring an empty map, then looking for the `$secondary-colors`, which is in the scope of the current file. Note we're looking for `'secondary-colors'` now without the `$` sign.

```css
$config-colors: () !default;
```

If `true`, merge our color maps. If `false`, merge our first map `$brand-colors` with the empty map we created with `$config-colors`. Why not just `$config-colors: $brand-colors;`?

That will become clear once we're out of the config file.

```css
@if meta.variable-exists('secondary-colors') {
  $config-colors: map.merge($brand-colors, $secondary-colors);
} @else {
  $config-colors: map.merge($brand-colors, $config-colors);
}
```

We now have a larger map that we can loop through once to generate all of our color utilities later on.

## Checking for created maps

We may or may not have created _any_ colors in our config file. If we didn't, Platform UI comes out-of-the-box in greyscale for all of you _noir_ fans.

So how do we check now that we're in a different file? In Dart Sass 1.23.0, not all variables fall into the global scope.

Fist adding the modules we're going to use, ours and built-ins. Our `$greyscale` map is in `_variables.scss` so we now have to call it as a module.

```css
// _colors.scss

@use "config";
@use "variables";
@use "sass:map";
@use "sass:meta";
```

Again, how do we check to see if `$config-colors` has been populated in the config file? `meta.variable-exists()` will only work on locally scoped variables. You can't `meta.variable-exists('variables.greyscale')` it doesn't take namespacing into consideration.
As we did above, we're going to create an empty map for all colors.

```css
$all-colors: () !default;
```

And check for what type of map `config.$config-colors` is.

```css
@if meta.type-of(config.$config-colors) == 'map' {
  $all-colors: map.merge(config.$config-colors, variables.$greyscale);
} @else {
  $all-colors: map.merge(variables.$greyscale, $all-colors);
  @warn "$config-colors is empty.";
}
```

If `config.$config.colors` was never populated, `meta.type-of(config.$config-colors)` will return a type of `list`. So from here, we know we can continue either with the colors from the config file or as the default color scheme of `$greyscale`.

## Lighten, darken, and math

One of the last changes that affected our codebase was the shift of `lighten($color, $percentage)` and `darken($color, $percentage)`. Darken still exists, but there's a more accurate way to darken a color now.
Now we call colors and math as built-ins, so once again, `@use`-ing them at the top of the file and lighten is now `color.adjust($color, $precentage)`.

With a more complex variable setup, we needed to go a bit further with also changed our `$hue-threshold: 10%;` to `$hue-threshold: .1;` which now requires the built-in math module.

So we ended on the following:

```css
// _buttons.scss
@use 'variables';
@use 'sass:color';
@use 'sass:math';
@use 'sass:map';
...
&:disabled {
  background-color:
    color.adjust(map.get(variables.$greyscale, 'light' ),
    $lightness: math.percentage(variables.$hue-threshold));
...
```

Darken is still supported, although `color.scale` offers a true percentage of the color to darken: `color.scale(#036, $lightness: -#{$percentage})`

```css
...
color:
  color.scale($background,
  $lightness: math.percentage(-config.$hue-threshold));
...
```

## Summary

The new Dart Sass module system has offered us better methods to accomplish the goals of our framework as it continues to grow. The port provides greater transparency into variables and _where_ we're calling other files.

The conversion was relatively straight-forward and offered us the opportunity to review our current code base and shift core concepts while not altering the resulting compiled CSS.

I encourage all to embrace Sass modules! Here are a few links to get you can get started:

- [Sass docs](https://sass-lang.com/documentation)
- [Sass blog: The Module System is Launched](http://sass.logdown.com/posts/7858341-the-module-system-is-launched)
- [Sass: Breaking changes](https://sass-lang.com/documentation/breaking-changes)
- [Sass migration tool](https://sass-lang.com/documentation/cli/migrator)
