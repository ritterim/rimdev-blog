---
title: "Back To Basics: HTML Forms"
slug: back-to-basics-html-forms
date: 2017-10-06 11:21:43
tags:
- HTML
- Web
categories:
- Development
twitter_text: "Back To Basics: #HTML Forms"
authors: 
- Khalid Abuhakmeh
image: https://farm4.staticflickr.com/3194/5707515437_b747f8a064_b_d.jpg
image_url: https://www.flickr.com/photos/emilianohorcada/
image_credit: Emiliano Horcada
---

In the whirlwind that is modern web development, I thought it would be a great idea to revisit one of the fundamental parts that make the web work: HTML Forms.

## FORM tag

The `form` tag allows developers to pass user data from the client browser to the server. An HTML form has many attributes, which when utilized correctly can make the life of a developer easier. I will focus on the attributes you may likely use.

- `action`: defines where the form is sending the information.
- `method`: The method could be `GET` or `POST`. 
- `target`: Where should the response be made visible. Options include `_blank`, `_self`, `_parent`, or `_top`.
- `name`: Name of the form sent to the server.

{: .ui.info.message}
**Developer's forget that the FORM tag supports both `GET` and `POST`. Utilize `GET` more for search forms and you'll get the benefit of history for free!

## Inputs

There are many inputs in HTML and using them effectively is up to you (and your frontend team). The most important thing to remember is this.

{: .ui.info.message}
Remember to set the `name` on the input field, and the field is not disabled.

With these attributes set, you can now pass information to the server.

```
<input type='text' name='PhoneNumber' />
```

The `name` attribute is the key used in the request to the server application. If it is not specified, the server will not receive your value.

## Buttons

Buttons are recognized as inputs. That means they can have similar attributes as an input tag.

```
<button type="submit" name="ThisButton" value="Yes" />
```

These values are sent to the server and can be used to determine which button was pressed by the user and if that button possesses a value.

## Conclusion

It is easy to get caught up with the modern web-dev stack. Remembering that most of the web operates on simple HTML forms and leveraging forms properly can make a seemingly complicated task relatively simple. At risk of sounding like a broken record: "Use the right tool for the job" and HTML Forms frequently are the right tool.