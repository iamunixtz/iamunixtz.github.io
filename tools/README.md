# Tools

## First-time: init Chirpy assets submodule (for local build)

If you clone the repo and want to build or run Jekyll locally, init the theme assets:

```bash
git submodule update --init --recursive
```

CI (Build and Deploy) does this automatically.

## Push using gh (no plain git credentials)

To push using your GitHub CLI login (gh handles auth, git does the push):

```bash
bash tools/push-with-gh.sh
```

Or manually: `gh auth setup-git` then `git push origin main`. GitHub CLI does not replace `git push`—it only provides the credentials.

---

## Download more images from old GitBook blog

The script `download_gitbook_images.py` fetches images from your old blog (unixtz.gitbook.io) and saves them into `assets/img/` with clear names (e.g. `bughunting_bugz.jpg`, `xss_report.jpg`).

**Run it on your machine** (where GitBook is reachable):

```bash
cd /path/to/iamunixtz.github.io
pip install requests   # if needed
python3 tools/download_gitbook_images.py
```

After it runs, you’ll have new files in `assets/img/`. You can then add them to your posts, for example:

- **BugHunting:** `bughunting_cover.jpg`, `bughunting_bugz.jpg`, `bughunting_firstbounty.jpg`
- **Open Redirect:** `open_redirect_poc1.jpg`, `open_redirect_poc2.png`, `open_redirect_poc3.png`
- **SQL Injection:** `sql_injection_sqlbg.jpg`
- **Improper Access Control:** `improper_access_bg1.jpg`
- **Salesforce:** `salesforce_aura.png`
- **Stored XSS:** `xss_thsn.jpg`, `xss_blindxss.jpg`, `xss_rxss.jpg`, `xss_report.jpg`
- **Burpsuite Pwn:** `burpsuite_screenshot.png`
- **Red Team Journey:** `redteam_sam.jpg`

Use them in Markdown as: `![description](/assets/img/filename.jpg)`.
