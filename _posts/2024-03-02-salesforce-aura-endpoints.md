---
layout: post
title: "Exposing Broken Access Control in Salesforce: How Public Aura Endpoints Leaked Sensitive Data"
date: 2024-03-02 15:00:00 +0000
categories: [Bug Hunting, API Security]
tags: [salesforce, aura, access-control, bug-bounty]
---

## The Discovery

Hey security researchers! Today, I'm sharing a fascinating discovery about how I found sensitive data exposure through public Salesforce Aura endpoints. This finding highlights the importance of understanding platform-specific features and their security implications.

## Understanding Aura Framework

Salesforce's Aura framework is a UI development framework that uses server-side controllers. These controllers can be accessed through endpoints that look like:

```http
/aura?r=X&aura.Context=...&aura.Token=...
```

## The Investigation

### Initial Access

While testing a Salesforce-based application, I noticed some endpoints were accessible without authentication:

```http
POST /aura
Content-Type: application/x-www-form-urlencoded
```

### The Vulnerable Controller

The application had a custom Aura controller that exposed sensitive data:

```java
@AuraEnabled
public static List<Contact> getContacts() {
    return [SELECT Id, Name, Email, Phone 
            FROM Contact 
            LIMIT 100];
}
```

## The Exploitation

### Building the Payload

I crafted a special Aura request:

```json
{
    "actions": [{
        "id": "123;a",
        "descriptor": "serviceComponent://ui.force.components.controllers.hostConfig.HostConfigController/ACTION$getConfigData",
        "callingDescriptor": "UNKNOWN",
        "params": {}
    }]
}
```

### Accessing Sensitive Data

The endpoint returned sensitive information without proper authorization checks:
- Contact details
- Internal business data
- System configurations

## The Impact

This vulnerability allowed:
1. Unauthorized access to sensitive data
2. Enumeration of internal information
3. Potential for further exploitation

## Root Cause Analysis

The issues stemmed from:
1. Lack of authentication checks
2. Missing authorization controls
3. Public exposure of internal endpoints

## The Fix

### Controller Level Fix

```java
@AuraEnabled
public static List<Contact> getContacts() {
    // Check user permissions
    if (!hasPermission()) {
        throw new AuraHandledException('Insufficient permissions');
    }
    
    // Apply proper filtering
    return [SELECT Id, Name, Email, Phone 
            FROM Contact 
            WHERE OwnerId = :UserInfo.getUserId()
            LIMIT 100];
}

private static Boolean hasPermission() {
    return Schema.sObjectType.Contact.isAccessible() 
           && Schema.sObjectType.Contact.fields.Email.isAccessible();
}
```

### Security Recommendations

1. Implement proper authentication
2. Add authorization checks
3. Use sharing rules
4. Limit exposed data
5. Regular security audits

## Tools Used

- Burp Suite Professional
- Custom Python scripts for Aura testing
- Salesforce Workbench
- Postman

## Lessons Learned

1. Understand platform-specific features
2. Test all API endpoints thoroughly
3. Don't assume built-in security
4. Document and report findings clearly

## Timeline

- Discovery: [Redacted]
- Report Submitted: [Redacted]
- Triaged: [Redacted]
- Fixed: [Redacted]
- Bounty Awarded: [Redacted]

## Defense in Depth

### Configuration Level

```xml
<?xml version="1.0" encoding="UTF-8"?>
<SecuritySettings>
    <enforceIpRanges>true</enforceIpRanges>
    <networkAccess>
        <ipRanges>
            <start>TRUSTED-IP-RANGE-START</start>
            <end>TRUSTED-IP-RANGE-END</end>
        </ipRanges>
    </networkAccess>
</SecuritySettings>
```

### Code Level

```java
// Implement proper checks
@AuraEnabled
public static Object getData(String recordId) {
    // Verify CRUD permissions
    if (!Schema.sObjectType.ObjectName__c.isAccessible()) {
        throw new AuraHandledException('Insufficient access');
    }
    
    // Verify record-level access
    if (!canAccessRecord(recordId)) {
        throw new AuraHandledException('Access denied');
    }
    
    // Proceed with data retrieval
    return getSecureData(recordId);
}
```

## Key Takeaways

1. Always implement proper authentication
2. Never trust client-side parameters
3. Understand platform security features
4. Regular security assessments
5. Document and share knowledge

## Conclusion

This finding demonstrates the importance of:
- Understanding platform-specific features
- Implementing proper access controls
- Regular security testing
- Sharing knowledge with the community

Remember: Platform-specific vulnerabilities often require platform-specific knowledge to discover and exploit. Keep learning and stay curious!

Happy hunting! 🎯

---
*Note: All details have been sanitized and shared with permission. Always practice responsible disclosure.*