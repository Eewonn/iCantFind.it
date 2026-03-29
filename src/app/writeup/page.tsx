export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import WriteupClient from "./writeup-client";
import type { Challenge } from "@/types";

export default async function WriteupPage() {
  const db = createSupabaseClient();
  const { data } = await db
    .from("challenges")
    .select("*")
    .order("updated_at", { ascending: false });

  const challenges: Challenge[] = data ?? [];

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="term-label text-text-muted mb-2">// WRITEUP.LOAD()</div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-5xl text-foreground tracking-wider">WRITEUP</h1>
            <p className="font-mono text-[10px] text-text-muted mt-1 uppercase tracking-widest">
              CHALLENGES.LENGTH = {challenges.length}
            </p>
          </div>
          <Link
            href="/writeup/new"
            className="term-btn-primary font-mono text-xs"
          >
            + NEW_CHALLENGE()
          </Link>
        </div>
      </div>

      <div
        style={{ border: "1px solid #1c2d44" }}
      >
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.35)" }}
        >
          <span className="term-label text-text-muted">// CHALLENGES.FILTER()</span>
          <span className="term-label text-text-muted/40">] // WRITEUP</span>
        </div>
        <div className="p-4">
          <WriteupClient challenges={challenges} />
        </div>
        <div
          className="px-4 py-2 term-label text-text-muted/40"
          style={{ borderTop: "1px solid #1c2d44" }}
        >
          &#125; // FILTER_END
        </div>
      </div>
    </div>
  );
}
