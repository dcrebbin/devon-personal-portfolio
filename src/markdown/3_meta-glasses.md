---
title: Meta Glasses GPT Vision API
website: null
timelineLink: Meta Glasses GPT Vision API
openSource: https://github.com/dcrebbin/meta-vision-api
videoDemoId: PiEDrcLCmew
layout: ../layouts/MarkdownHighlightsLayout.astro
subtitle: Hacky API for the Meta Glasses to use GPT Vision
coverType: video
---
This project uses the latest version of the **Meta Rayban Smart Glasses** and the GPT vision API to automatically log your food via a voice command.

I achieved this by exploiting the **Meta Glasses** ability to send photos to your friends on Messenger via a voice command. i.e: "Hey Meta, send a photo to John blahblah".

All I needed to do, was to create a fake Facebook account (*sorry fb TOS*) that sounded similar to "My Food log" and have a listener attached to that account which would trigger anytime I would send a photo to it.

From there I sent the photo to OpenAI and stored the response in a fake **myfitnesspal** web app I made for this demo (due to no **MFP** public API)

This project went semi-semi viral on [Hacker News](https://news.ycombinator.com/item?id=38457815) and in turn got me noticed by some people from the **Meta Reality Labs** team who then offered me an interview.

I had never done leet-code before and so for this particular opportunity the timing did not work out.

I will defeat DSA eventually though!
