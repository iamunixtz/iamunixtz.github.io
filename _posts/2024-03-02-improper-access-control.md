---
layout: post
title: "Improper Access Control: User Information Exposure"
date: 2024-03-02
categories: [Bug Hunting, Web Security]
tags: [access control, api security, information disclosure]
---

<div class="report-header">
  <img src="/assets/images/bug-bounty-report.svg" alt="Bug Bounty Report Details" class="report-image">
</div>

Hey everyone! 

So, let me take you on a little journey of discovery. It all started with a curious mind and a knack for uncovering the unseen. During one of my recent bug hunts, I stumbled upon a vulnerability on sample.com—an Improper Access Control that was leaking sensitive user information.

## The Discovery

Picture this: I was navigating through the various endpoints of sample.com, just like any other day. Suddenly, I came across something unusual. The endpoints were revealing more than they should—user emails, phone numbers, IDs, and even login activity. Exciting, right? But also quite concerning.

## The Vulnerable Endpoints

Let's break down the vulnerable spots:

### Users Endpoint
Accessing this endpoint revealed detailed information about all users, including their email addresses, phone numbers, IDs, and login activity.

```http
https://sample.com/api/v1/users?page=0&sortBy=createdAt
```

### Videos Endpoint
Here, users could view both public and private videos.

```http
https://sample.com/api/v1/videos?page=0&sortBy=createdAt
```

Impact: Exposed private videos to authenticated users, which should have been restricted.

### Comments Endpoint
This endpoint provided information about all comments, including user comments, their IDs, and timestamps.

```http
https://sample.com/api/v1/comments?page=0&sortBy=createdAt
```

Impact: Revealed all user comments and related metadata, posing a risk for targeted attacks.

## Additional Findings

As I dug deeper, I discovered that I could access these endpoints without even logging in or creating an account. This meant that anyone could view sensitive information without any authentication.

But that's not all. Once I created an account, I unexpectedly gained admin access, which allowed me to view all users' information. This was a clear sign of broken access control mechanisms.

## Advice for Fellow Hunters

If you're exploring for vulnerabilities, always try to:

- Access endpoints without logging in: Sometimes, unauthenticated access can reveal significant vulnerabilities.
- Create a regular user account: See if this gives you more access than intended.
- Test for admin access: Occasionally, broken access controls can mistakenly grant elevated permissions.

## The Impact

What did this mean? Well, sensitive user information like emails, phone numbers, and IDs were out in the open. Private videos and comments, meant to be protected, were accessible. This kind of data exposure is a goldmine for anyone with malicious intent.

## The Steps to Reproduce

If you're curious about how I found this, here's the scoop:

1. Login to the Application (Optional):
   - Make sure you're authenticated on the sample.com platform.

2. Access Users Endpoint:
   - Visit this URL in a browser or API testing tool (like Burp Suite):
   ```http
   https://sample.com/api/v1/users?page=0&sortBy=createdAt
   ```
   - Check out the exposed user details, including emails, phone numbers, IDs, and login activity.

3. Access Videos Endpoint:
   - Head over to:
   ```http
   https://sample.com/api/v1/videos?page=0&sortBy=createdAt
   ```
   - Notice how you can view both public and private videos.

4. Access Comments Endpoint:
   - Visit:
   ```http
   https://sample.com/api/v1/comments?page=0&sortBy=createdAt
   ```
   - Review the comments, user IDs, and timestamps.

## Conclusion

Discovering this Improper Access Control vulnerability was quite an adventure. It poses a significant risk by exposing sensitive user information and private content. Taking immediate action to implement proper access controls is crucial to prevent unauthorized access to user data.

Hope you enjoyed the story! Stay safe and keep hacking! 😊

<style>
.report-header {
  margin-bottom: 2em;
}

.report-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>