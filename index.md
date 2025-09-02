---
layout: default
---

<div class="terminal-container">
  <div class="profile-section">
    <img src="/assets/images/profile-mask.svg" alt="Profile Picture" class="profile-pic">
    <div class="terminal-text">
      <span class="prompt">> whoami</span>
      <span class="response">African Bug Hunter | Reverse Engineer | Digital Explorer</span>
    </div>
  </div>
</div>

<style>
.terminal-container {
  background: #0c0c0c;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 30px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #00ff00;
}

.terminal-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prompt {
  color: #00ff00;
  font-family: monospace;
}

.response {
  color: #ffffff;
  font-family: monospace;
}

.posts-container {
  margin-top: 30px;
}

.post-item {
  background: #1a1a1a;
  border-left: 3px solid #00ff00;
  padding: 15px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.post-item:hover {
  transform: translateX(5px);
  background: #2a2a2a;
}

.post-title {
  color: #00ff00;
  text-decoration: none;
  font-size: 1.2em;
  margin-bottom: 10px;
  display: block;
}

.post-meta {
  color: #666;
  font-size: 0.9em;
  font-family: monospace;
}

.post-excerpt {
  color: #ccc;
  margin-top: 10px;
}
</style>

<div class="posts-container">
  {% for post in site.posts %}
    <div class="post-item">
      <a href="{{ post.url | relative_url }}" class="post-title">{{ post.title }}</a>
      <div class="post-meta">{{ post.date | date: "%Y-%m-%d" }} • {{ post.categories | join: ', ' }}</div>
      <div class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 50 }}</div>
    </div>
  {% endfor %}
</div>