---
title: "The Thrilling Hunt for a Boolean-Based Blind SQL Injection"
date: 2024-10-15 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---


![image](/assets/img/bughunting_image_0.jpg)

### Summary
Discovered a boolean-based blind SQL injection on `https://portal.sddc.army.mil/` via the `User-Agent` header.

### Impact
Information disclosure of database schema and server details (MySQL 8/MariaDB on Windows using SharePoint).

### Steps to Reproduce
Used `sqlmap` with `--level 5 --risk 3` and a payload like `' AND 8074=8074--`.
