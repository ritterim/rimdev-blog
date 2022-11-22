---
layout: ../layouts/Post.astro
title: "Making .NET Core Global Tools Work With OhMyZsh"
date: 2019-03-07 14:32:09
tags:
- .NET
- macOS
categories:
- .NET
- macOS
twitter_text: "Making @dotnet #global #tools work with #ohmyzsh #xplat #macos"
authors: Khalid Abuhakmeh
image: https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80
image_url: https://unsplash.com/photos/IoQioGLrz3Y
image_credit: Juliana Kozoski
---

I was trying to get a global .NET Core tool working on my development machine, which just so happens to be running macOS. I also work with [OhMyZsh](https://ohmyz.sh/) inside of [iTerm2](https://iterm2.com/). Every time I would invoke the global tool I would get the following error:

```
➜ dotnet-project-licenses --help
zsh: command not found: dotnet-project-licenses
```

To fix this problem, I had to make sure that the `.dotnet/tools` directory was exported into my path. I can fix that by modifying my `~/.zshrc` file with the following lines.

```
# dotnet global tools
export PATH="$PATH:$HOME/.dotnet/tools"
```

After restarting my terminal window, I was able to access all the .NET global tools I had installed. I hope this helps.