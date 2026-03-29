"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import CodeBlock from "@/components/code-block";
import CategoryBadge from "@/components/category-badge";
import { CATEGORIES } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase";
import type { CheatsheetEntry, Category } from "@/types";
import { cn } from "@/lib/utils";

const ALL_TABS = [{ value: "all", label: "ALL" }, ...CATEGORIES.map((c) => ({ value: c.value, label: c.label.toUpperCase() }))] as const;

export default function CheatsheetPage() {
  const [entries, setEntries]           = useState<CheatsheetEntry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch]             = useState("");

  useEffect(() => {
    const db = createSupabaseClient();
    db.from("cheatsheet_entries").select("*").order("category").then(({ data }) => {
      setEntries(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = entries;
    if (activeCategory !== "all") list = list.filter((e) => e.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.snippet.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [entries, activeCategory, search]);

  const currentCat = CATEGORIES.find((c) => c.value === activeCategory);

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="term-label text-text-muted mb-2">// CHEATSHEET.LOAD()</div>
        <h1 className="font-display text-5xl text-foreground tracking-wider">CHEATSHEET</h1>
        <p className="font-mono text-[10px] text-text-muted mt-1 uppercase tracking-widest">
          COMMON PAYLOADS, COMMANDS &amp; TECHNIQUES — SORTED BY CATEGORY
        </p>
      </div>

      {/* Controls */}
      <div className="card-float mb-8">
        <div
          className="px-4 py-2.5 flex items-center gap-4"
          style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
        >
          <span className="term-label text-text-muted">// FILTER()</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 term-label text-text-muted">$&gt;</span>
            <input
              placeholder="SEARCH(title, payload, tags...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-transparent font-mono text-xs uppercase tracking-wide text-foreground/80 focus:outline-none"
              style={{ border: "1px solid rgba(88,130,255,0.12)", background: "#060c1a" }}
            />
          </div>
          <span className="term-label text-text-muted/50">
            [{filtered.length}] RESULTS
          </span>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap" style={{ borderBottom: "1px solid rgba(88,130,255,0.1)" }}>
          {ALL_TABS.map((tab, i) => {
            const isActive = activeCategory === tab.value;
            const catDef = CATEGORIES.find((c) => c.value === tab.value);
            return (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={cn(
                  "px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-all",
                  isActive
                    ? tab.value === "all" ? "text-ctf-red" : catDef?.color
                    : "text-text-muted hover:text-foreground/60"
                )}
                style={{
                  borderRight: "1px solid rgba(88,130,255,0.08)",
                  borderBottom: isActive ? `2px solid ${
                    tab.value === "all" ? "#f78166" :
                    tab.value === "web" ? "#58a6ff" :
                    tab.value === "crypto" ? "#d2a8ff" :
                    tab.value === "forensics" ? "#3fb950" :
                    tab.value === "pwn" ? "#f78166" :
                    tab.value === "re" ? "#ffa657" :
                    tab.value === "osint" ? "#39d3bb" :
                    "#607998"
                  }` : "2px solid transparent",
                  background: isActive ? "rgba(247,129,102,0.04)" : "transparent",
                }}
              >
                [{String(i).padStart(2,"0")}] {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse card-float" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="term-label text-text-muted">RESULT: EMPTY_SET</div>
          {search && (
            <button onClick={() => setSearch("")} className="term-label text-ctf-red mt-2 hover:opacity-80">
              CLEAR_SEARCH()
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry, i) => (
            <CheatCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}

      {/* Cross-link */}
      {activeCategory !== "all" && currentCat && (
        <div className="mt-8 px-4 py-3 flex items-center justify-between card-float">
          <span className="term-label text-text-muted">
            // NEW TO [{currentCat.label.toUpperCase()}]? READ THE GUIDE →
          </span>
          <Link href={`/guide/${activeCategory}`} className="term-label text-ctf-blue hover:opacity-80 transition-opacity">
            GUIDE.OPEN()
          </Link>
        </div>
      )}

      <div className="mt-4 term-label text-text-muted/40">&#125; // CHEATSHEET_END</div>
    </div>
  );
}

function CheatCard({ entry, index }: { entry: CheatsheetEntry; index: number }) {
  return (
    <div className="card-float">
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-base text-text-muted leading-none">
            {String(index).padStart(2, "0")}
          </span>
          <CategoryBadge category={entry.category} />
          <h3 className="font-mono text-xs text-foreground/90 uppercase tracking-wide">
            {entry.title}
          </h3>
        </div>
        {entry.source_url && (
          <a
            href={entry.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-ctf-blue transition-colors shrink-0"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Body — side by side on md+ */}
      <div className="flex flex-col md:flex-row">
        {/* Left: description + tags */}
        <div
          className="px-4 py-3 md:w-56 lg:w-64 shrink-0 flex flex-col justify-between"
          style={{ borderRight: "1px solid rgba(88,130,255,0.08)" }}
        >
          <div>
            {entry.description && (
              <p className="font-desc mb-4">{entry.description}</p>
            )}
          </div>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-widest text-text-muted px-1.5 py-0.5"
                  style={{ border: "1px solid rgba(88,130,255,0.15)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: full-width code */}
        <div className="flex-1 p-4">
          <CodeBlock code={entry.snippet} maxHeight="none" />
        </div>
      </div>
    </div>
  );
}
