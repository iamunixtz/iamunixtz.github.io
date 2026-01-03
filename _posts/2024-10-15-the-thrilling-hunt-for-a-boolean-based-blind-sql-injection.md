---
title: "The Thrilling Hunt for a Boolean-Based Blind SQL Injection"
date: 2024-10-15 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

# The Thrilling Hunt for a Boolean-Based Blind SQL Injection

![image](/assets/img/the_thrilling_hunt_f_0.jpg)

**Hey everyone!**

I uncover a hidden gem—a boolean-based blind SQL injection vulnerability on `https://portal.sddc.army.mil/` in the `User-Agent` headers.

### The Impact:
* **Information Disclosure:** Attackers could infer database schema details.
* **Tech Stack:** MySQL 8, Windows, Microsoft SharePoint 16.0.0.5452.

### The Hunt:
* **Payload:** `Mozilla/5.0 ... Safari/523.10' AND 8074=8074-- KwOG`