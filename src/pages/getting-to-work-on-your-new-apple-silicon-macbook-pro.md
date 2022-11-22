---
layout: ../layouts/Post.astro
title: "Getting to work on your new Apple Silicon Macbook Pro"
date: 2022-03-21 08:24:06
tags:
- macOS
- RIMdev
categories: 
- Development
- Tools
twitter_text: Setting up your new M1 Macbook Pro for work
authors: "Kevin Hougasian"
image: https://images.unsplash.com/photo-1644308414850-893551d6d4c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80
image_url: https://unsplash.com/@oww
image_credit: "Geio Tischler"
---
One of the perks being with [Ritter](https://jobs.ritterim.com/), and on the dev team, is you can choose the hardware that makes you happy and productive! Team members have the option of Windows or Mac, with refreshes every 3-4 years. Several Macs were due, but how to move forward? Intel's disappearing for Apple Silicon and we have clear ties to Microsoft in workflow and infrastructure, so waiting a bit on refreshes made sense. 

The wait is officially over! So here's a quick guide for anyone on the frontend upgrading now, or in the future! And by the way, #WorthIt! 

## Tooling
- Chrome (pushed automatically with Edge for macOS)
    - Extensions (core)
        - [Lastpass](https://chrome.google.com/webstore/detail/lastpass-free-password-ma/hdokiejnpimakedhajhdlcegeplioahd?hl=en-US)
        - [Open in Stackedit](https://chrome.google.com/webstore/detail/open-in-stackedit/cfdcfpcdlahjkhliopcmbjillihpmabk?hl=en-US) installs an [Electron](https://www.electronjs.org/) desktop version of [Stackedit.io](https://stackedit.io/) &mdash; if you want a [markdown](https://www.markdownguide.org/) editor other than VS Code
        - [ZenHub for GitHub](https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd?hl=en-US)
        - [Vue dev tools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en-US)
        - [JSON Viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh/related?hl=en-US)
- Microsoft
    - Office 365 (pushed automatically)
    - [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
    - [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver15)
- Adobe Creative Cloud (not common for Frontend - pushed if needed)
- [VS Code](https://code.visualstudio.com/download) - Apple Silicon
- [Docker](https://docs.docker.com/desktop/mac/install/) - Apple Chip
- [Hyper](https://hyper.is/) - Apple Chip (or [terminal](https://iterm2.com/) of your choice 😜)
  - [.zsh config](https://github.com/hougasian/zshrc#wgetcurl) - Apple Silicon Macs default to [Z Shell](https://zsh.sourceforge.io/)
  - Still using a bash shell? [dotfiles](https://github.com/hougasian/dotfiles)!
- [Homebrew](https://brew.sh/) 
    - node
    - tree
    - Powershell (_may_ be needed for some builds) `brew install --cask powershell`
- [npm n](https://www.npmjs.com/package/n) - Node version manager, install globally `npm install -g n`
- [.NET](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) macOS Arm64, Core Runtime & SDK

## Github

New laptop, new SSH key! You'll need to [generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [install](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) a new key for your GitHub account.  

## Static Sites

We run several flavors of [SSG](https://jamstack.org/generators/). If you find yourself working with one of them, you'll need _something_ from the list below 😀 Most of them leverage [Liquid](https://shopify.github.io/liquid/basics/introduction/).

**Before working with _any_ static site**, install [Git Large File Storage](https://git-lfs.github.com/) - Apple Silicon, or `brew install git-lfs`, then initialize with `git lfs install` (you only need to run once per user account - it installs globally)

- Ruby/[Jekyll](https://jekyllrb.com/) - [Installation guide for Apple M1](https://www.earthinversion.com/blogging/how-to-install-jekyll-on-appple-m1-macbook/) 
- [Hugo](https://gohugo.io/)
- [11ty](https://www.11ty.dev/)

## Happy coding with you're new Apple Silicon Macbook! ⌨️
