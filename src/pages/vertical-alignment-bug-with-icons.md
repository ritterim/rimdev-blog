---
layout: ../layouts/Post.astro
title: "Vertical Alignment Bug with Icons"
date: 2022-07-07 12:00:00
tags:
- CSS
- UI/UX
categories: "Platform-UI"
twitter_text: "Vertical Alignment Bug with Icons"
authors: Austin Asbury
image: https://images.unsplash.com/photo-1527276826904-9c2275f441e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80
image_url: https://unsplash.com/photos/8OECtq8rrNg
image_credit: "@visualsbydil"
---

If you have been working with an icon set and noticed that your icons are not vertically centered, then you are not alone. I was working on a separate issue when I just happened to notice that the icons inside our circular pills were just barely off center, raised about 1px from where they should be. 

![off center icon](/images/vertical-alignment-bug-with-icons/raised-carrot.png){: .border .w-5 }

You might be saying to yourself, "I have never seen this, what is this guy talking about?" This is only an issue with WebKit browsers such as Chrome and Safari. This is also not an issue if you are running macOS. So if you are running Firefox on a Windows OS, or running an Apple machine, you wouldn't notice anything. 

My first instinct was that the CSS to center the icon within the circle must not be setup correctly. I checked and sure enough the appropriate Flexbox properties were being applied that would center an `<i>` within a `<div>`. The next step was to do some research and see if anyone else was having this problem, and I was able to find an open <a href="https://github.com/FortAwesome/Font-Awesome/issues/16495">Github issue</a> with FontAwesome. This is where I discovered the reason we don't see this in every browser. It is because line-height is calculated differently between the different browsers for their layout algorithms. 

Now that we understand that this is an issue with how browsers calculate the default line-height, we just need to set a default line-height on the affected icons. This will stop the browser from setting a line-height on its own. I chose to set the `line-height: 1.5`. This gave me the desired look of the icon being centered. 

![centered icon](/images/vertical-alignment-bug-with-icons/centered-icon.png){: .border .w-5 }

As you can see the icon is now perfectly centered within the circle. Even though this was a small and almost unnoticeable bug, it can make the world of difference when someone is viewing a website. A clean and functioning UI is about all the little things coming together seamlessly to create a great user experience.
