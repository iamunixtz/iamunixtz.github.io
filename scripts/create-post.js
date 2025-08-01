#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

async function createPost() {
  try {
    console.log('\n🔒 Blog Post Creator\n');

    const title = await question('Enter post title: ');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const date = new Date().toISOString().split('T')[0];
    
    const categories = await question('Enter categories (comma-separated): ');
    const description = await question('Enter post description: ');

    const postContent = `---
title: "${title}"
date: "${date}"
categories: [${categories.split(',').map(c => `"${c.trim()}"`).join(', ')}]
description: "${description}"
published: true
---

# ${title}

${description}

## Content

Start writing your post here...
`;

    const postsDir = path.join(__dirname, '..', 'content', 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const filePath = path.join(postsDir, `${date}-${slug}.md`);
    fs.writeFileSync(filePath, postContent);

    console.log(`\n✅ Post created successfully at ${filePath}\n`);
    console.log('To publish:');
    console.log('1. Edit the content in your favorite editor');
    console.log('2. Commit and push to GitHub');
    console.log('3. The site will rebuild automatically\n');

  } catch (error) {
    console.error('Error creating post:', error);
  } finally {
    rl.close();
  }
}

createPost();
