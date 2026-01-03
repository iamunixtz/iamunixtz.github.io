---
title: "Improper Access Control: User Information Exposure"
date: 2024-10-09 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---


![image](/assets/img/bughunting_image_0.jpg)

## Hey everyone!

I stumbled upon a vulnerability on sample.com—an Improper Access Control that was leaking sensitive user information.

### The Vulnerable Endpoints
- **Users Endpoint:** Revealed emails, phone numbers, IDs, and login activity.
- **Videos Endpoint:** Accessible private videos.
- **Comments Endpoint:** Metadata exposure.

### Discovery
I found unauthenticated access was possible for these endpoints, and regular user accounts could gain admin-level data access.
