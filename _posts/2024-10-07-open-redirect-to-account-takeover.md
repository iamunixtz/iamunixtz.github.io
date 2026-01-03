---
title: "Open Redirect To Account TakeOver"
date: 2024-10-07 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---


![image](/assets/img/bughunting_image_0.jpg)

### The Discovery
Found an open redirect on MyTrainPal's login page using the `next` parameter.

### The Exploitation
Leveraged the open redirect to execute JavaScript (`j%09avascript:`) to steal cookies and send them to a Requestbin.

### Impact
Could lead to session hijacking and full account takeover.
