export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import { MOTIVATIONAL_LINES, CATEGORIES } from "@/lib/constants";
import CategoryBadge from "@/components/category-badge";
import StatusBadge from "@/components/status-badge";
import Logo from "@/components/logo";
import type { Challenge, Category } from "@/types";

async function getStats() {
  const db = createSupabaseClient();
  const { data: challenges } = await db
    .from("challenges")
    .select("id, category, status, title, ctf_name, updated_at")
    .order("updated_at", { ascending: false });

  if (!challenges || challenges.length === 0) {
    return { total: 0, solved: 0, solveRate: 0, topCategory: null, recent: [] };
  }

  const solved = challenges.filter((c) => c.status === "solved").length;
  const solveRate = Math.round((solved / challenges.length) * 100);

  const categoryCounts = challenges.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as Category | null;

  return {
    total: challenges.length,
    solved,
    solveRate,
    topCategory,
    recent: challenges.slice(0, 5) as Challenge[],
  };
}

function getMotivationalLine() {
  const day = new Date().getDate();
  return MOTIVATIONAL_LINES[day % MOTIVATIONAL_LINES.length];
}

export default async function DashboardPage() {
  const stats = await getStats();
  const tagline = getMotivationalLine();

  const quickLinks = [
    { href: "/cheatsheet", label: "CHEATSHEET()", index: "01", desc: "Payloads, snippets & techniques sorted by category." },
    { href: "/writeup",    label: "WRITEUP()",    index: "02", desc: "Track challenges and notes across every CTF you play." },
    { href: "/guide",      label: "GUIDE()",      index: "03", desc: "Step-by-step beginner guides for each challenge category." },
  ];

  const statItems = [
    { index: "00", key: "TOTAL_CHALLENGES", value: stats.total, color: "#c4d0de" },
    { index: "01", key: "SOLVED",           value: stats.solved, color: "#3fb950", glow: true },
    { index: "02", key: "SOLVE_RATE",       value: `${stats.solveRate}%`, color: "#58a6ff" },
    {
      index: "03",
      key: "TOP_CATEGORY",
      value: stats.topCategory
        ? (CATEGORIES.find((c) => c.value === stats.topCategory)?.label ?? "NULL").toUpperCase()
        : "NULL",
      color: "#ffa657",
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="term-label text-text-muted mb-2">// SYSTEM.INIT() → DASHBOARD_LOADED</div>
        <Logo size="lg" />
        <p className="font-mono text-[11px] text-text-muted mt-2 uppercase tracking-widest">
          a ctf notebook &amp; cheatsheet for people who definitely found the flag
        </p>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="term-label text-text-muted mb-3">
        // STATS.MAP((S) =&gt;
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        {statItems.map(({ index, key, value, color, glow }) => (
          <div key={key} className="card-float p-4">
            <div className="term-label text-text-muted mb-3">
              [{index}] // {key}
            </div>
            <div
              className="font-display text-5xl leading-none"
              style={{
                color,
                textShadow: glow
                  ? `0 0 8px ${color}aa, 0 0 20px ${color}44`
                  : undefined,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="term-label text-text-muted mb-8">)</div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="card-float flex flex-col">
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
          >
            <span className="term-label text-text-muted">// CHALLENGES.RECENT(5)</span>
            <Link
              href="/writeup"
              className="term-label text-ctf-red/70 hover:text-ctf-red transition-colors"
            >
              VIEW_ALL →
            </Link>
          </div>
          <div className="p-4 flex-1">
            {stats.recent.length === 0 ? (
              <div className="py-8 text-center">
                <div className="term-label text-text-muted mb-3">RESULT: NULL</div>
                <Link href="/writeup/new" className="term-btn-primary inline-block">
                  + ADD_CHALLENGE()
                </Link>
              </div>
            ) : (
              <div className="space-y-px" style={{ outline: "1px solid rgba(88,130,255,0.1)" }}>
                {stats.recent.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/writeup/${c.id}`}
                    className="dash-row-link flex items-center gap-3 px-3 py-2.5"
                  >
                    <span className="font-display text-lg text-text-muted shrink-0 leading-none">
                      {String(i).padStart(2, "0")}
                    </span>
                    <CategoryBadge category={c.category} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-foreground/80 truncate uppercase tracking-wide">
                        {c.title}
                      </p>
                      <p className="text-[10px] font-mono text-text-muted truncate">{c.ctf_name}</p>
                    </div>
                    <StatusBadge status={c.status} className="shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div
            className="px-4 py-2 term-label text-text-muted/40"
            style={{ borderTop: "1px solid rgba(88,130,255,0.08)" }}
          >
            &#125; // RECENT_END
          </div>
        </div>

        {/* Quick access */}
        <div className="card-float flex flex-col">
          <div
            className="px-4 py-2.5"
            style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
          >
            <span className="term-label text-text-muted">// ROUTES.QUICK_ACCESS()</span>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-3">
              {quickLinks.map(({ href, label, index, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="dash-row-link flex items-start gap-3 px-3 py-4"
                >
                  <span className="font-display text-2xl text-ctf-red/40 shrink-0 leading-none glow-red">
                    [{index}]
                  </span>
                  <div>
                    <p className="text-xs font-mono text-ctf-red uppercase tracking-widest mb-1.5">
                      {label}
                    </p>
                    <p className="font-desc">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div
            className="px-4 py-2 term-label text-text-muted/40"
            style={{ borderTop: "1px solid rgba(88,130,255,0.08)" }}
          >
            &#125; // ACCESS_END
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="mt-8 px-4 py-3 flex items-center justify-between card-float">
        <span className="term-label text-text-muted/40">&#125; // DASHBOARD_END</span>
        <span className="font-mono text-[10px] text-text-muted/50 italic">
          // {tagline}
        </span>
      </div>
    </div>
  );
}
