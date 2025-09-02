---
layout: default
title: About Me
permalink: /about/
---

<style>
.profile-container {
    text-align: center;
    margin: 2rem 0;
}

.profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 3px solid #00f5d4;
    padding: 5px;
    background: rgba(0, 245, 212, 0.1);
}

.section {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid rgba(0, 245, 212, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
}

.skill-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.skill-item {
    padding: 0.5rem;
    background: rgba(0, 245, 212, 0.05);
    border: 1px solid rgba(0, 245, 212, 0.2);
    border-radius: 4px;
}

.terminal-text {
    font-family: 'Courier New', monospace;
    color: #00f5d4;
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}
</style>

<div class="profile-container">
    <img src="/assets/images/profile-mask.svg" alt="Profile Picture" class="profile-image">
    <div class="terminal-text">
        > whoami<br>
        $ African Bug Hunter | Reverse Engineer | Digital Explorer
    </div>
</div>

<section class="section">
    <h2>// Core Interests</h2>
    <div class="skill-list">
        <div class="skill-item">
            <h3>🎯 API Hacking</h3>
            <p>Breaking and securing web APIs, finding logic flaws, and pushing boundaries</p>
        </div>
        <div class="skill-item">
            <h3>🦠 Malware Development</h3>
            <p>Understanding attack vectors and creating defensive solutions</p>
        </div>
        <div class="skill-item">
            <h3>🔍 Reverse Engineering</h3>
            <p>Taking things apart to understand how they work</p>
        </div>
        <div class="skill-item">
            <h3>💰 Bug Bounty Hunting</h3>
            <p>Finding and responsibly disclosing security vulnerabilities</p>
        </div>
    </div>
</section>

<section class="section">
    <h2>// Technical Arsenal</h2>
    <div class="terminal-text">
        $ ls ~/skills<br>
        ├── Languages/<br>
        │   ├── Python<br>
        │   ├── C<br>
        │   ├── Assembly<br>
        │   └── Bash<br>
        ├── Tools/<br>
        │   ├── Burp Suite<br>
        │   ├── IDA Pro<br>
        │   ├── GDB<br>
        │   └── Custom Scripts<br>
        └── Techniques/<br>
            ├── Web App Testing<br>
            ├── Binary Analysis<br>
            ├── Network Protocol Analysis<br>
            └── Exploit Development
    </div>
</section>

<section class="section">
    <h2>// What to Expect</h2>
    <p>This blog is my digital playground where I share:</p>
    <ul>
        <li>🔍 Deep dives into interesting vulnerabilities</li>
        <li>🛠️ Custom tools and scripts for security testing</li>
        <li>📚 Learning resources and study paths</li>
        <li>💡 Tips and tricks for fellow security enthusiasts</li>
    </ul>
    <p>No fluff, no marketing - just raw, technical content from the trenches of cybersecurity.</p>
</section>

<div class="terminal-text">
    > cat ~/motto.txt<br>
    "Knowledge isn't just power - it's freedom. Keep learning, keep hacking, keep growing."
</div>