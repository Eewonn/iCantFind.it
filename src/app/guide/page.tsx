import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GUIDE_DATA } from "@/lib/guide-data";
import CategoryBadge from "@/components/category-badge";

const PRACTICE_PLATFORMS = [
  { label: "CTFtime", desc: "Find active CTF competitions and writeups", url: "https://ctftime.org" },
  { label: "picoCTF", desc: "Beginner-friendly CTF platform from Carnegie Mellon", url: "https://picoctf.org" },
  { label: "HackTheBox", desc: "Machines and challenges across all categories", url: "https://app.hackthebox.com/challenges" },
  { label: "TryHackMe", desc: "Guided learning paths, great for absolute beginners", url: "https://tryhackme.com" },
  { label: "OverTheWire", desc: "Classic wargames — Bandit is the perfect starting point", url: "https://overthewire.org/wargames" },
  { label: "CryptoHack", desc: "Cryptography-focused platform with excellent challenges", url: "https://cryptohack.org" },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="term-label text-text-muted mb-2">// GUIDE.LOAD()</div>
        <h1 className="font-display text-5xl text-foreground tracking-wider">BEGINNER_GUIDE</h1>
        <p className="font-mono text-[10px] text-text-muted mt-1 uppercase tracking-widest">
          SELECT A CATEGORY TO LEARN WHAT IT IS, HOW TO APPROACH IT, AND WHICH TOOLS TO USE
        </p>
      </div>

      {/* What is CTF panel */}
      <div className="card-float mb-6">
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
        >
          <span className="term-label text-text-muted">// WHAT_IS_CTF &#123;</span>
        </div>
        <div className="px-4 py-4">
          <p className="font-desc text-foreground/75 mb-3">
            CTF (Capture The Flag) competitions give you purposefully vulnerable systems and challenges to find hidden
            strings called flags. You join a competition or practice platform, pick a challenge, and try to find the
            flag — usually a string like{" "}
            <code
              className="font-mono text-ctf-orange px-1.5 py-0.5 text-[10px]"
              style={{ border: "1px solid rgba(88,130,255,0.15)", background: "#060c1a" }}
            >
              picoCTF&#123;s0me_r4ndom_string&#125;
            </code>
            . Submit it to get points. Harder challenges are worth more.
          </p>
          <p className="font-desc">
            Most beginners start with <span className="font-mono text-ctf-blue">WEB</span> or{" "}
            <span className="font-mono text-ctf-orange">MISC</span> — fast feedback loop, minimal setup. Look for writeups
            after competitions end — that&apos;s how most people actually learn.
          </p>
        </div>
        <div className="px-4 py-1.5 term-label text-text-muted/40" style={{ borderTop: "1px solid rgba(88,130,255,0.08)" }}>
          &#125; // CTF_END
        </div>
      </div>

      {/* Category cards */}
      <div className="mb-6">
        <div className="term-label text-text-muted mb-3">// CATEGORIES.LOAD() &#123;</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {GUIDE_DATA.map((g, i) => (
            <Link
              key={g.category}
              href={`/guide/${g.category}`}
              className="guide-category-link card-float flex flex-col p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base text-text-muted leading-none">
                    {String(i).padStart(2, "0")}
                  </span>
                  <CategoryBadge category={g.category} />
                </div>
                <span className="term-label text-text-muted/40">GUIDE.OPEN() →</span>
              </div>
              <p className="font-desc">{g.description}</p>
            </Link>
          ))}
        </div>
        <div className="term-label text-text-muted/40 mt-3">&#125; // CATEGORIES_END</div>
      </div>

      {/* Practice platforms */}
      <div className="mb-2">
        <div className="term-label text-text-muted mb-3">// PRACTICE_PLATFORMS &#123;</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {PRACTICE_PLATFORMS.map((p, i) => (
            <a
              key={p.label}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="guide-platform-link card-float flex items-start gap-3 px-4 py-3"
            >
              <span className="font-display text-base text-text-muted leading-none shrink-0 mt-0.5">
                {String(i).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-ctf-blue uppercase tracking-wide">{p.label}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-text-muted shrink-0" />
                </div>
                <p className="font-desc">{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="term-label text-text-muted/40 mt-3">&#125; // PLATFORMS_END</div>
      </div>

      <div className="mt-2 term-label text-text-muted/40">&#125; // GUIDE_END</div>
    </div>
  );
}
