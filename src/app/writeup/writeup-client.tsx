"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryBadge from "@/components/category-badge";
import StatusBadge from "@/components/status-badge";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/types";

interface Props {
  challenges: Challenge[];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function NotebookClient({ challenges }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [ctfFilter, setCtfFilter] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "updated">("updated");

  const filtered = useMemo(() => {
    let list = [...challenges];
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter((c) => c.category === categoryFilter);
    if (ctfFilter.trim()) {
      const q = ctfFilter.toLowerCase();
      list = list.filter((c) => c.ctf_name.toLowerCase().includes(q));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q) ||
          c.ctf_name.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return list;
  }, [challenges, search, statusFilter, categoryFilter, ctfFilter, sort]);

  if (challenges.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="term-label text-text-muted mb-4">RESULT: EMPTY_SET</div>
        <Link href="/writeup/new" className="term-btn-primary inline-block">
          + ADD_CHALLENGE()
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <Input
            placeholder="SEARCH(title, notes...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs uppercase tracking-wide"
            style={{ background: "#060c1a", border: "1px solid #1c2d44", color: "#c4d0de" }}
          />
        </div>
        <Input
          placeholder="CTF_NAME..."
          value={ctfFilter}
          onChange={(e) => setCtfFilter(e.target.value)}
          className="sm:w-44 text-xs uppercase tracking-wide"
          style={{ background: "#060c1a", border: "1px solid #1c2d44", color: "#c4d0de" }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger
            className="w-36 text-xs font-mono uppercase tracking-wide"
            style={{ background: "#060c1a", border: "1px solid #1c2d44", color: "#607998" }}
          >
            <SelectValue placeholder="STATUS" />
          </SelectTrigger>
          <SelectContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
            <SelectItem value="all" className="font-mono text-xs uppercase">ALL_STATUS</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value} className="font-mono text-xs uppercase">{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
          <SelectTrigger
            className="w-40 text-xs font-mono uppercase tracking-wide"
            style={{ background: "#060c1a", border: "1px solid #1c2d44", color: "#607998" }}
          >
            <SelectValue placeholder="CATEGORY" />
          </SelectTrigger>
          <SelectContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
            <SelectItem value="all" className="font-mono text-xs uppercase">ALL_CATS</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value} className="font-mono text-xs uppercase">{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => v && setSort(v as typeof sort)}>
          <SelectTrigger
            className="w-44 text-xs font-mono uppercase tracking-wide"
            style={{ background: "#060c1a", border: "1px solid #1c2d44", color: "#607998" }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ background: "#0d1629", border: "1px solid #1c2d44" }}>
            <SelectItem value="updated" className="font-mono text-xs uppercase">SORT: UPDATED</SelectItem>
            <SelectItem value="newest" className="font-mono text-xs uppercase">SORT: NEWEST</SelectItem>
            <SelectItem value="oldest" className="font-mono text-xs uppercase">SORT: OLDEST</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto font-mono text-[10px] text-text-muted uppercase tracking-wide">
          [{filtered.length}/{challenges.length}] RESULTS
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center term-label text-text-muted">
          NO_RESULTS — TRY DIFFERENT FILTERS
        </div>
      ) : (
        <div className="space-y-px" style={{ outline: "1px solid #1c2d44" }}>
          {filtered.map((c, i) => (
            <Link
              key={c.id}
              href={`/writeup/${c.id}`}
              className="flex items-center gap-3 px-3 py-3 group transition-all"
              style={{ background: "#080e1e", borderLeft: "2px solid transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor = "#f78166";
                (e.currentTarget as HTMLElement).style.background = "rgba(247,129,102,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                (e.currentTarget as HTMLElement).style.background = "#080e1e";
              }}
            >
              <span className="font-display text-xl text-text-muted shrink-0 leading-none w-6 text-center">
                {String(i).padStart(2, "0")}
              </span>
              <CategoryBadge category={c.category} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono text-foreground/85 truncate uppercase tracking-wide">
                    {c.title}
                  </p>
                  {c.points != null && (
                    <span className="text-[10px] text-ctf-orange font-mono shrink-0">{c.points}PTS</span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-text-muted truncate">{c.ctf_name}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn(
                  "text-[10px] font-mono uppercase hidden sm:block",
                  c.difficulty === "easy" ? "text-ctf-green"
                  : c.difficulty === "medium" ? "text-ctf-orange"
                  : "text-ctf-red"
                )}>
                  {c.difficulty}
                </span>
                <StatusBadge status={c.status} />
                <span className="text-[10px] text-text-muted font-mono hidden md:block">
                  {timeAgo(c.updated_at)} AGO
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
