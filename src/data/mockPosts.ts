export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  category: string;
}

export const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Bug Hunting: A Beginner's Guide",
    excerpt: "Learn the fundamentals of ethical hacking and bug bounty hunting. This comprehensive guide covers reconnaissance, vulnerability assessment, and responsible disclosure practices.",
    content: `# Getting Started with Bug Hunting: A Beginner's Guide

Welcome to the exciting world of bug bounty hunting! This guide will help you understand the fundamentals of finding security vulnerabilities ethically.

## What is Bug Hunting?

Bug hunting, also known as bug bounty hunting, is the practice of finding security vulnerabilities in applications, websites, and systems in exchange for rewards or recognition.

### Essential Skills for Bug Hunters

- **Reconnaissance**: Information gathering and target analysis
- **Web Application Security**: Understanding common vulnerabilities (OWASP Top 10)
- **Network Security**: Port scanning, service enumeration
- **Social Engineering**: Understanding human psychology in security
- **Programming**: Basic scripting for automation

## Getting Started

### 1. Learn the Basics
Start with understanding web technologies, HTTP/HTTPS protocols, and common vulnerability types.

### 2. Set Up Your Environment
- **Burp Suite**: Web application security testing
- **OWASP ZAP**: Free security testing proxy
- **Nmap**: Network discovery and security auditing
- **Metasploit**: Penetration testing framework

### 3. Practice Platforms
- **HackTheBox**: Hands-on penetration testing labs
- **TryHackMe**: Beginner-friendly cybersecurity training
- **PortSwigger Web Security Academy**: Free web security training
- **VulnHub**: Vulnerable VMs for practice

## Methodology

### Reconnaissance Phase
1. **Passive Information Gathering**
   - Google dorking
   - Shodan searches
   - Certificate transparency logs
   - Social media reconnaissance

2. **Active Information Gathering**
   - Subdomain enumeration
   - Port scanning
   - Technology stack identification
   - Directory brute-forcing

### Vulnerability Assessment
Look for common issues like:
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Insecure Direct Object References (IDOR)
- Server-Side Request Forgery (SSRF)

## Responsible Disclosure

Always follow responsible disclosure practices:
- Report vulnerabilities through proper channels
- Don't access sensitive data
- Don't perform destructive actions
- Respect scope limitations
- Document your findings professionally

Happy hunting and remember - always stay ethical!`,
    image: "/src/assets/blog-hero.png",
    author: "iamunixtz",
    date: "Dec 15, 2023",
    readTime: "8 min read",
    tags: ["bughunting", "research", "recon", "zeroday"],
    featured: true,
    category: "Bug Hunting"
  },
  {
    id: 2,
    title: "Advanced Reconnaissance Techniques for Red Team Operations",
    excerpt: "Explore sophisticated OSINT methods and reconnaissance strategies used in red team engagements. Learn passive and active information gathering techniques.",
    content: `# Advanced Reconnaissance Techniques for Red Team Operations

Reconnaissance is the foundation of any successful red team engagement. This post covers advanced techniques for gathering intelligence about your targets.

## OSINT (Open Source Intelligence)

### Social Media Intelligence
- LinkedIn for organizational structure
- Twitter for employee information
- GitHub for code repositories and secrets
- Pastebin for leaked credentials

### Domain and Infrastructure Analysis
- Certificate transparency logs
- DNS enumeration and zone transfers
- Cloud asset discovery (AWS, Azure, GCP)
- CDN analysis and origin server discovery

## Active Reconnaissance

### Subdomain Enumeration
Tools and techniques:
- Amass for comprehensive subdomain discovery
- Subfinder for passive subdomain enumeration
- Gobuster for DNS brute-forcing
- Sublist3r for multiple source aggregation

### Network Scanning
- Nmap for port scanning and service detection
- Masscan for high-speed port scanning
- Zmap for internet-wide scanning
- Custom scripts for targeted enumeration

## Evasion Techniques

- Slow scanning to avoid detection
- Using residential proxies
- Timing attacks and rate limiting
- User-agent rotation and request variations

Remember: Always ensure you have proper authorization before conducting any reconnaissance activities!`,
    author: "iamunixtz",
    date: "Dec 12, 2023",
    readTime: "6 min read",
    tags: ["recon", "red team", "research", "exploitation"],
    category: "Red Team"
  },
  {
    id: 3,
    title: "Malware Development for Security Research",
    excerpt: "Understanding malware development techniques helps security researchers better defend against threats. Learn about payload creation, evasion techniques, and analysis methods.",
    content: `# Malware Development for Security Research

**Disclaimer: This content is for educational and defensive security purposes only. Always follow legal and ethical guidelines.**

## Introduction to Malware Research

Understanding how malware works is crucial for cybersecurity professionals. This knowledge helps in:
- Developing better detection mechanisms
- Creating effective incident response procedures
- Understanding attacker techniques and tactics

## Common Malware Types

### Trojans
- Remote Access Trojans (RATs)
- Banking trojans
- Information stealers

### Ransomware
- File encryption mechanisms
- Payment processing
- Communication protocols

### Rootkits
- Kernel-level persistence
- System API hooking
- Process hiding techniques

## Development Environments

### Safe Research Environment
- Isolated virtual machines
- Network segmentation
- Snapshot capabilities
- Monitoring and logging

### Programming Languages
- **C/C++**: Low-level system access
- **Python**: Rapid prototyping and scripting
- **PowerShell**: Windows-based attacks
- **Assembly**: Direct hardware interaction

## Evasion Techniques

### Anti-Analysis Methods
- Packing and obfuscation
- Anti-debugging techniques
- Sandbox detection
- Virtual machine detection

### Persistence Mechanisms
- Registry modifications
- Service installation
- Startup folder placement
- Scheduled tasks

## Research Applications

Understanding these techniques helps security professionals:
- Develop better antivirus signatures
- Create honeypots and deception systems
- Improve network monitoring
- Train incident response teams

Always remember: Knowledge of offensive techniques should only be used for defensive purposes and authorized security testing.`,
    author: "iamunixtz",
    date: "Dec 10, 2023",
    readTime: "10 min read",
    tags: ["malware dev", "research", "red team", "exploitation"],
    category: "Malware Research"
  },
  {
    id: 4,
    title: "Zero-Day Vulnerability Research: Methodology and Ethics",
    excerpt: "Dive deep into zero-day vulnerability research methodologies, responsible disclosure practices, and the ethics of security research in modern cybersecurity.",
    content: `# Zero-Day Vulnerability Research: Methodology and Ethics

Zero-day vulnerabilities represent the holy grail of security research - previously unknown flaws that can have significant impact on systems worldwide.

## What are Zero-Days?

Zero-day vulnerabilities are security flaws that are:
- Unknown to the software vendor
- Have no available patches or fixes
- Can be exploited by attackers
- Potentially high-value in both legitimate research and criminal markets

## Research Methodology

### Target Selection
- Choose software with wide deployment
- Focus on critical infrastructure applications
- Consider impact vs. effort ratio
- Evaluate vendor response history

### Analysis Techniques
- **Static Analysis**: Code review and pattern matching
- **Dynamic Analysis**: Runtime testing and fuzzing
- **Hybrid Approaches**: Combining multiple methodologies
- **Binary Analysis**: Reverse engineering compiled software

### Tools and Frameworks
- **Fuzzing**: AFL++, LibFuzzer, Honggfuzz
- **Static Analysis**: CodeQL, Semgrep, SonarQube
- **Dynamic Analysis**: Pin, Intel MPX, AddressSanitizer
- **Reverse Engineering**: IDA Pro, Ghidra, Radare2

## Vulnerability Classes to Focus On

### Memory Corruption
- Buffer overflows
- Use-after-free vulnerabilities
- Integer overflows
- Double-free conditions

### Logic Flaws
- Authentication bypasses
- Authorization issues
- Business logic errors
- Race conditions

### Injection Attacks
- SQL injection variations
- Command injection
- LDAP injection
- Template injection

## Responsible Disclosure

### Best Practices
1. **Initial Contact**: Use vendor's preferred reporting channel
2. **Detailed Report**: Provide clear reproduction steps
3. **Timeline**: Allow reasonable time for patching (typically 90 days)
4. **Coordination**: Work with vendor throughout the process
5. **Public Disclosure**: Only after patch availability

### Documentation Requirements
- Vulnerability description
- Impact assessment
- Proof of concept (non-weaponized)
- Affected versions
- Recommended fixes

## Ethical Considerations

### Legal Framework
- Always operate within legal boundaries
- Obtain proper authorization for testing
- Respect intellectual property rights
- Follow local and international laws

### Ethical Guidelines
- Minimize potential harm
- Protect user data and privacy
- Don't weaponize discoveries
- Support the security community

## Building a Research Lab

### Hardware Requirements
- Isolated network environment
- Multiple testing systems
- Adequate storage for samples
- Backup and recovery systems

### Software Tools
- Virtual machine platforms
- Debugging and analysis tools
- Network monitoring equipment
- Secure communication channels

## Career Paths

Zero-day research can lead to roles in:
- Vulnerability research teams
- Government security agencies
- Private security consulting
- Bug bounty hunting
- Academic research positions

Remember: The goal of security research should always be to make systems safer, not to cause harm. Ethical considerations should guide every aspect of your research methodology.`,
    author: "iamunixtz",
    date: "Dec 8, 2023",
    readTime: "12 min read",
    tags: ["zeroday", "research", "exploitation", "bughunting"],
    category: "Vulnerability Research"
  }
];