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

if ! type ffmpeg > /dev/null; then echo "You need to install ffmpeg" ; fi

VIDEOS=./video
cd "$VIDEOS"
for item in *.mp4; do
    convert_mp4_to_webm "$item"
done

exit
