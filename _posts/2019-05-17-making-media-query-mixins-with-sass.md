---
layout: post
title: "Making Media Query Mixins with SASS"
date: 2019-05-17 10:33:33
tags:
- SASS
categories:
- css
twitter_text: "Making Media Query Mixins with SASS"
authors: Ted Krueger
image: https://images.unsplash.com/photo-1523901839036-a3030662f220?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80
image_url: https://unsplash.com/photos/cixohzDpNIo
image_credit: Siora Photography
---

If you’re like me, you aspire to write clean and consistent scss. We use the power of scss for everything from nesting our selectors, creating variables, and making mixins for reusable code. Let’s take a look at how you can create a mixin to simplify writing our media queries.

I wanted something that made it easier for me to add media queries to our code but I got sick of always writing out `@media (min-width: 768px) {}`. That might not seem like a ton of code to write but in our case when we set up a map of the breakpoints we want to use, it gets a little cumbersome writing out the specific screen size you want. 

```css
// A map of breakpoints.
$breakpoints: (
  mobile: 768px,
  laptop: 1240px,
  desktop-lg: 1800px
);
```

Here we define the specific screen sizes that we consistently target with our media queries. So, with these in mind we would write media queries that would look like this…

```css
.class {
  @media (max-width: map-get($breakpoints, laptop) - 1) {
    display: block;
  }
  
  @media (min-width: map-get($breakpoints, laptop)) {
    display: block;
  }
}
```

Which renders…
```css
@media (max-width: 1239px) {
  .class {
    display: block;
  }
}
@media (min-width: 1240px) {
  .class {
    display: block;
  }
}
```

Notice the `- 1` in the max-width media query. This is key to avoid conflicting code at the specific screen resolution of 1240px wide. Wouldn’t it be nice if there was something that could do this but be more concise? I think it would.

```css
@mixin breakpoint($breakpoint, $direction) {

    // Get the breakpoint value.
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    
    @if $direction == max {
        @media (max-width: ($breakpoint-value - 1)) {
            @content;
        }
    }
} 
```

With this we can now write max-width media queries like this…

```css
.class {
    @include breakpoint(laptop, max) {
        display: block;
    }
}
```

Which will output…
```css
@media (max-width: 1239px) {
    .class {
        display: block;
    }
}
```

The mixin traverses the `$breakpoints` map and grabs the value we need. The mixin then subtracts `1px` value to prevent the issue I mentioned above. 

For a min-width example we add…
```css
@mixin breakpoint($breakpoint, $direction) {

    // Get the breakpoint value.
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    
    @if $direction == min {
      @media (min: $breakpoint-value) {
        @content;
      }
    }
} 
```

So for our laptop resolutions we would right something like…
```css
.class {
    @include breakpoint(laptop, min) {
        display: block;
    }
}

```

Rendering…
```css
@media (min-width: 1240px) {
    .class {
        display: block;
    }
}
```

Wow. That seems to work pretty well for the sizes we defined in our map. But what about the sizes we didn’t define. What if there is one example where you need a media query, whether it be a min-width or max-width, but you don’t see the need to add a variable to the breakpoints map because you’re only going to use it once? No problem. 
```css
@mixin breakpoint($breakpoint, $direction) {
  @if map-has-key($breakpoints, $breakpoint) {

    // Get the breakpoint value.
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    
    @if $direction == max {
      @media (max-width: ($breakpoint-value - 1)) {
        @content;
      }
    } @else if $direction == min {      
      @media (min-width: $breakpoint-value) {
        @content;
      }
    } 
  
  // If the breakpoint doesn't exist in the map.
  } @else {
    @if $direction == max {
      @media (max-width: $breakpoint) {
        @content;
      }
    } @else if $direction == min {      
      @media (min-width: $breakpoint) {
        @content;
      }
    }  
  }
}
```

You can see here that we add an if statement that checks the value of our `$breakpoint` parameter to see if it’s in the map. If it is, business as usual. If it’s not in the map, no sweat, the mixin will simply output the value of the parameter you use when you call the mixin. 
```css
.class {
    @include breakpoint(1200px, min) {
        display: block;
    }
}

```

Outputs…
```css
@media (min-width: 1200px) {
    .class {
        display: block;
    }
}
```

For max-width...
```css
.class {
    @include breakpoint(1200px, max) {
        display: block;
    }
}

```

Outputs…
```css
@media (max-width: 1200px) {
    .class {
        display: block;
    }
}
```

Notice, here we’re not calculating `1px` less than the value because that’s really up to you in this case.

Awesome! We can now write fast and easy media-queries using our predefined screen widths. We’re forgetting some other options, though. What about for those times when we want something to happen between specific resolutions. So say only for larger mobile devices but not laptop users. No problem. We do this by nesting the mixin calls. Let me show you.

So we need our element to be hidden for larger mobile devices only.
```css
.class {
    @include breakpoint(phone, min) {
       @include breakpoint(laptop, max) {
            display: none;
        }
    }
}
```

Outputs…
```css
@media (min-width: 768px) and (max-width: 1239px) {
    .class {
        display: none;
    }
}
```


Last but not least, we add a little something extra for media queries that aren’t based on width.

For when the size parameter is in the `$breakpoints` map...
```css
@media ($direction: $breakpoint-value) {
    @content
}
```

For when the parameter isn’t in the `$breakpoints` map…
```css
@media ($direction: $breakpoint) {
    @content
}
```

With this added to the mixin logic, we can target things like orientation, or max-height.
```css
.class {
    @include breakpoint(landscape, orientation) {
        display: block;
    }
}
```

Outputs…
```css
@media (orientation: landscape) {
  .class {
    display: block;
  }
}
```



Putting it all together…

```css
// A map of breakpoints.
$breakpoints: (
  mobile: 768px,
  laptop: 1240px,
  desktop-lg: 1800px
);

@mixin breakpoint($breakpoint, $direction) {
  @if map-has-key($breakpoints, $breakpoint) {

    // Get the breakpoint value.
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    
    @if $direction == max {
      @media (max-width: ($breakpoint-value - 1)) {
        @content;
      }
    } @else if $direction == min {      
      @media (min-width: $breakpoint-value) {
        @content;
      }
    } @else {
      @media ($direction: $breakpoint-value) {
        @content
      }
    }
  
  // If the breakpoint doesn't exist in the map.
  } @else {
    @if $direction == max {
      @media (max-width: $breakpoint) {
        @content;
      }
    } @else if $direction == min {      
      @media (min-width: $breakpoint) {
        @content;
      }
    } @else {
      @media ($direction: $breakpoint) {
        @content
      }
    }
  }
}
```

Happy sassing!










