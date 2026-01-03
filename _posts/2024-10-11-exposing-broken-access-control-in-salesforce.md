---
title: "Exposing Broken Access Control in Salesforce"
date: 2024-10-11 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---


![image](/assets/img/bughunting_image_0.png)

### Vulnerability
Discovered that public Aura endpoints (`/aura`, `/sfsites/aura`) were exposed to unauthenticated guest users in Salesforce.

### Technical Breakdown
Used a Python script to query Salesforce objects like `User` and `ContentDocument`, retrieving sensitive metadata and emails.

### Root Cause
Over-permissioned Guest User Profiles in the Salesforce configuration.
