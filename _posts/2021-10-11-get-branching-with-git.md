---
layout: post
title: "Get branching with Git"
date: 2021-10-11 15:38:53
tags:
- GitHub
categories:
- Tools
- Development
twitter_text: Want a fast and simple naming convention for branches in Git?
authors: "Ted Krueger"
image:
image_url:
image_credit:
---

Ever been confused about naming a branch with <a href="https://git-scm.com/" target="_blank">Git</a>? Looking for a good naming convention? Well, I might have an answer for you. I’m not saying it’s the answer but it hasn’t let me down yet.

I’m that dev who never deletes local branches. Maybe that’s my problem right there. I guess I’m a bit of a branch hoarder. You never know, I might need that branch again. Anyways, the convention I came up with was to name my branches after the <a href="https://github.com/" target="_blank">GitHub</a> issue number I was working on, with my initials as a prefix. The initials help, I think, with visibility within our team. So, a branch name could be as simple as this: `tk-7785`.


This branch naming convention has a couple benefits when it comes to using GitHub. First, it ties the branch directly to the specific issue I’m working on. When bugs might come up during the QA process and I’ve moved on to another issue, I know exactly the branch I need to go back into to make the fix. I don’t need to look for something ambiguous like `responsive-nav-updates`. I’ve used names like that for my branches in the past but, when you don’t delete them regularly you forget which `responsive-whatever-changes` you did the work in. Sure you could look back through the history in the GitHub issue but I’ve found that it’s a heck of a lot quicker to just look at the issue number and boom, I’m there.

The second benefit I’ve found is connecting the issue with the corresponding pull request (PR). I like to add the issue to the PR description. You can do this pretty quickly in GitHub. You just type `#{issue-number}`. So an example would be something like: `Issue: #7768`.

If you’re using an app like ZenHub, like RIMdev uses, then you can also connect the issue using their tool. Again, you connect the issue by the issue number. You can search for the number or the issue name but you already know the number… remember?

<figure>
<img src="/images/pr-example-branch-naming.png" alt="pr issue connect example" style="max-width: 100%">
<figcaption>
Here’s an example of a connected issue to a PR(Pull Request).
</figcaption>
</figure>

This naming convention is probably best for smaller issues. But the key, I think, is to include the issue number. Say you’re working on an Epic with your team. Well that Epic has an issue so you could still create a branch to push to your upstream for others to use. In that case I might do something like `header-redesign-{epic#}`. From here, your team could still create feature branches locally with the subsequent issue numbers, then PR to the epic upstream.

Naming things can be difficult. Finding things with terrible names can be more difficult. In trying to keep it simple, I came up with this method and it helps me keep track of my PRs and issues. I don’t need to put too much thought into it. I know my initials and I know the issue number. 

I hope this helps anyone who might be confused when it comes to naming branches. Let us know in the comments if you have a method you like.

