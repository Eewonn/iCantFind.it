-- iCantFind.it — Improved cheatsheet descriptions
-- Run this against your Supabase DB to update descriptions in place.

-- WEB
update cheatsheet_entries set description = 'Use these when a login form or URL parameter passes input directly into a SQL query. The -- comment truncates the rest of the query, making the WHERE condition always true. Try each payload and observe whether the response changes.' where title = 'SQL Injection — Auth Bypass';

update cheatsheet_entries set description = 'Probe for reflected or stored XSS before escalating to a real payload. If alert(1) fires, try stealing cookies with the fetch payload. The last variant tests for attribute context escaping — swap the quotes if the simpler ones are blocked.' where title = 'XSS — Basic Probes';

update cheatsheet_entries set description = 'Works when PHP passes a file parameter to include() without sanitization. Escalate from reading /etc/passwd to RCE via log poisoning (inject PHP into the User-Agent, then include the log file) or php://input if file uploads are enabled.' where title = 'Local File Inclusion (LFI)';

update cheatsheet_entries set description = 'Run directory fuzzing as one of your first steps on any web target. ffuf is the fastest option; -fc 404 filters false positives. Common finds include admin panels, .git directories, backup files (.bak, .old), and undocumented API routes.' where title = 'Directory Fuzzing';

update cheatsheet_entries set description = 'Try these in any input field that could feed into a shell command — ping boxes, filename parameters, search fields. Semicolons chain commands; backticks and $() work in bash contexts. URL-encode the payload if submitting via a GET parameter.' where title = 'Command Injection';

update cheatsheet_entries set description = 'Exploits a server that fetches URLs you control. Point it at AWS or GCP metadata endpoints to retrieve IAM credentials. If localhost is filtered, try 0.0.0.0, the IPv6 loopback [::1], or decimal/octal representations of 127.0.0.1.' where title = 'SSRF — Internal Host Probes';

update cheatsheet_entries set description = 'Start by decoding the payload without verification to see the claims — the role or admin field is usually the target. The none algorithm attack works when the server accepts unsigned tokens. Weak secrets like "secret" or "password" are crackable in seconds with hashcat.' where title = 'JWT — Decode & Attack';

update cheatsheet_entries set description = 'Set your browser to proxy through 127.0.0.1:8080. Use Repeater to tweak and replay individual requests, Intruder to fuzz parameters at scale, and Match & Replace to automatically patch values in every request — useful for swapping role IDs or auth tokens.' where title = 'Burp Suite Quick Reference';

-- CRYPTO
update cheatsheet_entries set description = 'The first thing to try on any mystery string. If it ends in = it is probably Base64; if it is all 0–9 and a–f, it is hex; letter-for-letter substitution of alphabet characters suggests ROT13. When in doubt, paste into CyberChef Magic and let it detect automatically.' where title = 'Base64 / Hex / ROT13 Decode';

update cheatsheet_entries set description = 'A pure shift cipher with only 26 possible keys. Run this script when you see garbled text that has a normal letter distribution — the correct shift produces readable English. The shift amount is often a meaningful number (13 for ROT13, year for historical-themed challenges).' where title = 'Caesar Cipher Brute Force';

update cheatsheet_entries set description = 'Single-byte XOR is trivially brute-forced — only 256 possible keys. Filter results for printable ASCII to find the plaintext automatically. For multi-byte XOR, find the key length first using Hamming distance or Kasiski analysis, then treat each column as a single-byte XOR problem.' where title = 'XOR Cipher';

update cheatsheet_entries set description = 'hashid or hash-identifier tells you the hash type from its length and character set. CrackStation handles most MD5 and SHA1 hashes instantly if the password is in a known wordlist. For harder hashes use hashcat with rules — rockyou plus best64.rule covers most CTF challenge passwords.' where title = 'Hash Identification & Cracking';

update cheatsheet_entries set description = 'If n is small enough (under ~512 bits) or is a known modulus, you can factor it and reconstruct the private key. Always check factordb.com first — someone may have already factored it. gmpy2.iroot() is the fastest way to trial-divide in Python without importing heavy libraries.' where title = 'RSA — Small/Weak Primes';

update cheatsheet_entries set description = 'The Index of Coincidence measures how non-random a text is — English scores ~0.065, random noise ~0.038. Testing different key lengths until the IoC peaks tells you the correct length. Once you know it, each column is an independent Caesar cipher. dcode.fr handles the full attack automatically.' where title = 'Vigenere Cipher Attack';

update cheatsheet_entries set description = 'In English, E appears ~12.7% of the time, followed by T, A, O, I, N. Map your most frequent ciphertext letters to these and use common bigrams (TH, HE) and trigrams (THE, AND) to progressively fill in the rest. quipqiup.com automates this entire process.' where title = 'Frequency Analysis';

