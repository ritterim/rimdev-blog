---
layout: post
title: My Current GitHub Command Line Workflow
date: 2017-06-23 10:30:00
tags:
- GitHub
categories:
- development
twitter_text: "My Current GitHub Command Line Workflow"
authors: Ken Dale
---

[![Git](https://imgs.xkcd.com/comics/git.png)](https://xkcd.com/1597/)
[https://xkcd.com/1597/](https://xkcd.com/1597/){: .caption}
{: .ui.center.aligned.container }

While I generally don't do that, here's what I currently do:

# Setting up a repository locally

Using [Stuntman](https://github.com/ritterim/stuntman) as an example:

```
> git clone git@github.com:kendaleiv/stuntman.git
> cd stuntman
> git remote add upstream git@github.com:ritterim/stuntman.git
> git fetch upstream

This will instruct `git pull` to pull from the `upstream` repository:

> git branch --set-upstream-to=upstream/master
OR
> git branch --set-upstream-to=upstream/development
depending on what the default branch is.

> git pull
```

# Favor `rebase` over `merge`

I rarely use `git merge` -- generally only when the situation requires it. I generally use `git rebase` to bring my feature branches up to date when needed.

```
> git checkout development
> git pull
> git checkout feature-branch
> git rebase development
```

# Feature branches in `upstream`

Branching is as simple as `git checkout -b feature-branch`. However, when it's a branch that exists in `upstream` you may want to do this:

```
> git checkout -b feature-branch upstream/feature-branch
```

This way you can `git pull` to get the latest from the `upstream` repository.

Wondering if the current local branch is tracking upstream? Use `git branch -vv`!

# When in doubt, use explicit `git push`

While `git push` without any arguments may work, if you aren't absolutely certain where you'll be pushing to it's a good idea to be explicit.

```
> git push origin feature-branch
```

I haven't been in the habit of using this implicitly at all, but maybe I should.

**Tip:** If you aren't sure what will happen, add `--dry-run` to the command.

# Other

My personal `.gitconfig` is published at [https://github.com/kendaleiv/dotfiles/blob/master/.gitconfig](https://github.com/kendaleiv/dotfiles/blob/master/.gitconfig) -- feel free to use it. Be sure to change the `name` and `email`. 🙂

How do you use GitHub? Let us know in the comments!
