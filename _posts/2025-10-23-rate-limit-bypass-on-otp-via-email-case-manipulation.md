---
title: "Bypassing OTP Rate Limits with a Simple Capital Letter"
date: 2025-10-23
last_modified_at: 2026-04-02
categories: [Bug Hunting, Web Security]
tags: [Rate Limit Bypass, OTP, Authentication, Bug Bounty, Web Security]
---

# Hello folks, it's me again!

You know that feeling when you're staring at a "Too Many Requests" error and you just know there's a way around it? That happened to me recently while I was testing the login flow on a platform. It's one of those bugs that forces you to realize how a single forgotten detail in a codebase can break an entire security feature.

This is the story of how I bypassed an OTP rate limit by doing something as simple as changing a few letters from lowercase to uppercase. Turns out, the computer isn't as smart as we think it is sometimes. This find earned me a $200 bounty, and I'm going to show you exactly how it worked.

---

## The "I'm Blocked" Moment

I was testing the authentication flow on `login.[REDACTED]`. Like any good security researcher, I wanted to see how the system handles brute-force attempts on its OTP (One-Time Password) codes.

I started firing off wrong codes. One, two, three, four... on the fifth attempt, the system cut me off. I got a big error message saying: *"The wrong code was entered too many times. Select 'Send new code' and try again in 5 minutes."*

Most people would just wait the 5 minutes. But I was curious. I wanted to know *how* the server was tracking those 5 attempts. Was it looking at my IP? My session? Or was it just looking at the email address I provided?

---

## Testing the Theory

I decided to try a classic trick. I reinitiated the login, but instead of using `jikomsela@gmail.com` again, I used a variation: `JIKOmsElA@Gmail.Com`.

Internally, for the database lookup, these are the same account. But for the rate limiter? I had a hunch.

I sent the request. The system didn't say "Too Many Requests." Instead, it sent me a fresh OTP. I entered another 5 wrong guesses, got blocked again, and then tried another variation: `jikomsela@GMAIL.COM`.

It worked again. Fresh OTP, 5 more attempts.

By cycling through different casing variations of the same email, I could effectively reset the attempt counter indefinitely. The 5-attempt limit was completely neutralized.

---

## Technical Breakdown

### 1. The Intercepted Request

This was the original request that got me blocked:

```http
POST /authn/api/identity/login/?client_id=[REDACTED] HTTP/2
Host: login.[REDACTED]
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

username=jikomsela%40gmail.com&password=example&PAYLOAD...
```

### 2. The Manipulated Request (The Bypass)

I just had to change the case:

```http
POST /authn/api/identity/login/?client_id=[REDACTED] HTTP/2
Host: login.[REDACTED]
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

username=JIKOmsElA%40GMail.Com&password=example&PAYLOAD...
```

The server treated this as a different user for the rate limiting logic, but it still mapped to my original account for the login process.

---

## Why did this happen?

The root cause was a lack of **normalization**.

The rate-limiting logic was likely using the raw email string from the request as a key in its database or cache (like Redis). Since `user@mail.com` and `User@Mail.Com` are different strings, they got separate counters.

However, the actual login logic was likely lowercasing the email before looking it up in the user database. This "mismatch" between how the gatekeeper and the guard read the same name created the bypass.

---

## Impact

This is more than just an annoyance. OTPs are often only 6 digits. If you can automate attempts without ever getting locked out, you can brute-force the code in a relatively short amount of time. It makes the "something you have" (the OTP) much less secure.

---

## Recommendation for Developers

It's a simple fix, but one that's easy to overlook:

1. **Normalize Input**: Always lowercase and trim email addresses before using them for *any* logic -- especially rate limiting.
2. **Use Canonical Identifiers**: Rate limit based on a stable, internal account ID rather than a user-provided string.

This find was a great reminder that sometimes the biggest vulnerabilities are hidden in the most basic details.

This one paid $200. Not bad for a bit of case-sensitivity testing!
