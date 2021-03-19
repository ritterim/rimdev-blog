---
layout: post
title: "Prettifying Long Commit Histories with Git"
date: 2021-03-17 11:34:00
tags:
- Documentation
- GitHub
- Git
categories:
- Documentation
- GitHub
- Git
twitter_text: Prettifying Commit Histories 
authors: Steliana Vassileva
image: /images/documentation/git-commit-history.png
image_url: https://tugberkugurlu.blob.core.windows.net/bloggyimages/d773c1fe-4db8-4d2f-a994-c60f3f8cb6f0.png
---

We often use GitHub to create a compare view, and list pull requests (PRs) for releases. However, GitHub limits the number of commits you can view at a time. If the difference between hashes is greater than 250 commits, you're delivered a disappointing message.

![GitHub Most Recent 250 Commits](/images/documentation/github-compare-most-recent-250-commits.png)

When you write release notes, you may need to view the entire list of commits and pull requests. Recently, a helpful **git log** option provided a more efficient solution.

## The git log basics

The **git log** command [shows commit logs](https://git-scm.com/docs/git-log). Without any arguments, we use it to view commit history, with the most recent commits displaying first. SHA-1 checksum, author, date, and commit message are usually included.

However, numerous options can make the **git log** command more robust. These helpers can narrow down, embellish, or prettify results.

Here we focus on the **oneline** option, which serves as a shorthand for:

`--pretty=online --abbrev-commit`

## Time for some Git magic

With the steps below, you can generate a complete list of PRs in your command-line interface (CLI). The assumption is that the upstream **master** branch is the source of truth for your project and the development branch.

1. Navigate to the local repository for your project.
2. To sync your local **master** branch, pull the latest from the upstream **master** branch.
3. For the comparison, we're working with the two branches and the commit graph below. The tips of these two branches are part of the **master** branch history.

    ![GitKraken Sample Commit Graph](/images/documentation/gitkraken-commit-graph-git-log-oneline-example.png)

4. Find the older hash. In the real world, this could be the latest commit deployed in production. In our example, the value **2f380ba** is the last commit for the 2021-03-08 production branch.
5. Similarly, get the more recent hash, which theoretically represents the tip of your release branch. In our example, the value **14fbcce** is the last commit for the 2021-03-10 release branch.

6. After gathering all details, run the command below in the **master** branch of your local repository:

    `git log --oneline 2f380ba..14fbcce | grep 'Merge pull'`

7. Pull requests between the two hashes display one per line. The **grep** option lets you search keywords in commit messages. Therefore, you're able to isolate just the PRs, without worrying about the 250 commit limit.

    ![git log --online](/images/documentation/git-log-oneline-output.png)

## The caveat

The above example is straightforward, only taking into account a linear commit history. Ancestry can also play a role. Additionally, the two-dot versus three-dot notation between hashes makes a difference.

For more on this topic, check these resources:

* [Git Basics - Viewing the Commit History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
* [Git Log Cheatsheet](https://devhints.io/git-log)
* [Git Revisions Cheatsheet](https://devhints.io/git-revisions)
* [Listing Commits Between Two Commit Hashes in Git](https://stackoverflow.com/questions/18679870/list-commits-between-2-commit-hashes-in-git/18680059#18680059)
* [Revision Range Notations](https://git.logikum.hu/tutorials/revisions/range-notations)