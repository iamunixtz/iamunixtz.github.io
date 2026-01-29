#!/usr/bin/env python3
"""Download images from old GitBook blog and save to assets/img with consistent names."""
import os
import re
import requests
from urllib.parse import urlparse, parse_qs, unquote

IMG_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
os.makedirs(IMG_DIR, exist_ok=True)

# All GitBook image URLs from old blog (from update_content.py / fetched pages)
IMAGES = [
    # BugHunting
    ("bughunting_cover.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FboIUpSkVDfgix8uPl2ik%252Falone.jpg%3Falt%3Dmedia%26token%3D0d683c59-6057-429f-a1ae-bce3bcfebcbe&width=1248&dpr=3&quality=100&sign=68b8f200&sv=2"),
    ("bughunting_bugz.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FkElD74MquCKWtViUrEL8%252Fbugz.jpg%3Falt%3Dmedia%26token%3D59103ebc-466f-47a3-8ba5-3164918dfe28&width=768&dpr=4&quality=100&sign=e16fafab&sv=2"),
    ("bughunting_firstbounty.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FxGfw482NgoSdxr7aFMxR%252Ffirstbounty.jpg%3Falt%3Dmedia%26token%3D29cc57ef-98f5-46cc-9c42-2ce43b180202&width=768&dpr=4&quality=100&sign=d63e0902&sv=2"),
    # Improper Access Control
    ("improper_access_bg1.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FOojnh72QThN1nSFX68uO%252Fbg1.jpg%3Falt%3Dmedia%26token%3D9cdf4685-c085-436a-bcfb-99c9d6ca8b0f&width=768&dpr=4&quality=100&sign=53b60349&sv=2"),
    # Boolean SQLi
    ("sql_injection_sqlbg.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FsHt2AlR0YBKJmwNwn458%252Fsqlbg.jpg%3Falt%3Dmedia%26token%3D24b6884b-505b-46b6-b54f-f58c261a9830&width=768&dpr=4&quality=100&sign=c9e6df1d&sv=2"),
    # Open Redirect
    ("open_redirect_poc1.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FAgu3taMcTH9UOnyWZRHo%252F20250126_204848.jpg%3Falt%3Dmedia%26token%3Da3e22ee8-9cf1-4cbb-bd3b-e2e53b421fd3&width=768&dpr=4&quality=100&sign=9afcfaff&sv=2"),
    ("open_redirect_poc2.png", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252F9hKRY8o0GhEDvIjAYLsn%252Fimage.png%3Falt%3Dmedia%26token%3D725f4b03-1435-4580-a41b-c37df3bd46f7&width=768&dpr=4&quality=100&sign=a9e9df42&sv=2"),
    ("open_redirect_poc3.png", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FXSerIwEyiqEfc8T55Edv%252Fimage.png%3Falt%3Dmedia%26token%3Dc5195716-22e3-445c-bd50-f2b336ef8599&width=768&dpr=4&quality=100&sign=b234f9d&sv=2"),
    # Salesforce
    ("salesforce_aura.png", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FZnvfKG0NRSuid0mS8UqB%252Fimage.png%3Falt%3Dmedia%26token%3D579ada7e-c530-4834-813f-290662d3ed5e&width=768&dpr=4&quality=100&sign=76dddd1&sv=2"),
    # Stored XSS
    ("xss_thsn.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252F8T4dm8f0RrqfaduUGG8U%252Fthsn.jpg%3Falt%3Dmedia%26token%3D1af3c410-a3c4-4648-a0c8-84570b3c53db&width=768&dpr=4&quality=100&sign=b1a9b13a&sv=2"),
    ("xss_blindxss.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FjMmtP2Vw9WYRMz5snKGi%252Fblindxss.jpg%3Falt%3Dmedia%26token%3D262ce5f4-b396-4473-bb09-c5643e6d5335&width=768&dpr=4&quality=100&sign=f0271f04&sv=2"),
    ("xss_rxss.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FbTE2TUaW85rwVhWriQdm%252Frxss.jpg%3Falt%3Dmedia%26token%3Dd7fe1e48-5c24-44d6-9c30-1a39f3d3a28c&width=768&dpr=4&quality=100&sign=61c2b4e2&sv=2"),
    ("xss_report.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FX9qGX7BagJ9W2LlaPKIN%252Fxssreport.jpg%3Falt%3Dmedia%26token%3D034f511d-3559-432f-b405-ddebf67ecc3b&width=768&dpr=4&quality=100&sign=5eb2b504&sv=2"),
    # Burpsuite Pwn
    ("burpsuite_screenshot.png", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FI5CyZXMlNA7p3dflAhX3%252FScreenshot%25202025-02-26%2520164749.png%3Falt%3Dmedia%26token%3D66f52d09-beb6-4308-b86e-bc2c75e5d933&width=768&dpr=4&quality=100&sign=dce14f9d&sv=2"),
    # Red Team Journey
    ("redteam_sam.jpg", "https://unixtz.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F3236377954-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLnNsONrppSfobRJorbOd%252Fuploads%252FK5OBu2GFZrNHBy8wbnSu%252Fsam.jpg%3Falt%3Dmedia%26token%3D3c7c4644-e997-474c-aead-066933227566&width=768&dpr=4&quality=100&sign=18a8b6f&sv=2"),
]


def download(name, url):
    out_path = os.path.join(IMG_DIR, name)
    if os.path.exists(out_path):
        print(f"  Skip (exists): {name}")
        return True
    # Use the GitBook proxy URL as-is (direct CDN may not resolve in all networks)
    direct = url
    try:
        r = requests.get(
            direct,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
            timeout=15,
            stream=True,
        )
        r.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        print(f"  Downloaded: {name}")
        return True
    except Exception as e:
        print(f"  Failed {name}: {e}")
        return False


def main():
    print("Downloading GitBook images to assets/img/ ...")
    for name, url in IMAGES:
        download(name, url)
    print("Done.")


if __name__ == "__main__":
    main()
