import type { Category } from "@/types";

export interface Tool {
  name: string;
  description: string;
  install: string;
}

export interface GuideCategory {
  category: Category;
  title: string;
  description: string;
  what: string;
  steps: string[];
  tools: Tool[];
  practice: { label: string; url: string }[];
}

export const GUIDE_DATA: GuideCategory[] = [
  {
    category: "web",
    title: "Web Exploitation",
    description: "Find and exploit vulnerabilities in web applications.",
    what: `Web exploitation is about finding flaws in websites and web apps — things like SQL injection, XSS, broken authentication, and insecure file handling. If a challenge gives you a URL, this is your category. The good news: browser DevTools get you surprisingly far before you even need a real tool.`,
    steps: [
      "Open the URL and interact with it normally — understand what the app does.",
      "View page source (Ctrl+U) — look for comments, hidden form fields, JS includes.",
      "Open DevTools → Application tab — check cookies, localStorage, sessionStorage.",
      "Check response headers for Server, X-Powered-By — identify the tech stack.",
      "Try common recon paths: /robots.txt, /.git, /admin, /backup, /api.",
      "Fuzz directories and files with ffuf or gobuster.",
      "Test all input fields for SQLi: ', ' OR '1'='1'--, and observe error messages.",
      "Test for XSS: <script>alert(1)</script> and <img src=x onerror=alert(1)>.",
      "For file include parameters, try ../../../etc/passwd or php://filter/...",
      "Use Burp Suite to intercept requests and replay/modify them in Repeater.",
    ],
    tools: [
      { name: "Burp Suite", description: "HTTP proxy — intercept, replay, and modify requests.", install: "portswigger.net/burp (Community is free)" },
      { name: "ffuf", description: "Fast web fuzzer for directories, files, and parameters.", install: "go install github.com/ffuf/ffuf/v2@latest" },
      { name: "gobuster", description: "Directory/DNS bruteforcer, alternative to ffuf.", install: "go install github.com/OJ/gobuster/v3@latest" },
      { name: "sqlmap", description: "Automated SQL injection detection and exploitation.", install: "apt install sqlmap / pip install sqlmap" },
      { name: "curl", description: "CLI HTTP client — test requests without a browser.", install: "pre-installed on most systems" },
      { name: "Wappalyzer", description: "Browser extension to identify web technologies.", install: "wappalyzer.com (browser extension)" },
    ],
    practice: [
      { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
      { label: "DVWA — Damn Vulnerable Web Application", url: "https://dvwa.co.uk" },
      { label: "HackTheBox — Web challenges", url: "https://app.hackthebox.com/challenges" },
      { label: "TryHackMe — Web Fundamentals path", url: "https://tryhackme.com/path/outline/web" },
      { label: "PicoCTF — Web Exploitation", url: "https://picoctf.org" },
    ],
  },
  {
    category: "crypto",
    title: "Cryptography",
    description: "Break ciphers, crack hashes, and exploit weak crypto implementations.",
    what: `Crypto challenges ask you to break a cipher or exploit a weakness in how cryptography was implemented — not break AES itself (that's math), but find the mistake. CTF crypto ranges from ancient ciphers (Caesar, Vigenere) to modern RSA with bad parameters. Always check if it's just an encoding (base64, hex) before assuming it's real crypto.`,
    steps: [
      "Check if it's an encoding first — base64, hex, and ROT13 are the most common.",
      "If it looks like cipher text: identify the type — repeated characters? Only letters? Numbers too?",
      "Try CyberChef's Magic operation — it auto-detects encodings and simple ciphers.",
      "For classic ciphers: try Caesar (26 brute-force shifts), then Vigenere, then substitution.",
      "For RSA: check n, e, c values. Is n small enough to factor? Is e=3 with small plaintext?",
      "If you have a hash: identify the type with hashid, then try crackstation.net first.",
      "For XOR: if you have part of the plaintext, XOR it against ciphertext to recover the key.",
      "Check if the challenge hints at the cipher type — always read the description carefully.",
    ],
    tools: [
      { name: "CyberChef", description: "Browser-based encoding/decoding/crypto Swiss Army knife.", install: "gchq.github.io/CyberChef (web, no install)" },
      { name: "dcode.fr", description: "Huge collection of online cipher solvers and tools.", install: "dcode.fr (web, no install)" },
      { name: "hashcat", description: "GPU-accelerated hash cracker.", install: "apt install hashcat / hashcat.net" },
      { name: "John the Ripper", description: "Hash cracker, also handles zip/rar/ssh keys.", install: "apt install john" },
      { name: "RsaCtfTool", description: "Automated RSA attacks — factor, Wiener, Hastad, etc.", install: "github.com/RsaCtfTool/RsaCtfTool" },
      { name: "SageMath", description: "Math toolkit — great for custom crypto math.", install: "sagemath.org / apt install sagemath" },
      { name: "pycryptodome", description: "Python crypto library for custom solutions.", install: "pip install pycryptodome" },
    ],
    practice: [
      { label: "Cryptopals Crypto Challenges", url: "https://cryptopals.com" },
      { label: "CryptoHack", url: "https://cryptohack.org" },
      { label: "PicoCTF — Cryptography", url: "https://picoctf.org" },
      { label: "HackTheBox — Crypto challenges", url: "https://app.hackthebox.com/challenges" },
    ],
  },
  {
    category: "forensics",
    title: "Forensics & Steganography",
    description: "Extract hidden data from files, images, audio, and network captures.",
    what: `Forensics challenges give you a file and ask you to find what's hidden or what happened. This covers image steganography (hiding data in pixels), metadata analysis, network packet inspection, file carving, and disk images. The key mindset: assume nothing is what it appears to be. A .jpg might not be a JPEG. A .txt might have invisible Unicode characters. Always run file first.`,
    steps: [
      "Run file <filename> — check if the extension matches the actual format.",
      "Run strings <filename> and grep for the flag format (picoCTF{, FLAG{, CTF{).",
      "Run exiftool <filename> — check all metadata including GPS, comments, creation dates.",
      "Run binwalk <filename> — look for embedded files, then binwalk -e to extract.",
      "For images: try zsteg (PNG), steghide (JPEG/BMP), check with stegsolve.",
      "For audio: open in Audacity, switch to spectrogram view — flags often hide there.",
      "For network captures: open in Wireshark, filter by protocol, follow TCP streams.",
      "For archives: try zip2john/rar2john + john to crack passwords.",
    ],
    tools: [
      { name: "Wireshark", description: "GUI network packet analyzer — the standard for .pcap files.", install: "wireshark.org / apt install wireshark" },
      { name: "binwalk", description: "Find and extract embedded files from any binary.", install: "apt install binwalk / pip install binwalk" },
      { name: "exiftool", description: "Read and write metadata in any file format.", install: "apt install libimage-exiftool-perl" },
      { name: "steghide", description: "Extract data hidden in JPEG/BMP/WAV files.", install: "apt install steghide" },
      { name: "zsteg", description: "Detect LSB steganography in PNG and BMP files.", install: "gem install zsteg" },
      { name: "stegseek", description: "Fast steghide passphrase bruteforcer.", install: "github.com/RickdeJager/stegseek" },
      { name: "Audacity", description: "Audio editor — use spectrogram view to find hidden data.", install: "audacityteam.org / apt install audacity" },
      { name: "foremost", description: "File carving — recover files from disk images.", install: "apt install foremost" },
    ],
    practice: [
      { label: "PicoCTF — Forensics", url: "https://picoctf.org" },
      { label: "HackTheBox — Forensics challenges", url: "https://app.hackthebox.com/challenges" },
      { label: "TryHackMe — Forensics rooms", url: "https://tryhackme.com" },
      { label: "CTFtime — Past forensics challenges (writeups)", url: "https://ctftime.org" },
    ],
  },
  {
    category: "pwn",
    title: "Pwn (Binary Exploitation)",
    description: "Exploit memory vulnerabilities in compiled programs to get a shell.",
    what: `Pwn (short for 'own') is binary exploitation — finding memory safety bugs in compiled C programs and using them to hijack execution. The classic attack is a stack buffer overflow: write past a buffer, overwrite the return address, redirect execution to your code or a useful function. Modern challenges add protections (NX, ASLR, PIE, stack canaries) that require more sophisticated techniques. pwntools is your best friend here.`,
    steps: [
      "Run checksec — understand which protections are enabled before anything else.",
      "Run the binary normally to understand its input and behavior.",
      "Look at the source (if given) or strings for function names like win, get_flag.",
      "Find overflow: look for gets, scanf, strcpy, read — these lack bounds checks.",
      "Determine the offset to the return address using a cyclic pattern and GDB.",
      "Identify your target: a win() function (ret2win), or system(\"/bin/sh\") (ret2libc).",
      "Build and test the payload locally before connecting to the remote server.",
      "Use pwntools to script the exploit — process() locally, remote() for the server.",
    ],
    tools: [
      { name: "pwntools", description: "Python exploit development framework — essential for CTF pwn.", install: "pip install pwntools" },
      { name: "GDB + pwndbg", description: "Debugger with CTF-friendly extensions (cyclic, stack visualization).", install: "apt install gdb; pip install pwndbg (or github.com/pwndbg/pwndbg)" },
      { name: "ROPgadget", description: "Find ROP gadgets in binaries.", install: "pip install ROPgadget" },
      { name: "checksec", description: "Show which security mitigations a binary uses.", install: "pip install checksec.sh / included with pwntools" },
      { name: "one_gadget", description: "Find single gadgets in libc that spawn a shell.", install: "gem install one_gadget" },
      { name: "ropper", description: "Alternative ROP gadget finder with chain building.", install: "pip install ropper" },
    ],
    practice: [
      { label: "pwn.college — free structured pwn curriculum", url: "https://pwn.college" },
      { label: "ROP Emporium — ROP chain practice", url: "https://ropemporium.com" },
      { label: "PicoCTF — Binary Exploitation", url: "https://picoctf.org" },
      { label: "HackTheBox — Pwn challenges", url: "https://app.hackthebox.com/challenges" },
      { label: "exploit.education — vulnerable VMs", url: "https://exploit.education" },
    ],
  },
  {
    category: "re",
    title: "Reverse Engineering",
    description: "Read and understand compiled programs without source code.",
    what: `Reverse engineering means reading a compiled binary and figuring out what it does — then usually figuring out what input makes it print the flag. You'll work with disassembly (machine code → assembly), decompilation (assembly → C-like pseudocode), and dynamic analysis (running it under a debugger and watching what happens). Ghidra's decompiler gets you most of the way there on most challenges.`,
    steps: [
      "Run file — is it a 32 or 64-bit ELF? Windows PE? Python bytecode? ARM?",
      "Run strings and grep for flags, passwords, and interesting function names.",
      "Run ltrace and strace — often reveals strcmp calls with the correct password.",
      "Open in Ghidra: auto-analyze, find main(), read the decompiler output.",
      "Find where input is compared to a value — look for strcmp, memcmp, cmp instructions.",
      "Rename variables and functions as you understand them — the decompiler output improves.",
      "For packed binaries (UPX): run upx -d to unpack first.",
      "For Python .pyc files: try uncompyle6 or pycdc to recover source.",
    ],
    tools: [
      { name: "Ghidra", description: "Free NSA decompiler — converts machine code to readable C pseudocode.", install: "ghidra.re (free download)" },
      { name: "IDA Free", description: "Industry-standard disassembler, free version covers most CTF binaries.", install: "hex-rays.com/ida-free" },
      { name: "Radare2 / Cutter", description: "Open-source RE framework; Cutter is its GUI frontend.", install: "apt install radare2; cutter.re" },
      { name: "pwndbg", description: "GDB extension useful for dynamic RE — step through execution.", install: "github.com/pwndbg/pwndbg" },
      { name: "ltrace / strace", description: "Trace library calls and syscalls at runtime.", install: "apt install ltrace strace" },
      { name: "uncompyle6", description: "Decompile Python bytecode (.pyc) to source.", install: "pip install uncompyle6" },
      { name: "dogbolt.org", description: "Online multi-decompiler — runs Ghidra, BinaryNinja, Hex-Rays at once.", install: "dogbolt.org (web, no install)" },
    ],
    practice: [
      { label: "Crackmes.one — community RE challenges", url: "https://crackmes.one" },
      { label: "PicoCTF — Reverse Engineering", url: "https://picoctf.org" },
      { label: "HackTheBox — RE challenges", url: "https://app.hackthebox.com/challenges" },
      { label: "TryHackMe — Reverse Engineering path", url: "https://tryhackme.com" },
      { label: "Nightmare — free RE course with challenges", url: "https://guyinatuxedo.github.io" },
    ],
  },
  {
    category: "osint",
    title: "OSINT",
    description: "Gather intelligence from public sources — no hacking required.",
    what: `OSINT (Open Source Intelligence) is finding information that's already public — you're not exploiting anything, you're just being clever about where to look. CTF OSINT challenges usually give you a username, an image, an email, or a domain and ask you to find some fact about it. The tricky part is the rabbit holes — document everything as you go, or you'll lose track of what you've tried.`,
    steps: [
      "Start with exactly what you're given — don't assume anything extra.",
      "For usernames: run sherlock, then manually check the top platforms.",
      "For images: run exiftool (GPS data?), then reverse image search on Google, Yandex, TinEye.",
      "For domains: whois, dig, check certificate transparency (crt.sh), Wayback Machine.",
      "For emails: check haveibeenpwned.com, search GitHub and Pastebin.",
      "Use Google Dorks: site:, filetype:, inurl:, intitle: to narrow results.",
      "Check LinkedIn, GitHub, Twitter — people post more than they realize.",
      "Document every URL, username, and fact you find — OSINT trails get confusing fast.",
    ],
    tools: [
      { name: "sherlock", description: "Check a username across 400+ social platforms.", install: "pip install sherlock-project" },
      { name: "Wayback Machine", description: "Access archived web pages to find deleted content.", install: "web.archive.org (web, no install)" },
      { name: "exiftool", description: "Extract GPS, camera, and timestamp metadata from images.", install: "apt install libimage-exiftool-perl" },
      { name: "Shodan", description: "Search engine for internet-connected devices.", install: "shodan.io (web) / pip install shodan" },
      { name: "Maltego", description: "Link analysis and graph visualization for OSINT.", install: "maltego.com (community edition free)" },
      { name: "theHarvester", description: "Gather emails, subdomains, and names from public sources.", install: "apt install theharvester / github.com/laramies/theHarvester" },
    ],
    practice: [
      { label: "TraceLabs CTF — missing persons OSINT", url: "https://www.tracelabs.org/competitions/search" },
      { label: "GeoGuessr — train your geolocation instincts", url: "https://www.geoguessr.com" },
      { label: "OSINT Framework — tool directory", url: "https://osintframework.com" },
      { label: "PicoCTF — OSINT challenges", url: "https://picoctf.org" },
      { label: "Bellingcat Online Investigation Toolkit", url: "https://bellingcat.gitbook.io/toolkit" },
    ],
  },
  {
    category: "misc",
    title: "Misc",
    description: "Everything that doesn't fit neatly elsewhere — encodings, puzzles, polyglots.",
    what: `Misc is the catch-all category: puzzles, unusual encodings, esoteric programming languages, QR codes, polyglot files, steganography variants, and anything creative the challenge author felt like making. The approach is: try the obvious things first, read the description very carefully for hints, and don't over-think it. A lot of misc challenges are 'did you know this encoding/language/trick exists?' — if you get stuck, Google the output format.`,
    steps: [
      "Always try common encodings first: base64, hex, ROT13, binary, morse.",
      "Run file and strings on any unknown file — it might not be what you think.",
      "Read the challenge description literally — the hint is often right there.",
      "Check for the flag pattern embedded in the data: FLAG{, CTF{, picoCTF{.",
      "If you see brackets, parentheses, or weird spacing: might be an esoteric language.",
      "For QR codes: try increasing contrast or upscaling before assuming it's broken.",
      "For substitution ciphers without spaces: try quipqiup.com first.",
      "If stuck for more than 30 minutes: take a break, re-read the description, ask for a nudge.",
    ],
    tools: [
      { name: "CyberChef", description: "Auto-detects and chains encoding/decryption operations.", install: "gchq.github.io/CyberChef (web, no install)" },
      { name: "dcode.fr", description: "100+ cipher solvers and encoding tools.", install: "dcode.fr (web, no install)" },
      { name: "quipqiup", description: "Automated monoalphabetic substitution cipher solver.", install: "quipqiup.com (web, no install)" },
      { name: "zbarimg", description: "Decode QR codes and barcodes from the command line.", install: "apt install zbar-tools" },
      { name: "tio.run", description: "Run 600+ programming languages online — great for esolangs.", install: "tio.run (web, no install)" },
      { name: "StegCloak", description: "Detect/decode zero-width character steganography.", install: "330k.github.io/StegCloak/ (web)" },
    ],
    practice: [
      { label: "PicoCTF — General Skills (misc)", url: "https://picoctf.org" },
      { label: "HackTheBox — Misc challenges", url: "https://app.hackthebox.com/challenges" },
      { label: "CTFtime — past CTF writeups (search misc)", url: "https://ctftime.org/writeups" },
    ],
  },
];

export function getGuideByCategory(category: string): GuideCategory | undefined {
  return GUIDE_DATA.find((g) => g.category === category);
}