update cheatsheet_entries set description = 'The attack you use depends on what parameters are given. Small e with small plaintext: e-th root. Same n with different e values and gcd(e1,e2)=1: common modulus attack. Very large e (meaning small d): Wiener attack. Same message to multiple recipients with e=3: Hastad broadcast. RsaCtfTool automates all of these.' where title = 'RSA — Common Attack Cheatsheet';

-- FORENSICS
update cheatsheet_entries set description = 'Run these before anything else on any mystery file. The file command reads magic bytes and ignores extensions — a JPEG renamed to .txt is still a JPEG. strings often reveals embedded passwords, flags, or internal paths. xxd lets you inspect the raw bytes when magic detection is ambiguous.' where title = 'file + strings — First Steps';

update cheatsheet_entries set description = 'Images routinely contain GPS coordinates, camera model, software version, and author comments that challenge authors plant deliberately. The thumbnail field sometimes stores an unmodified version of an image that was cropped or edited — extracting it can reveal the full original.' where title = 'exiftool — Metadata Extraction';

update cheatsheet_entries set description = 'Files can contain entire archives, firmware images, or extra files hidden past the EOF marker — binwalk finds and extracts them. Use -Me for recursive extraction of nested containers. The entropy scan (-E) distinguishes compressed/encrypted regions from plain data, which shapes your approach.' where title = 'binwalk — Extract Embedded Files';

update cheatsheet_entries set description = 'For web challenges, right-click a packet and choose Follow HTTP Stream to read full request/response pairs in plain text. File → Export Objects recovers transferred files. The frame contains filter is the fastest way to search an entire capture for a flag string without scrolling through thousands of packets.' where title = 'Wireshark — CTF Filters';

update cheatsheet_entries set description = 'steghide hides data inside the DCT coefficients of JPEG files, making it invisible to the eye and to most tools. Always try an empty passphrase first — many challenge authors use none. stegseek is orders of magnitude faster than manual brute-forcing and handles the full rockyou wordlist in seconds.' where title = 'Steghide — Hide/Extract Data';

update cheatsheet_entries set description = 'LSB steganography hides data in the lowest bit of each pixel channel — a change of 1 in 255 is imperceptible but encodes a full bit of hidden data. zsteg -a tries all channel and bit combinations automatically. stegsolve gives a visual bit-plane viewer that often reveals hidden images or patterns.' where title = 'PNG LSB Steganography';

update cheatsheet_entries set description = 'Flags hidden in spectrograms are literally drawn as text using frequencies — switch to spectrogram view and the flag appears visually. The sox command generates a spectrogram image from the command line without needing a GUI. High-frequency content that looks like noise in waveform view often becomes readable in spectrogram view.' where title = 'Audacity — Spectrogram Analysis';

update cheatsheet_entries set description = 'zip2john extracts a crackable hash that John or hashcat can attack with a wordlist. fcrackzip is faster for short passwords. If a ZIP refuses to open entirely, the local file headers may be corrupted — zip -FF scans for valid headers and reconstructs a working archive from whatever it finds.' where title = 'ZIP / Archive Attacks';

-- PWN
update cheatsheet_entries set description = 'Run checksec before writing a single line of exploit code — it determines your entire strategy. NX rules out shellcode. PIE means all addresses are randomized and you need a memory leak. A stack canary means you need a separate leak to bypass it. No protections means a straightforward overflow.' where title = 'checksec — Binary Protections';

update cheatsheet_entries set description = 'A De Bruijn sequence has every 4-byte subsequence unique, so the value in RIP or EIP after a crash tells you exactly where in the pattern the overwrite occurred. cyclic_find() converts that value directly to the byte offset. Verify by sending exactly that many A bytes followed by 8 B bytes and confirming RIP = 0x4242424242424242.' where title = 'Find Buffer Overflow Offset';

update cheatsheet_entries set description = 'The simplest binary exploitation scenario: a win() function already exists in the binary that calls system() or prints the flag — you just need to redirect execution there. On 64-bit targets, a ret gadget before win() fixes SSE stack alignment that would otherwise crash in system().' where title = 'ret2win — Basic ROP';

update cheatsheet_entries set description = 'If user input is passed directly to printf() without a format string argument — printf(buf) instead of printf("%s", buf) — you control the format. Use %p to walk the stack and find the canary value, or %s to dereference an address you provide. The fmtstr_payload helper automates writes.' where title = 'Format String Exploit';

