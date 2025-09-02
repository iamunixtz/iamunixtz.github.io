---
title: "Improper Access Control: User Information Exposure"
date: 2024-03-02 12:00:00 +0000
categories: [Bug Hunting]
tags: [bug-bounty, access-control, web-security]
img_path: /assets/images/
image: bug-bounty-report.jpeg
pin: true
---

## Summary

During my bug hunting journey, I discovered an improper access control vulnerability that exposed sensitive user information. This finding demonstrates how critical it is to implement proper authorization checks for all API endpoints.

## Impact

The vulnerability allowed unauthorized access to sensitive user information, including:
- Personal details
- Account information
- User preferences
- System settings

## Discovery Process

The vulnerability was found while testing API endpoints for proper access controls. By manipulating request parameters and analyzing responses, I identified endpoints that leaked sensitive information.

### Technical Details

The vulnerable endpoint was accessible without proper authentication:

```http
GET /api/v1/users/info
Host: example.com
```

The endpoint returned sensitive user information in the response:

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  ]
}
```

## Additional Findings

Further investigation revealed:
1. No rate limiting on the endpoint
2. Response contained unfiltered user data
3. No audit logging of access attempts

## Advice for Hunters

When testing for access control issues:
1. Always check API endpoints without authentication
2. Test with different user roles
3. Look for information disclosure in responses
4. Check for missing authorization headers

## Steps to Reproduce

1. Send GET request to `/api/v1/users/info`
2. Observe the response containing sensitive user information
3. Verify no authentication is required
4. Test with different user contexts

## Impact

The vulnerability could lead to:
- Unauthorized access to user data
- Privacy violations
- Potential account takeover
- Compliance violations

## Conclusion

This finding highlights the importance of implementing proper access controls and the need for thorough security testing of API endpoints.