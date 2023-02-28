---
layout: post
title: "z-index Is Confusing, but It Doesn't Have to Be"
date: 2019-11-25 16:16:51
tags:
- CSS
categories: CSS
twitter_text: "z-index Is Confusing, but It Doesn't Have to Be"
authors: Ted Krueger
image: https://images.unsplash.com/photo-1573257318420-b9e47a6f816e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80
image_url: https://unsplash.com/photos/4n4Yz0wGLDc
image_credit: Eric Prouzet
---

<style>
    .annoying {
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0px 0px 20px 2px rgba(0,0,0,0.4);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 10rem;
        width: 60rem;
        position: fixed;
        left: 50%;
        bottom: 10rem;
        z-index: 999;
        transform: translateX(-50%);
        padding: 1rem;
    }
    .annoying.is-hidden {
        display: none;
    }
    .annoying p {
        font-size: 2rem;
        font-weight: 600;
    }
    .annoying__buttons {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .annoying__button {
        -webkit-appearance: none;
        appearance: none;
        background-color: #84c2ff;
        border-radius: 0.5rem;
        color: #fff;
        font-weight: 600;
        padding: .5rem;
        min-width: 10rem;
        transition: all ease .2s;
    }
    .annoying__button:hover {
        background-color: #fff;
        color: #84c2ff;
    }
    .annoying__button--secondary {
        background-color: #fff;
        color: #84c2ff;
    }
    .annoying__button--secondary:hover {
        background-color: #84c2ff;
        color: #fff;
    }
    .annoying__button:last-of-type {
        margin-left: 2rem;
    }
</style>

For the longest time, I was guilty of thinking I knew how `z-index` really worked. I was mistaken. I never really took the time to research how it actually worked. I believe a lot of front end devs are guilty of the same thing when they're starting out. If we want an element to stack above another we use `z-index`. Simple, right? Give it a little `z-index`. Wait, why didn’t that work? It needs to be higher. Really high, in fact. Let’s give it `z-index: 999` yeah that ought to do it. Not necessarily. 

Maybe, most importantly, we should first understand the default stacking order of elements, even without a specified `z-index`. Simply put, elements are ordered from bottom to top. So the next sibling element in the dom will stack on top of the previous. Think about it like solitaire. When you deal out the cards, the first is laying on the table. As you find relevant cards, you place them next, and on top of the previous card.

<figure>
    <img src="https://cardgames.io/solitaire/images/solitaire-logo.png" style="max-width: 100%">
    <figcaption>
        In Solitaire, the cards stack with the most recent card on top of the pile.
    </figcaption>
</figure>

Ok, that’s great that we got that out of the way, but let’s get to examples of those times when we have an element that needs to be stacked over another and `z-index: 9999` is not cutting it.

I think the problem occurs most of the time when you have specifically positioned elements throughout the page. Maybe you have a fixed header or an aside text block with absolute positioning. Layouts like this can make for a complicated stacking order along the z-axis because defined position values, other than `position: static`, affect the stacking order. Position values like `fixed` and `absolute`, remove elements from the order of the dom, which can add to the complication of z-axis stacking.

Without any specified `z-index`, the default stack occurs as previously mentioned. If any element in the stack receives a position value of absolute, relative, or fixed, that element will appear on top of the stack, or closest to the screen, so to speak.

For example, say we have a site with a flyout in the header. To keep it simple, nothing on this page has a specified `z-index` value. 

<p class="codepen" data-height="562" data-theme-id="light" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="GRRbveG" style="height: 562px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="z-index layout -1 ">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/GRRbveG">
  z-index layout -1 </a> by Ted (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<p></p>

When the flyout is open, it appears over the container below even though it doesn’t have a `z-index` value. This is because, to position the header flyout absolute to the parent header, it's best to give the header a `position: relative`. Now that the `header` has a specific position value, the stacking order changes. So the flyout wins and displays on top of the page.

Say we want to add a side block in the container below and, for argument’s sake, we need to position it in the top left corner of its parent container. In order to do this, we should add `position: relative` to the container.

<p class="codepen" data-height="562" data-theme-id="light" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="xxxoLMg" style="height: 562px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="z-index layout - 2">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/xxxoLMg">
  z-index layout - 2</a> by Ted (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<p></p>

Now we have two elements with specified positions so, the last positioned element wins. In this case, it’s the container with `position: relative`. But now our layout is broken. Now we should add a `z-index` value to the flyout.

<p class="codepen" data-height="562" data-theme-id="light" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="vYYQxKB" style="height: 562px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="z-index layout">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/vYYQxKB">
  z-index layout</a> by Ted (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<p></p>

We give the header flyout a `z-index: 1` and the stacking order changes again.

## Nested z-index Values
The stacking can get really confusing when you have nested components that have specific `z-index` values.

<p class="codepen" data-height="562" data-theme-id="light" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="qBBzXNb" style="height: 562px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="nested components - 1">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/qBBzXNb">
  nested components - 1</a> by Ted (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<p></p>

In the example above, we have an `aside` that contains two blocks. Both of which are positioned absolute. The `side block` is positioned absolute as well and is a sibling of the `aside`. The side block has a `z-index: 5` and the `aside` has `z-index: 1`. I can’t think of a good reason why this would be, other than it helps me get my point across. So just go with it. Because of these values, you can see that anything inside the `aside` will not stack above the `side-block` no matter how high you make the `z-index`. 

I think this is where most devs get really confused. This is why we see code in our css like:
```
.example {
  z-index: 9999;
}
```
Again, the higher the `z-index` the closer in the stack. Yes. As long as the higher `z-index` is on the right element. In the example above, there are a couple of fixes we could do. 

We could remove the `z-index` from the `aside`. This would make the `z-index: 20` on the `.block-1` take effect and stack `.block-1` above `side-block`.
Increase the `z-index` value of the `aside`. As long as it is greater or equal to its sibling, in this case, `.side-block`, then we will get the desired stacking order.

<p class="codepen" data-height="562" data-theme-id="light" data-default-tab="result" data-user="PhiloBeddoe" data-slug-hash="zYYXdxq" style="height: 562px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="nested components">
  <span>See the Pen <a href="https://codepen.io/PhiloBeddoe/pen/zYYXdxq">
  nested components</a> by Ted (<a href="https://codepen.io/PhiloBeddoe">@PhiloBeddoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
<p></p>

I think we let `z-index` be overly complicated because we don’t truly understand how it works. To this day, I am still humbled by `z-index` sometimes. You can give something a huge `z-index` value but, without a position other than static, the stack won’t change. The deeper the nesting in the dom, and the more elements positioned differently on the page, the more complicated the stacking order can be. 

I hope this helped. Good luck `z-index`-ing.

For another great post on `z-index`, check out <a href="https://twitter.com/pomerantsevp?lang=en" target="_blank">Pavel Pomerantsev’s</a> <a href="https://www.smashingmagazine.com/2019/04/z-index-component-based-web-application/" target="_blank">Smashing Article</a>.


<div class="annoying is-hidden" id="origin">
    <p>Isn't z-index a pain?</p>
    <div class="annoying__buttons">
        <button class="annoying__button" data-answer="yes">Yes</button>
        <button class="annoying__button annoying__button--secondary" data-answer="no">It's not so bad</button>
    </div>
</div>

<script>
    function annoying() {
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }
        let hideDialog = localStorage.getItem('hideDialog');

        if (typeof hideDialog !== 'undefined' && hideDialog !== null) {
            return;
        } else {
            document.getElementById('origin').classList.remove('is-hidden');
            function setClick(container) {
                let btn = container ? container.querySelectorAll('.annoying__button') : document.querySelectorAll('.annoying__button')
                btn.forEach(x => {
                    x.addEventListener('click', function(e) {
                        addDialog(e.srcElement);
                    })
                })
            }
            function insertAfter(el, referenceNode) {
                referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
            }
            function addDialog(el) {
                if(el.dataset.answer == 'yes') {
                    let annoying = document.querySelectorAll('.annoying')
                    annoying.forEach(x => {
                        x.remove()
                    })
                    localStorage.setItem("hideDialog", true);
                } else {
                    var left = Math.floor(Math.random() * 30) + 10;
                    var bottom = Math.floor(Math.random() * 30) + 10;
                    var origin = document.getElementById('origin');
                    var content = origin.innerHTML;
                    var newDialog = document.createElement('div');
                    newDialog.className = 'annoying';
                    newDialog.style.cssText = `bottom: ${bottom}rem; left: ${left}rem;`
                    newDialog.innerHTML = content;
                    insertAfter(newDialog, origin);
                    setClick(newDialog);
                }
            }
            setClick();
        }        
    }
    annoying(); 
</script>
