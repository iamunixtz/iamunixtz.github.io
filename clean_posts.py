import os
import re

POSTS_DIR = "_posts"

def clean_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Fix literal newlines
    # The literal sequence \ followed by n should be replaced by actual newline
    content = content.replace("\\n", "\n")

    # Remove GitBook Image Proxy wrappers if any remained (optional safety)
    # But mainly remove the navigation links the user complained about
    # Pattern: * [Link Text](https://....) at start of lines
    content = re.sub(r'^\* \[.*?\]\(https:\/\/unixtz\.gitbook\.io.*?\)\n', '', content, flags=re.MULTILINE)
    
    # Also remove "Previous" / "Next" links that might have been missed
    content = re.sub(r'\[Previous.*?\]\(.*?\)', '', content)
    content = re.sub(r'\[Next.*?\]\(.*?\)', '', content)

    # Remove self-referential titles if they are duplicated right after H1
    # Check if H1 is followed immediately by the same text
    
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Cleaned {filepath}")

for filename in os.listdir(POSTS_DIR):
    if filename.endswith(".md"):
        clean_file(os.path.join(POSTS_DIR, filename))
