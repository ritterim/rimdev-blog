---
title: "Converting MP4 To Webm Using FFMPEG and Bash"
slug: converting-mp4-to-webm-using-ffmpeg-and-bash
date: 2016-11-11 08:58:15
twitter_text: "Converting #MP4 to #Webm Using #ffmpeg and #bash #video"
authors: 
- Khalid Abuhakmeh
tags:
- jekyll
- video
- bash
categories:
- Development
video: /video/rain
---
 
We just recently added [video headers]({% post_url 2016-11-10-adding-video-backgrounds-with-jekyll-front-matter %}) to our blog because videos are awesome. We wrote a `bash` script to convert `MP4` videos to `Webm` videos to make the experience of adding a new video header easy for our writers. We are also taking the first frame of the video for a poster image. A pre-requisite is that you will need [ffmpeg](https://www.ffmpeg.org/) installed. For macOS users, you can use the following [Homebrew](https://brew.sh) command.

```
> brew install ffmpeg --with-libvpx --with-libvorbis --with-fdk-aacc
```

Note the dependencies required to convert a video to `Webm`. Now for the fun part, the bash script.

```
#!/bin/bash
# macOS Users : Install ffmpeg via homebrew
#  > brew install ffmpeg --with-libvpx --with-libvorbis --with-fdk-aacc

# stop script on errors
set -e

function convert_mp4_to_webm
{
    if [ ! -f "${1%%.mp4}.webm" ]; then
       echo "Converting $1"
       ffmpeg -y -i "$1" -vframes 1 -f image2 "${1%%.mp4}.jpg"; i=$((i+1))
       ffmpeg -y -i "$1" -c:v libvpx -crf 30 -b:v 1M -an "${1%%.mp4}.webm"       
    else
        echo "Skipping $1"
    fi
}

VIDEOS=./video
cd "$VIDEOS"
for item in *.mp4; do
    convert_mp4_to_webm "$item"
done

exit
```

This script will loop through a directory and **only** convert videos to webm that have not already been converted previously. 

There are a few things this script is doing that you should know:

- Audio is removed from the `Webm` version (not needed for header)
- The poster image is a `jpg`
- Conversion speeds depend on your GPU / CPU speed 

I would like to thank Thomas Harold for lending me his `bash` expertise.