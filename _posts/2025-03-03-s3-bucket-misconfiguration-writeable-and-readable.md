---
title: "S3 Bucket Writeable and Readable by Unauthenticated Users"
date: 2025-03-03
last_modified_at: 2026-04-02
categories: [Bug Hunting, Cloud Security]
tags: [S3 Bucket, Misconfiguration, Path Traversal, VDP, Cloud Security]
---

# Hello everyone! Glad to have you back.

Today I'm diving into a classic cloud security fail: the misconfigured S3 bucket. We've all heard stories about massive data leaks from exposed buckets, but this one was a bit different. It wasn't just about reading the data -- I found I could actually *write* to it, too.

This was a find on a Vulnerability Disclosure Program (VDP). Even though there was no cash bounty, the impact was high enough that I wanted to share exactly how I tracked it down. Let's get into it.

---

## The Breadcrumb

I was starting a fresh hunting session on `pilot.[REDACTED]`. Usually, the first thing I do is check the source of the login page to see what kind of scripts and resources are being loaded. 

I noticed something interesting in a `curl` response from their login portal. Buried in the HTML was a script tag pointing to an Amazon S3 bucket:

```html
<script src="https://[REDACTED]-human-prod.s3.amazonaws.com/jsblockmod.js"></script>
```

Whenever I see an S3 bucket URL, my curiosity immediately spikes. It's time to see how open that bucket really is.

---

## Peeking Inside

I decided to see if the bucket allowed listing. I fired up the AWS CLI and ran a simple command to see what else was in there:

```bash
aws s3 ls s3://[REDACTED]-human-prod --no-sign-request
```

To my surprise, the server didn't block me. It spit out a full list of files. Being able to read the contents is a problem, but it's usually just an information disclosure. I wanted to see if the configuration was even worse.

---

## The Real Risk: Write Access

The real "Aha!" moment came when I tested for write permissions. I created a simple text file on my machine:

```bash
echo "poc by iamunixtz" > poc.txt
```

Then, I tried to upload it to their production bucket without any credentials:

```bash
aws s3 cp poc.txt s3://[REDACTED]-human-prod --no-sign-request
```

The command returned success! I checked the bucket again, and there it was: `https://[REDACTED]-human-prod.s3.amazonaws.com/poc.txt`.

This is a nightmare scenario for any security team. If I can upload a simple text file, I can also upload malicious scripts or replace existing ones (like that `jsblockmod.js` script I found earlier). That could lead to everything from defacement to full-scale code injection on the login page.

---

## Why did this happen?

This usually boils down to a simple checkmark or policy error in the AWS console. 

1. **Insecure ACLs**: The "Public access" block was likely disabled, and the Access Control List (ACL) for the bucket was set to allow "Everyone" to list and write objects.
2. **Missing Bucket Policies**: There was no bucket policy in place to explicitly deny unauthenticated write requests.

When you're managing complex production environments, it's easy for one bucket to slip through the cracks. But in the cloud, one slip is all it takes.

---

## The Impact

Since this bucket was directly linked from the main login portal, the ability to write to it was a significant risk. An attacker could:
- **Inject Malicious Code**: Replace legitimate JS files with scripts that steal user credentials.
- **Distribute Malware**: Host a virus on the company's own trusted domain.
- **Corrupt Data**: Delete or overwrite critical files used by the application.

---

## Recommendation

I suggested a few immediate fixes to the team:
1. **Restrict Permissions**: Lock down the bucket so only authenticated IAM roles can write to it.
2. **Apply Bucket Policies**: Enforce a "Read-Only" policy for public access if the files really need to be public, and keep the "List" and "Write" permissions strictly private.
3. **Regular Audits**: Use automated tools to scan for public S3 buckets. Don't wait for a bug hunter to find them!

The team was quick to respond and thanked me for the report. Even without a bounty, it was a satisfying find. 

Stay safe, and always double-check your bucket policies!
