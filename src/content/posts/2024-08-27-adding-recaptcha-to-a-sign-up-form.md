---
title: "Adding Google's reCAPTCHA To Your Form"
slug: adding-googles-recaptcha-to-your-form
date: 2024-09-06 11:27:06
tags: 
- frontend
- forms
- google
categories:
- frontend
twitter_text: "Keep the bots away. Use Google reCAPTCHA on your forms."
authors: 
- Ted Krueger
image: https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_url: https://unsplash.com/photos/person-using-macbook-pro-npxXWgQ33ZQ
image_credit: Glenn Carstens-Peters
---

Recently I was tasked with adding Google's reCAPTCHA to a couple of forms on one of our static sites. For what it's worth, our site is running on Astro. Just wanted to add that in. Anyway I have no experience with reCAPTCHA so I was thankful that a link to their docs was included in the issue. 

You have some options when using reCAPTCHA. Versions 3 and 2. I opted for reCAPTCHA v2 Invisible. This prevents users from selecting fire hydrents or buses or whatever silly things one needs to click to prove they are a centient carbon based life form.

## Adding Your Domain

One of the first steps is [adding you domain](https://developers.google.com/recaptcha/docs/domain_validation) to your Admin Console in Google. In the console you will need to specify the version you want to use. 

This can all be tested locally too. All you need to do is add `localhost` to the list of domains. Google reccomends using a seperate key for your local environment. This isn't _necesarry_ but Google says it's a good idea.

## The Code

Here's the code inside our form component:
```html
<script type="text/javascript">

  var onSubmit = () => {
      document.getElementById("contact-form").submit()
  };

  var onloadCallback = () => {
      grecaptcha.render('js-form-submit', {
          'sitekey' : 'your_site_key',
          'callback' : onSubmit
      });
  };
</script>

<form
  method="post"
  id="contact-form"
>
  {/* Lots of inputs */}
  <div id="post-registration-form"></div>
  <input
    type="submit"
    id="js-form-submit"
    value="Submit"
  />
</form>

<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
        async defer>
</script>
```

You could simplify this even more. According to google, the simplest way is to [bind reCAPTCHA to a button](https://developers.google.com/recaptcha/docs/invisible#auto_render) on the form. For this approach you will need to add: 
```html
class="g-recaptcha" 
data-sitekey="your_site_key" 
data-callback="onSubmit"
``` 
to your button or input that submits your form. Inside the `onSubmit()` function submit your form.

```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script>
  var onSubmit = () => {
    document.getElementById("contact-form").submit();
  }
</script>

<form
  method="post"
  id="contact-form"
>
  {/* Lots of inputs */}
  <input
    class="g-recaptcha" 
    data-sitekey="your_site_key" 
    data-callback="onSubmit"
    type="submit"
    value="Submit"
  />
</form>
```

That's it really. The [docs on reCAPTCHA](https://developers.google.com/recaptcha/intro) are quite good. Check them out to find the option that works best for you.