---
title: The Thrilling Hunt for a Boolean-Based Blind SQL Injection
date: 2024-03-02 12:00:00 +0000
categories: [Bug Hunting]
tags: [bug-bounty, sql-injection, web-security]
img_path: /assets/images/
image: sql-injection-report.jpeg
pin: true
---

## Summary

During my bug hunting journey, I discovered a Boolean-based blind SQL injection vulnerability in the User-Agent header on `https://portal.sddc.army.mil/`. This finding demonstrates how seemingly simple headers can lead to significant security issues when not properly sanitized.

## Impact

The SQL injection vulnerability could allow an attacker to:
- Extract sensitive data from the database
- Potentially modify or delete database records
- Bypass authentication mechanisms
- Execute administrative operations

## The Hunt

The vulnerability was discovered while testing various HTTP headers for injection points. Using SQLMap and Burp Suite, I was able to confirm the SQL injection in the User-Agent header.

### Initial Discovery

The first indication of the vulnerability came when manipulating the User-Agent header with boolean conditions:

```
User-Agent: Mozilla/5.0' AND '1'='1
User-Agent: Mozilla/5.0' AND '1'='2
```

The responses differed based on the boolean condition, indicating potential SQL injection.

### Exploitation with SQLMap

To confirm the vulnerability, I used SQLMap with the following command:

```bash
sqlmap -u "https://portal.sddc.army.mil/" --headers="User-Agent: Mozilla/5.0" --level=3
```

SQLMap successfully identified and exploited the vulnerability, confirming it was a boolean-based blind SQL injection.

## Steps to Reproduce

1. Intercept any request to `https://portal.sddc.army.mil/` using Burp Suite
2. Modify the User-Agent header with SQL injection payloads
3. Observe the different responses based on boolean conditions
4. Use SQLMap to automate the exploitation process

## Conclusion

This finding highlights the importance of proper input validation for all HTTP headers, not just common parameters. The boolean-based blind SQL injection, while requiring more time to exploit, can be just as critical as other variants.