update cheatsheet_entries set description = 'When the stack is non-executable (NX), you chain existing code instead. Stage 1 leaks the runtime address of a libc function via puts() to defeat ASLR and calculate libc base. Stage 2 uses that base to call system("/bin/sh") with /bin/sh as the argument. This two-stage pattern is the foundation of most modern binary exploitation.' where title = 'ret2libc — Leak & Return';

update cheatsheet_entries set description = 'pwndbg transforms GDB into a proper exploitation workbench. The stack command shows a clean, labeled stack dump; vmmap shows the full memory layout with permissions. Feed your exploit script directly into the binary with r < <(python3 exploit.py) to test without writing to a file.' where title = 'GDB + pwndbg Cheatsheet';

update cheatsheet_entries set description = 'ROP chains work by jumping between small code sequences that end in ret, each setting up registers or stack values for the next. pop rdi ; ret is the most important gadget on x86-64 — it loads the first function argument. Search libc as well as the binary since libc contains far more useful gadgets.' where title = 'ROPgadget — Find Gadgets';

update cheatsheet_entries set description = 'one_gadget finds locations in libc where a single call spawns a shell — no need to manually set up /bin/sh as an argument. Each gadget has constraints on register or stack values that must be satisfied at call time. Pick the gadget whose constraints match what your exploit can control, or add a short ret chain to clear them.' where title = 'one_gadget — Magic Gadget';

-- RE
update cheatsheet_entries set description = 'Establish what you are dealing with before opening a decompiler. file reads magic bytes and catches executables disguised as other file types. strings on an unstripped binary often reveals hardcoded passwords, error messages, or the flag itself. Symbol names from nm tell you exactly which functions are worth examining.' where title = 'Initial Binary Triage';

update cheatsheet_entries set description = 'ltrace is often the fastest path to a flag: if the binary checks your input with strcmp(), the correct string appears in plain text in the trace output — no reversing required. strace reveals which files the binary opens, useful for finding what it reads and whether it accesses a flag file directly.' where title = 'ltrace + strace — Runtime Tracing';

update cheatsheet_entries set description = 'Ghidra produces readable C-like pseudocode from machine code — let the auto-analysis finish before exploring. Rename variables and functions as you understand them: transforming param_1 into user_input and local_10 into stored_password makes the logic immediately legible. Start at main and follow the call graph.' where title = 'Ghidra Quick Start';

update cheatsheet_entries set description = 'Work backwards from success and failure output strings to find the comparison instruction — this is the core RE skill. In Ghidra, right-click a string and choose Show References to jump straight to where it is used. The value being compared against your input is usually your answer.' where title = 'Find Key Comparison in Assembly';

update cheatsheet_entries set description = 'Python .pyc files compile down to bytecode that can be decompiled back to near-original source. The tool you need depends on the Python version encoded in the magic bytes. If all decompilers fail, dis.dis() gives you readable bytecode instructions that reveal the logic even without full source recovery.' where title = 'Python Bytecode Decompile';

update cheatsheet_entries set description = 'r2 is the CLI alternative to Ghidra — faster to launch and well-suited to scripting. pdf disassembles the current function; VV shows a visual call graph you can navigate with arrow keys. Use iz to list all strings and the / command to search memory for any byte pattern including the flag prefix.' where title = 'Radare2 Basics';

update cheatsheet_entries set description = 'UPX-packed binaries have their real code hidden inside a decompression stub — file and strings will tell you it is packed. A single upx -d command unpacks it into fully analyzable code. If unpacking fails, the packer magic bytes may have been deliberately corrupted as an anti-analysis trick; fix 55 50 58 21 in a hex editor and retry.' where title = 'UPX Unpacking';

update cheatsheet_entries set description = '.NET and Java compile to intermediate bytecode rather than native machine code, making decompilation nearly lossless. jadx produces clean, readable Java from APKs and JARs. For .NET, dnSpy or ILSpy restores near-original C# including variable names and control flow — often indistinguishable from the real source.' where title = '.NET / Java Decompilation';

-- OSINT
update cheatsheet_entries set description = 'Google operators narrow searches to specific sites, file types, and content. site: combined with filetype: finds exposed documents. intitle:"index of" surfaces open directory listings. The GitHub and pastebin dorks are especially powerful for finding accidentally committed credentials or internal configuration.' where title = 'Google Dorks';

update cheatsheet_entries set description = 'Sherlock checks hundreds of platforms in seconds and prints live results as it finds them. Cross-reference profile pictures, bio text, and linked accounts across platforms — people reuse usernames and often link everything together. A GitHub username frequently leads to a real name via commit history.' where title = 'Username Enumeration';

