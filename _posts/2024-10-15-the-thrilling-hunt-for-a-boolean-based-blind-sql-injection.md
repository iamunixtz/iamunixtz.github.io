---
title: "The Thrilling Hunt for a Boolean-Based Blind SQL Injection"
date: 2024-10-15 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

# The Thrilling Hunt for a Boolean-Based Blind SQL Injection\n\n![image](/assets/img/the_thrilling_hunt_f_0.jpg)\n\n**Hey everyone!**\n\nI uncover a hidden gem—a boolean-based blind SQL injection vulnerability on `https://portal.sddc.army.mil/` in the `User-Agent` headers.\n\n### The Impact:\n* **Information Disclosure:** Attackers could infer database schema details.\n* **Tech Stack:** MySQL 8, Windows, Microsoft SharePoint 16.0.0.5452.\n\n### The Hunt:\n* **Payload:** `Mozilla/5.0 ... Safari/523.10' AND 8074=8074-- KwOG`