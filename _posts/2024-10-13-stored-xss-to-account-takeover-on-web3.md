---
title: "Stored XSS to Account Takeover on Web3"
date: 2024-10-13 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---


![image](/assets/img/bughunting_image_0.jpg)

### Discovery
Found a community post section on a Web3 platform that didn't sanitize HTML. 

### Exploitation
Injected a stored XSS payload using a video tag and exfiltrated cookies to a server. This allowed for full account takeover of any user viewing the post.

### Outcome
Reported to HackenProof and awarded $1,500.
