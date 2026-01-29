---
title: "Exposing Broken Access Control in Salesforce"
date: 2024-10-11 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

# Exposing Broken Access Control in Salesforce: How Public Aura Endpoints Leaked Sensitive Data

How I Discovered a Broken Access Control Vulnerability that Leaked Sensitive Data

![Salesforce Aura – broken access control](/assets/img/exposing_broken_acce_0.jpg)

Hello Folks

While exploring Salesforce deployments during a focused research session, I uncovered a significant misconfiguration that allowed **unauthenticated access to internal Salesforce data** through publicly exposed Aura endpoints.

In this post, I'll walk you through how I discovered the issue, what made it possible, and how teams can prevent these kinds of exposures. If you're a bug bounty hunter, security engineer, or developer working with Salesforce, this post is for you.

### Understanding the Aura Framework

Salesforce Lightning apps are built using a client-side framework called **Aura**. It enables dynamic interfaces using backend data, fetched via structured requests sent to specific endpoints like:

- `/aura`
- `/sfsites/aura`
- `/s/sfsites/aura`

These endpoints process requests that return Salesforce object data—like User records or Documents—for use in the frontend. Normally, these should only be accessible by authenticated users with the correct permissions.

But what happens when a Salesforce site is misconfigured?

### The Vulnerability: Broken Access Control

While testing the public-facing instance at `example.com` (domain name changed for responsible disclosure), I found that all three Aura endpoints mentioned above were:

- Accessible to guest (unauthenticated) users
- Capable of processing backend data requests
- Returning sensitive internal object data via POST requests

This was a textbook case of **Broken Access Control**: the Salesforce site was unintentionally exposing backend data to the public due to over-permissive guest user settings.

### What I Could Access

Through this vulnerability, I was able to:

- Query Salesforce objects such as `User`, `ContentDocument`, and custom objects
- Retrieve metadata and sensitive details like:
  - Internal Salesforce user IDs
  - Email addresses
  - Document titles
  - Creation and modification timestamps

In short, data that should be strictly private was being returned without any login requirement.

### Technical Breakdown and Exploitation

I created a Python script ([poc.py](https://github.com/iamunixtz/salesforce-pwn)) that automates the entire attack chain. Here's a step-by-step breakdown of how the script works:

1. **Endpoint Discovery** — The script scans the base domain for known Aura endpoint paths. If it detects a valid Aura response (`aura:invalidSession`, `aura.context`, etc.), it flags the endpoint as vulnerable.

2. **Aura Context Generation** — A GET request to the base path retrieves values like `fwuid` and `app`, which are necessary for crafting valid Aura POST requests.

3. **Payload Construction** — Using known controller/action pairs (e.g. `SelectableListDataProviderController`), the script sends POST requests to target specific Salesforce objects like `User`.

4. **Data Extraction** — The response is returned in JSON format, revealing internal data about the object queried.

### Sample PoC Output: User Object Access

```
$ python3 poc.py -u https://example.com/s/ -f
[+] Looking for aura endpoint and check vulnerability
[+] ['https://example.com/s/sfsites/aura'] seems to be vulnerable.
[+] Start exploit
[+] Endpoint: https://example.com/s/sfsites/aura
[+] Getting "User" object (page number 1)...
[+] State: SUCCESS, Total: 1, Page: 1, Result count: 1
[+] Result:
{ "result": [ { "record": { "Email": "exampleuser@example.com", "Name": "Example Site Guest User", "FirstName": "Example", "LastName": "Guest", "Id": "0053c00000ABCDEF", "CreatedDate": "2020-11-22T14:34:16.000Z", "sobjectType": "User" } } ], "totalCount": 1}
```

This confirmed the vulnerability—**internal user data was publicly accessible without authentication**.

### Accessing ContentDocument Metadata

By targeting the `ContentDocument` object instead, I retrieved metadata for internal documents stored in Salesforce:

```
$ python3 poc.py -u https://example.com/ -o "ContentDocument"
[+] Endpoint: https://example.com/aura
[+] Getting "ContentDocument" object (page number 1)...
[+] State: SUCCESS, Total: 152, Page: 1, Result count: 100
[+] Result:
{ "Title": "Internal_Document_01", "Id": "0693c000008fDm8AAE", "CreatedDate": "2020-01-06T14:28:11.000Z"}
```

Documents, email logs, internal assets—all revealed with zero authentication.

### Root Cause: Over-Permissioned Guest User Profile

Salesforce allows communities and public sites to assign a special profile to guest users. If this profile is granted access to backend objects like `User` or `ContentDocument`, it becomes a major risk.

The Aura framework honored these permissions and served the data without requiring login. This is **not a bug in Aura itself**, but rather a **misconfiguration in the Salesforce user permissions model**.

### Real-World Impact

This kind of exposure could lead to:

- **Sensitive Data Disclosure**: Emails, internal user metadata, document titles
- **Reconnaissance & Enumeration**: Mapping out Salesforce internal structures
- **Compliance Violations**: Exposure of PII may breach GDPR, CCPA, and similar data protection laws

### Files Included

The proof-of-concept script (`poc.py`) automates endpoint discovery, object querying, and data extraction. It's designed for responsible research and learning. Use it only on systems you are authorized to test.

**Salesforce pwn Tools:** [https://github.com/iamunixtz/salesforce-pwn](https://github.com/iamunixtz/salesforce-pwn)

### Final Thoughts

What started as a simple endpoint scan led to a serious finding. It's a reminder that platform security depends not only on the provider (like Salesforce) but also on how the tools are configured by end-users.

Even if you're using secure frameworks, a single misconfigured user profile can create a data breach waiting to happen.

This finding is one of the many that keeps me motivated in the world of bug bounty hunting—and I hope it helps others sharpen their testing methods as well.

Thanks for reading. If you've had similar experiences with Salesforce or other third-party platforms, I'd love to hear your story.

Happy Hunting.

