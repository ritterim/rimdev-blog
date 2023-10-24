---
title: "Tips to git good with git"
slug: git-workflow
date: 2023-10-24 12:00:00
tags:
- git
categories:
- git
twitter_text: "Some helpful tips and commands to manage your git workflow."
authors: 
- Jaime Jones
image: https://images.unsplash.com/photo-1604918598683-28d4e6e2986d?auto=format&fit=crop&q=80&w=3570&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_url: https://unsplash.com/photos/black-bare-tree-under-white-sky-during-daytime-Ku-1SYS0o7k
image_credit: Mila Tovar
---

Whether you love it or hate it, it's undeniable that git (or your source control of choice, but this post is about git, so git on outta here if you use something else) is an integral part of our lives as developers. There are a lot of ways to manage respositories and codebases, but the [forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) is the workflow that has worked for me and for our team with only minimal nuclear level resets required. Who here has had to delete and refork a repository and then clone it down fresh again? If that's been you (don't worry, it's probably been all of us at some point), maybe this post can help.

## Managing repositories

### The commands
- `git clone {url}` - clones down a respository
- `git remote add {name} {url}` - sets a new remote with the given name

### The workflow
- Fork the repository from your organization to your own github account
- Clone down your fork of the repository using `git clone {fork url}`
- Add your organization's copy of the repository as a remote with the desired name (we always use `upstream`) using `git remote add {name} {main repo url}`

### The general idea

You should always have your own fork of your organization's repository that you can do your work from. This isolates your work from the organization's codebase which adds a layer of protection. If you use `upstream` as the name of the organization's copy of the repository, you'll end up with two remotes (the codebase stored on github) to manage. You'll have `origin` which is your copy and you'll have `upstream` which is the organization's copy.

## Navigating branches

### The commands
- `git checkout {branch}` - moves to an existing branch of the provided name
- `git checkout -b {branch}` - creates a new branch with the provided name, using the current branch as the base
- `git branch -d {branch}` - deletes the branch with the provided name from your local machine
- `git push origin :{branch}` - deletes the branch from your github

### The workflow
- When creating a new feature branch, you'll want to create it off of your master (or feature) branch, like so:
```
git checkout master
git checkout -b my-feature
```
- When cleaning up old branches, you can get a look at your branches with `git remote show origin` and then delete them with the above commands, like so:
```
git remote show origin
git branch -d my-feature
git push origin :my-feature
```

### The general idea

Your work should never be done on your own master branch. Your work should be done on a branch that you've created using your master branch (once it's up to date with the upstream - keep reading for that section!) as a base. These commands will help with moving between branches, creating new branches, and cleaning up stale branches. You can view your existing branches with `git remote show origin` which will show the branches in your fork.

## Contributing to codebases

### The commands
- `git add .`
- `git commit -m "message"`
- `git push -u origin {branch}`

### The workflow
- When you're ready to commit your changes, first run `git add .` to stage all files that have been modified, deleted, or added
- Add a meaningful message with `git commit -m "message"` describing the changes
- Push those changes from your local up to your origin with `git push -u origin {branch}` (the `-u origin {branch}` _can_ be left off if you've run it before)

### The general idea

This is likely a process you're already very familiar with, that of adding, committing, and pushing up so that you can make a pull request from your fork to the organization's repository. There are some shortcuts that can be done here such as skipping the add and committing with `-am` instead, but this only stages files that have been modified or deleted, not new files, so I tend to always use the full `git add .` command.

You can also leave off the `-u origin {branch}` portion if you have run it before as that portion sets what remote branch your `git push` command will default to. I tend to always include it just out of habit, but it isn't necessary for each push.

## Keeping your origin and local up to date

### The commands
- `git fetch {remote name}`
- `git merge {branch} --ff-only`
- `git push`

### The workflow (adjust remote and branch names as needed to match your own)
- Checkout your origin `master` branch with `git checkout master`
- Fetch the latest code from the organization's respository with `git fetch upstream`
- Add the latest code from the upstream to your origin with `git merge upstream/master --ff-only`

### The general idea

Code changes from your entire team should be going into the upstream. But if you're always working from your origin, then you need to keep it up to date with those changes. To do so, checkout your origin's master (or main, whatever you have opted to call it) branch with `git checkout master`. Get your local copy of your upstream up to date with `git fetch upstream`. This leaves you free to then add the changes from the upstream to your origin with `git merge upstream/master --ff-only`. If you follow this workflow, you should always be simply adding changes that have occurred after on top of your current codebase, making it a relatively pain-free process.

If there is a feature branch on the upstream that you need to manage, you can do so similarly. First you'll checkout the upstream's copy of that branch, then create your own off of it. You can then repeat the above steps to keep that branch up to date as well. Let's look at an example where we may have a larger feature branch called `feature-branch` (yes, very creative, I know).

```
git fetch upstream
git checkout upstream/feature-branch
git checkout -b feature-branch
git push -u origin feature-branch
```

Now we have a copy of the feature-branch, created from the upstream's version of it as a base. We can then rinse and repeat the above workflow as needed to keep it up to date before creating our own branch off of it to work from, knowing that our chances of having to deal with a rebase are low:

```
git checkout feature-branch
git fetch upstream
git merge upstream/feature-branch --ff-only
git checkout -b my-enhancement
```

## But what about... rebases 🙀

I know, I know, I shouldn't have said it (written it?). It's a word that likely conjures fear and dread - _rebase_, the developer's mortal enemy. The good news? Most team members should not be having to deal with too large of rebases. There's still the occasional one that will come up just based on the nature of teamwork and the inevitability of the same files being touched at some point.

The exception to nice, small rebases are those team members who may have to maintain a feature branch with changes from the master branch. If the person this falls to is you, I'm sorry. But I can hopefully provide a couple of tips to make it a little easier.

For the sake of these tips, we'll be referencing `feature-branch` and `master` again.

- If you need to pull changes from one branch to another, you'll want to checkout the branch whose changes you want to bring in, then rebase it with the branch you want to bring those changes to. In the example below, we're bringing changes from `master` into `feature-branch`:
```
git fetch upstream
git checkout upstream/master
git checkout -b rebase-with-feature-branch
git rebase upstream/feature-branch
```
- Once you are in the rebase, there might be A LOT of more outdated commits to step through if you haven't kept up with this process. I find in cases like this, it helps to view the up to date files for each branch in github so you can more easily envision what the final product should look like.
- The more often you run through these rebases, the smaller and more managable they will be. It's natural to fall behind at times, and I have certainly had my fair share of rebases with hundreds upon hundreds of commits to comb through, but if you can manage to keep up with it on a weekly or bi-weekly basis, it makes the rebases a lot shorter and easier.
- It's helpful for the person rebasing if your team can write meaningful commit messages and strike a balance around [over-committing and under-committing](https://www.youtube.com/watch?v=Uo2RjwwUuLo&t=28s).

## Conclusion
Git is something that takes time to learn, and this post really just scratches the surface of the commands you'll generally use as you go through your day to day. Hopefully this can help provide a bit of structure, and as you use git more and more, you'll get more comfortable, and eventually you can be the team member who feels comfortable enough to manage those nasty rebases or hop on calls to fix branches that may have gone off the rails.

