---
layout: ../layouts/Post.astro
title: "Adding Mermaid To RIMdev.io"
date: 2017-03-03 15:25:51
tags:
- Jekyll
categories:
twitter_text: "Adding #mermaid to https://rimdev.io"
authors: Khalid Abuhakmeh
image: https://farm3.staticflickr.com/2127/2067252947_fcaa9ca286_z_d.jpg?zz=1
image_url: https://www.flickr.com/photos/21333256@N08/
image_credit: Ryan McCullah
---

A picture is worth a thousand words, so I assume a diagram is worth a **billion** words. Expressing our ideas is important and our blog is an outlet to not only share with our teammates, but the broader community of readers. [Mermaid](https://knsv.github.io/mermaid/) is a simple markdown based diagramming language with a compelling result.

Placing the following html in our posts...

```html
<div class="mermaid">
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
</div>
```

results in the wonderful diagram below.

<div class="mermaid" style="text-align:center">
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
</div>

Additionally, I can create diagrams like this.

<div class="mermaid">
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
</div>
