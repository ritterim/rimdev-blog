---
layout: post
title: "Install Hugo (Extended) Latest With Shell Script For macOS"
date: 2018-08-01 12:57:37
tags: development
categories:
twitter_text: "Install @GoHugoIO #extended latest with shell script for #macOS"
authors: Khalid Abuhakmeh
image: https://farm8.staticflickr.com/7147/6407182535_1ab673c605_b_d.jpg
image_url: https://www.flickr.com/photos/gerr-bon/
image_credit: Gerry & Bonni
---

We are living on the bleeding edge that is [Hugo's](https://gohugo.io) release cycle. To keep our macOS development environments up to date we wrote this shell script.

To take advantage of our work, put the following script into a file called `hugo_latest.sh`.

```shell
# hugo_latest.sh
# Find the latest Hugo from GitHub
echo '🐹 Starting Hugo Install / Update 🐹'
echo '      Note: Please be sure to have curl and grep installed'
echo ''

url=$(curl -s "https://api.github.com/repositories/11180687/releases/latest" | grep -o 'https://.*hugo_extended.*_macOS-64bit.tar.gz')
echo '✅ Found latest version'

curl -s $url -L -o hugo_latest.tar.gz
echo '✅ Download complete: ' $url

tar -zxf hugo_latest.tar.gz -C /usr/local/bin
rm /usr/local/bin/README.md
rm /usr/local/bin/LICENSE
echo '✅ Extracted to /usr/local/bin'

rm hugo_latest.tar.gz
echo '✅ Removed downloaded artifacts'

echo ''
echo '👉 Current Version' $(hugo version)

echo ''
echo '🎉🎉🎉 Happy Hugo-ing! 🎉🎉🎉'
```

Save this file as `hugo_latest.sh` and run `chmod +x hugo_latest.sh`. Then run `./hugo_latest.sh`. The output will look something like this:

![hugo script run]({{ "/images/hugo_script.png" | absolute_url }})

Now you can keep your development environment always running on the latest. This script will look at GitHub releases and always overwrite your current version locally.

Note: You can always update the script to get the *regular* version, but we prefer the *extended* version. You will also need `curl` and `grep` installed.