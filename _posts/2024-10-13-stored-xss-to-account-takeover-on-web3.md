---
title: "Stored XSS to Account Takeover on Web3"
date: 2024-10-13 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

Hey hunters, hope you're all doing well. Today I want to share my story about how I discovered a Stored XSS vulnerability that allowed full account takeover (ATO) on a Web3 website.

![image](/assets/img/how_i_found_a_stored_0.jpg)

## The Beginning

I was browsing through programs on HackenProof when I noticed a target with a wildcard scope:

```
*.site.com
```

It already had over 100 reports submitted. My initial thought was that it might be heavily tested and difficult to find something new, but I decided to take a look anyway.

Like most bug hunters, I began by testing the login and signup functionality. The security there seemed solid, and I didn't find any immediate vulnerabilities. I assumed this was going to be a challenging target.

## The Unexpected Lead

While exploring the main site, I came across a community post section where users could share questions, tips, and discussions. This immediately caught my attention because any feature that allows user-generated content is a potential place for injection vulnerabilities.

## The First Test

I decided to start small and test for basic HTML injection using a simple payload:

```
<b>test</b>
```

I posted it, navigated to my profile, and viewed the post. The HTML rendered exactly as I had entered it. This was a clear indication that the input was not being properly sanitized.

## Moving to XSS

Next, I tried a reflected XSS payload, and it worked.

At this point, I wanted to determine the full impact, so I used my XSS payload designed to send session data to my server. I injected the payload into a post and visited it:

```
// "><script>...</script>
```

Each time I viewed my own post, my server received the cookies and session tokens. This confirmed that if any other user, including administrators, viewed the post, I could compromise their account.

![image](/assets/img/how_i_found_a_stored_1.jpg)

## The Impact

By exploiting this issue, I could:

- Steal session cookies and tokens from any user who viewed the post.
- Hijack accounts, including those with administrative privileges.
- Access sensitive personal data stored in the account.

This meant a complete account takeover was possible.

## The Report and Outcome

I submitted a detailed report including:

- The affected endpoint: `https://www.site.com/microapps/en-us/xxxxxx/xxxxxxx/`
- Steps to reproduce.
- A proof-of-concept showing the data being exfiltrated.

The team confirmed the vulnerability, fixed it, and awarded me **$1,500**.

## Recommendations

- Sanitize and escape all user-generated content before rendering.
- Use a library such as DOMPurify to filter HTML and JavaScript.
- Implement a strict Content Security Policy (CSP).
- Validate input on both the client and server sides.
- Use HTTP-only flags for sensitive cookies to prevent client-side access.

## Takeaway for Bug Hunters

Not all vulnerabilities are hiding in login pages or critical functionality. Sometimes the most impactful issues are buried in community or user-interaction features. Always test features where users can post, comment, or upload content.