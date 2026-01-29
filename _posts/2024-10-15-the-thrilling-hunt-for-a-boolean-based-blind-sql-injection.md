---
title: "The Thrilling Hunt for a Boolean-Based Blind SQL Injection"
date: 2024-10-15 00:00:00 +0000
categories: [Bug Hunting]
tags: [bughunting, cybersecurity]
---

Hey everyone! Gather around, because I've got an exciting tale from my latest bug bounty adventure. It's a story of discovery, persistence, and a bit of clever trickery as I stumbled upon a boolean-based blind SQL injection vulnerability on `https://portal.sddc.army.mil/`. Let's dive in!

![image](/assets/img/the_thrilling_hunt_f_0.jpg)

## Summary

Imagine this: I'm combing through the `User-Agent` headers of the `https://portal.sddc.army.mil/` application, and suddenly, I uncover a hidden gem—a boolean-based blind SQL injection vulnerability. This vulnerability can be exploited to extract sensitive data from the backend database by leveraging boolean-based blind SQL injection techniques.

## The Impact

The implications of this discovery are significant:

- **Information Disclosure:** Attackers could infer database schema details and potentially sensitive information.
- **Database and Web Server Details:**
  - **Database Management System:** MySQL 8 (MariaDB fork)
  - **Web Server Operating System:** Windows
  - **Web Application Technology:** Microsoft SharePoint 16.0.0.5452

## The Hunt

Now, let's get to the juicy details of how I uncovered this vulnerability.

1. **Setting Up SQLMap:** Armed with SQLMap, I ran the following command to initiate a boolean-based blind SQL injection test:

```bash
sqlmap --url https://portal.sddc.army.mil/ --random-agent --risk 3 --level 5 --batch
```

2. **Identifying the Vulnerable Parameter:** Through my tests, I found that the `User-Agent` header was susceptible to SQL injection. Here's the payload I used:

```
Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-us) AppleWebKit/523.10.3 (KHTML, like Gecko) Version/3.0.4 Safari/523.10' AND 8074=8074-- KwOG
```

3. **Confirming the Vulnerability:** By injecting the payload, I observed that the application responded differently based on the boolean condition provided (`8074=8074`). This confirmed the presence of the vulnerability.

4. **Exploiting with SQLMap or Burp Suite:**
   - **SQLMap:** Further exploits with SQLMap allowed me to extract more data from the database.
   - **Burp Suite:** I also crafted and tested boolean-based blind SQL injection payloads manually using Burp Suite to infer additional database information.

## Steps to Reproduce

If you're keen on retracing my steps, here's how you can do it:

1. **Set Up SQLMap:** Run the following command to initiate a boolean-based blind SQL injection test:

```bash
sqlmap --url https://portal.sddc.army.mil/ --random-agent --risk 3 --level 5 --batch
```

2. **Inject the Payload:** Use the `User-Agent` header to inject the following payload:

```
Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en-us) AppleWebKit/523.10.3 (KHTML, like Gecko) Version/3.0.4 Safari/523.10' AND 8074=8074-- KwOG
```

3. **Observe the Response:** Check how the application responds differently based on the boolean condition provided.
4. **Test Further:** Use SQLMap or Burp Suite to further explore and extract data.

## Conclusion

Discovering this boolean-based blind SQL injection vulnerability was an exhilarating journey. The thrill of the hunt, the satisfaction of uncovering hidden flaws, and the importance of securing our digital world make it all worthwhile. Keep hunting, stay curious, and always aim to secure!

Stay safe and happy hacking! 😊