update cheatsheet_entries set description = 'Targets often delete sensitive files without realizing they are archived. Old JavaScript files frequently contain API keys, internal endpoints, and configuration that was later removed. gau combines Wayback Machine, OTX, and URLScan into a single URL list — filter for .js, .php, and admin paths.' where title = 'Wayback Machine & URL Recon';

update cheatsheet_entries set description = 'Yandex significantly outperforms Google for matching faces and landmarks in reverse image search. EXIF GPS coordinates survive uploads to many platforms that do not strip metadata. Convert degrees-minutes-seconds to decimal degrees and paste directly into Google Maps to identify the location.' where title = 'Image Reverse Search & EXIF';

update cheatsheet_entries set description = 'TXT records sometimes contain flags placed there deliberately by challenge authors. Certificate transparency logs via crt.sh reveal every subdomain that ever had a TLS certificate — no active scanning needed, completely passive. subfinder and amass find subdomains that may host staging environments or forgotten services.' where title = 'DNS & Domain Recon';

update cheatsheet_entries set description = 'Deleted commits are still in git history — git log -p exposes every change ever made including removed credentials. trufflehog scans entire repositories and organization histories automatically, matching patterns for API keys, tokens, and private keys. Check Gists too, which are often overlooked.' where title = 'GitHub OSINT';

update cheatsheet_entries set description = 'Shodan indexes banners and certificates from every open port on the internet. The ssl: filter finds all IPs presenting a certificate for a domain — useful for discovering infrastructure hidden behind Cloudflare or other CDNs. Censys has richer certificate chain data and supports more precise boolean queries.' where title = 'Shodan & Censys Recon';

update cheatsheet_entries set description = 'hunter.io deduces email formats from publicly known addresses at a domain. HIBP tells you which data breaches an email appeared in. Dehashed and Snusbase provide the actual leaked passwords — these are frequently reused on challenge login forms, so a breach hit is often an immediate credential.' where title = 'Email & Breach Intel';

-- MISC
update cheatsheet_entries set description = 'Learn to recognize each encoding by sight: Base64 has mixed case with = padding, hex is only 0–9 and a–f, binary is groups of 8 zeros and ones, Morse is dots and dashes with slashes as word separators. When unsure, paste into CyberChef Magic — it detects and chains multiple layers automatically.' where title = 'Common Encodings Quick Reference';

update cheatsheet_entries set description = 'The Magic operation runs statistical analysis on your input and suggests a decoding recipe. For multi-step challenges — Base64 then Gunzip then XOR then AES — you build each step into the Recipe and they execute in sequence. Share or bookmark a recipe by saving it as a URL from the hamburger menu.' where title = 'CyberChef Magic Mode';

update cheatsheet_entries set description = 'After extracting an archive or memory dump, grep for flag patterns before analyzing manually — it is faster than reading everything. The -oP flags extract just the matching substring. Run it recursively on extracted directories; the flag may be nested several layers deep inside archives or binary blobs.' where title = 'Flag Format Regex Hunt';

update cheatsheet_entries set description = 'zbarimg decodes most intact QR codes in a single command. If a QR is partially obscured or corrupted, QRazyBox lets you manually redraw missing modules in a browser editor and still decode — QR codes have built-in error correction covering up to 30% data loss, so partial codes are often still recoverable.' where title = 'QR Code Decode & Repair';

update cheatsheet_entries set description = 'quipqiup.com solves most monoalphabetic substitution ciphers automatically by optimizing a letter mapping against a word frequency model. For manual solving, start with single-letter words (A or I), then three-letter words (THE, AND), and use the frequency order E T A O I N S H to make educated guesses.' where title = 'Substitution Cipher Solving';

update cheatsheet_entries set description = 'Brainfuck and Ook are the most common esoteric languages in CTFs — Brainfuck uses +, -, [, ], <, >, ., and , while Ook maps each command to word pairs. Whitespace programs look completely empty but encode logic in invisible space and tab characters. tio.run runs over 600 languages and is the fastest way to execute unknown code.' where title = 'Esoteric Languages';

update cheatsheet_entries set description = 'Zero-width characters (U+200B, U+200C, U+FEFF, etc.) are completely invisible in any text editor but encode data through their sequence. cat -A and hexdump reveal them immediately. Homoglyph attacks substitute visually identical Unicode characters for ASCII — the text looks correct but the bytes differ, which matters when comparing strings.' where title = 'Hidden Text & Steganography';

update cheatsheet_entries set description = 'Python handles arbitrary-base arithmetic natively. int() parses a string in any base from 2 to 36; bin(), oct(), and hex() convert back. For groups of space-separated values (common in CTF challenges), the one-liner chr(int(b, 2)) pattern converts each group to its ASCII character in a single expression.' where title = 'Binary / Multi-Base Conversion';
