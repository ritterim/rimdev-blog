---
title: "Material design-like form animations for Semantic UI"
slug: material-design-like-form-animations-for-semantic-ui
date: 2017-08-01 16:10:36
tags:
- UI
- Sass
- Semantic UI
categories:
twitter_text: Material design-like form animations for SemanticUI by @hougasian
authors: 
- Kevin Hougasian
image: https://farm5.staticflickr.com/4251/34994103880_a30e49caa5_b.jpg
image_url: https://flic.kr/p/VjiVUC
image_credit: eugenuity
---

We decided not to use Material Design (#reasons) while re-developing our core application suite, although i really miss MD's micro-interactions that happen in forms. Semantic UI, while it's feature rich and easily pluggable, lacks these.

So let's recreate them within @SemanticUI. We need to consider Semantic UIs structure, specifically, the `field` wrapper, and, to make this pure css, we need to leverage html5's `:valid`. But every field is initially valid you say? That's the rub, we have to trigger invalid on an empty field by making them `required`.

## Input

<div class="ui form demo">
  <div class="field">
    <input type="text" required>
    <label>Email</label>
  </div>
  <div class="field">
    <input type="password" required>
    <label>Password</label>
  </div>
</div>
<div class="caption">
  <i class="olive internet explorer icon"></i>
  <i class="olive microsoft edge icon"></i>
  <i class="olive safari icon"></i>
  <i class="olive firefox icon"></i>
  <i class="olive chrome icon"></i>
</div>

```html
<form class="ui form">
  <div class="field">
    <input type="text" required>
    <label>Email</label>
  </div>

  <div class="field">
    <input type="password" required>
    <label>Password</label>
  </div>
</form>
```

```sass

.ui.form {

  // Starting with .field, let's set the position of our wrapper
  .field {
    position: relative;
    width: 100%;

    &:not(.checkbox) {
      margin-top: 1rem;
      margin-bottom: 1.7rem;
    }

    // Now to position our `label` and style it more as the
    // native `placeholder`
    label {
      color: lightgrey;
      position: absolute;
      left: .7rem;
      top: .7rem;
      transition: .2s ease-in;
    }

    // Next, `input`, so it's barely visible on any background
    // excluding checkbox and we'll add textarea
    input:not([type=checkbox]),
    textarea {
      background: transparent;
      border: none;
      border-bottom: 2px solid lightgrey;
      border-radius: 0;
      padding: .7rem;
      transition: .2s ease-in;

      &:focus ~ label,
      &:valid ~ label {
        color: grey;
        font-size: 80%;
        top: -1rem;
        left: 0;
      }

      &:focus {
        border-bottom: 2px solid dodgerblue;
        outline: none;
      }
    }
  }
}
```

And since we added `textarea`...

<div class="ui form demo">
  <div class="fluid field">
    <textarea required></textarea>
    <label>Start typing here...</label>
  </div>
</div>
<div class="caption">
  <i class="olive internet explorer icon"></i>
  <i class="olive microsoft edge icon"></i>
  <i class="olive safari icon"></i>
  <i class="olive firefox icon"></i>
  <i class="olive chrome icon"></i>
</div>

## Select

<div class="ui form demo">
  <div class="field select">
    <select required>
      <option value=""></option>
      <option value="">Outlook good</option>
      <option value="">Reply hazy try again</option>
      <option value="">Don't count on it</option>
    </select>
    <label>Magic 8-ball says</label>
  </div>
</div>
<div class="caption">
  <i class="yellow internet explorer icon"></i>
  <i class="yellow microsoft edge icon"></i>
  <i class="olive safari icon"></i>
  <i class="olive firefox icon"></i>
  <i class="olive chrome icon"></i>
</div>


```html
<form class="ui form">
  <div class="field select">
    <select required>
      <option value=""></option>
      <option value="">This is a selected option</option>
    </select>
    <label>Select</label>
  </div>  
</form>
```
```sass
.ui.form {
  .field {
    position: relative;
    width: 100%;

    &:not(.checkbox) {
      margin-top: 1rem;
      margin-bottom: 1.7rem;
    }

    label {
      color: lightgrey;
      position: absolute;
      left: .7rem;
      top: .7rem;
      transition: .2s ease-in;
    }

    // Now we're adding a .select class to .field
    &.select {
      display: flex;

      &:after {
        align-self: center;
        color: lightgrey;
        content: "\f107";
        // Semantic UI sets Font Awesome family name to Icons ;)
        font-family: "Icons";
        margin-left: -1rem;
      }

      select {
        background: transparent;
        border: none;
        border-bottom: 2px solid lightgrey;
        padding: .7rem 2rem .7rem .7rem;
        position: relative;
        border-radius: 0;
        transition: .2s ease-in;
        -webkit-appearance: none;
        -moz-appearance: none;

        &:focus {
          outline: none !important;
          border-bottom: 2px solid dodgerblue !important;
        }

        &:focus ~ label,
        &:valid ~ label {
          color: gray;
          font-size: 80%;
          top: -1rem;
          left: 0;
        }
      }
    }
  }
}
```

{: .ui.info.message}
[Chrome and Safari both ignore border-radius on select elements unless -webkit-appearance is overridden to an appropriate value.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)

## Checkbox

Now for the bonus round! And unless you're on a `-webkit` or `-moz` browser, IOW, not `IE` or `Edge`, _you just can't do this_. Ironically, `IE` mobile supports the feature using `-webkit-appearance`.

This entire CSS trick hinges on `-prefix-appearance: none`, and, as luck would have it, [`appearance` has been dropped from the CSS3 spec](https://wiki.csswg.org/spec/css4-ui#dropped-css3-features). It will probably re-appear in CSS4-UI spec. We'll see...anyway.

<div class="ui form demo">
  <div class="field checkbox">
    <input type="checkbox" required>
    <label>checkbox one</label>
  </div>
  <div class="field checkbox">
    <input type="checkbox" checked required>
    <label>checkbox two</label>
  </div>
</div>
<div class="caption">
  <i class="red internet explorer icon"></i>
  <i class="red microsoft edge icon"></i>
  <i class="olive safari icon"></i>
  <i class="olive firefox icon"></i>
  <i class="olive chrome icon"></i>
</div>

```html
<form class="ui form">
  <div class="field checkbox">
    <input type="checkbox" required>
    <label>checkbox</label>
  </div>  
</form>
```
```sass
// Now we're adding .checkbox to .field
.ui.form {
  .field {
    position: relative;
    width: 100%;

    &:not(.checkbox) {
      margin-top: 1rem;
      margin-bottom: 1.7rem;
    }

    label {
      color: lightgrey;
      position: absolute;
      left: .7rem;
      top: .7rem;
      transition: .2s ease-in;
    }

    &.checkbox {
      align-items: flex-start;
      align-content: flex-start;
      display: flex;
      margin: .7rem 0;
      position: relative;

      input[type=checkbox] {
        padding: .7rem;
        border: 2px solid lightgrey;
        transition: .2s ease-in;
        -webkit-appearance: none;
        -moz-appearance: none;

        &:focus {
          outline: none;
        }

        &:before {
          color: grey;
          content: "";
          transition: .2s ease-in;
        }

        &:checked {
          padding: .6rem .35rem;
          margin: -.3rem .1rem 0 .7rem;
          border-left: none;
          border-top: none;
          transform: rotate(45deg);
        }
      }

      label {
        font-size: initial;
        position: static;
        margin-left: 1rem;
        align-self: center;
      }
    }
  }  
}
```  
[<i class="codepen icon"></i> View it all on CodePen](https://codepen.io/hougasian/pen/JydJBZ)
