"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createChallenge } from "@/lib/actions";
import { CATEGORIES, DIFFICULTIES, STATUSES } from "@/lib/constants";
import type { Category, Difficulty, ChallengeStatus } from "@/types";

function TermField({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid #1c2d44" }}>
      <div
        className="flex items-center gap-2 px-3 py-1.5"
        style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.35)" }}
      >
        <span className="font-display text-base text-text-muted leading-none">[{index}]</span>
        <span className="term-label text-text-muted">// {label}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export default function NewChallengePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle]         = useState("");
  const [ctfName, setCtfName]     = useState("");
  const [category, setCategory]   = useState<Category>("web");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [points, setPoints]       = useState("");
  const [status, setStatus]       = useState<ChallengeStatus>("unsolved");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !ctfName.trim()) {
      toast.error("TITLE and CTF_NAME are required.");
      return;
    }
    startTransition(async () => {
      try {
        const challenge = await createChallenge({
          title: title.trim(),
          ctf_name: ctfName.trim(),
          category,
          difficulty,
          points: points ? parseInt(points) : null,
          status,
        });
        toast.success("CHALLENGE_CREATED()");
        router.push(`/notebook/${challenge.id}`);
      } catch {
        toast.error("ERROR: CREATE_FAILED");
      }
    });
  };

  const inputStyle = {
    background: "#060c1a",
    border: "1px solid #1c2d44",
    color: "#c4d0de",
    fontFamily: "var(--font-jetbrains-mono)",
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  const selectStyle = {
    background: "#060c1a",
    border: "1px solid #1c2d44",
    color: "#607998",
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="term-label text-text-muted mb-1">
          <Link href="/notebook" className="hover:text-ctf-red transition-colors">
            ← WRITEUP
          </Link>
          &nbsp;// NEW
        </div>
        <h1 className="font-display text-5xl text-foreground tracking-wider">
          NEW_CHALLENGE()
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{ border: "1px solid #1c2d44" }}
        >
          {/* Panel header */}
          <div
            className="px-4 py-2.5 flex justify-between items-center"
            style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.35)" }}
          >
            <span className="term-label text-text-muted">// CHALLENGE.CREATE &#123;</span>
            <span className="term-label text-text-muted/40">REQUIRED: TITLE, CTF_NAME</span>
          </div>

          <div className="p-4 space-y-3">
            <TermField index="00" label="CHALLENGE_TITLE *">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="BABY_SQLI"
                style={inputStyle}
                required
              />
            </TermField>

            <TermField index="01" label="CTF_NAME *">
              <Input
                value={ctfName}
                onChange={(e) => setCtfName(e.target.value)}
                placeholder="PICOCTF_2025"
                style={inputStyle}
                required
              />
            </TermField>

            <div className="grid grid-cols-2 gap-3">
              <TermField index="02" label="CATEGORY">
                <Select value={category} onValueChange={(v) => v && setCategory(v as Category)}>
                  <SelectTrigger className="text-xs font-mono uppercase tracking-wide w-full" style={selectStyle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className={`font-mono text-xs uppercase ${c.color}`}>
                        [{c.label}]
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TermField>

              <TermField index="03" label="DIFFICULTY">
                <Select value={difficulty} onValueChange={(v) => v && setDifficulty(v as Difficulty)}>
                  <SelectTrigger className="text-xs font-mono uppercase tracking-wide w-full" style={selectStyle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d.value} value={d.value} className={`font-mono text-xs uppercase ${d.color}`}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TermField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TermField index="04" label="POINTS (OPT)">
                <Input
                  type="number"
                  min="0"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="100"
                  style={inputStyle}
                />
              </TermField>

              <TermField index="05" label="STATUS">
                <Select value={status} onValueChange={(v) => v && setStatus(v as ChallengeStatus)}>
                  <SelectTrigger className="text-xs font-mono uppercase tracking-wide w-full" style={selectStyle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value} className={`font-mono text-xs uppercase ${s.color}`}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TermField>
            </div>
          </div>

          {/* Submit */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ borderTop: "1px solid #1c2d44", background: "rgba(0,0,0,0.2)" }}
          >
            <button
              type="submit"
              disabled={isPending}
              className="term-btn-primary"
            >
              {isPending ? "CREATING..." : "SUBMIT()"}
            </button>
            <Link href="/notebook" className="term-btn-ghost">
              CANCEL()
            </Link>
          </div>
        </div>
        <div className="term-label text-text-muted/40 mt-1">&#125; // CHALLENGE_END</div>
      </form>
    </div>
  );
}
