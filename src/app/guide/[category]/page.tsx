import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getGuideByCategory, GUIDE_DATA } from "@/lib/guide-data";
import CategoryBadge from "@/components/category-badge";
import type { Category } from "@/types";

export function generateStaticParams() {
  return GUIDE_DATA.map((g) => ({ category: g.category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const guide = getGuideByCategory(category);
  if (!guide) return {};
  return { title: `${guide.title} Guide — iCantFind.it` };
}

export default async function CategoryGuidePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const guide = getGuideByCategory(category);
  if (!guide) notFound();

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="term-label text-text-muted mb-2">
          <Link href="/guide" className="hover:text-ctf-red transition-colors">
            ← GUIDE
          </Link>
          &nbsp;// {guide.category.toUpperCase()}
        </div>
        <div className="flex items-center gap-3 mb-1">
          <CategoryBadge category={guide.category as Category} />
        </div>
        <h1 className="font-display text-5xl text-foreground tracking-wider mt-2">
          {guide.title.toUpperCase().replace(/ /g, "_")}
        </h1>
        <p className="font-desc text-foreground/70 mt-3 max-w-prose">{guide.what}</p>
      </div>

      {/* Section 1 — Approach */}
      <div className="card-float mb-5">
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
        >
          <span className="term-label text-text-muted">// HOW_TO_APPROACH &#123;</span>
        </div>

        <div className="divide-y" style={{ borderColor: "rgba(88,130,255,0.08)" }}>
          {guide.steps.map((step, i) => (
            <div key={i} className="flex gap-4 px-4 py-4">
              <span className="font-display text-xl text-ctf-red shrink-0 leading-none mt-0.5">
                {String(i).padStart(2, "0")}
              </span>
              <p className="font-desc text-foreground/80">{step}</p>
            </div>
          ))}
        </div>

        <div className="px-4 py-1.5 term-label text-text-muted/40" style={{ borderTop: "1px solid rgba(88,130,255,0.08)" }}>
          &#125; // APPROACH_END
        </div>
      </div>

      {/* Section 2 — Tools */}
      <div className="card-float mb-5">
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
        >
          <span className="term-label text-text-muted">// TOOLS.LIST &#123;</span>
          <span className="term-label text-text-muted/40">[{guide.tools.length}] TOOLS</span>
        </div>

        {/* Table header */}
        <div
          className="grid grid-cols-[auto_1fr_1fr]"
          style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
        >
          <div className="px-4 py-2"><span className="term-label text-text-muted/50">TOOL</span></div>
          <div className="px-4 py-2"><span className="term-label text-text-muted/50">DESCRIPTION</span></div>
          <div className="px-4 py-2 hidden sm:block"><span className="term-label text-text-muted/50">INSTALL</span></div>
        </div>

        <div className="divide-y" style={{ borderColor: "rgba(88,130,255,0.07)" }}>
          {guide.tools.map((tool, i) => (
            <div key={tool.name} className="grid grid-cols-[auto_1fr_1fr]" style={{ background: i % 2 === 1 ? "rgba(0,0,0,0.15)" : "transparent" }}>
              <div className="px-4 py-3 font-mono text-xs text-ctf-orange font-medium whitespace-nowrap">{tool.name}</div>
              <div className="px-4 py-3"><p className="font-desc">{tool.description}</p></div>
              <div className="px-4 py-3 font-mono text-[10px] text-text-muted hidden sm:block">{tool.install}</div>
            </div>
          ))}
        </div>

        <div className="px-4 py-1.5 term-label text-text-muted/40" style={{ borderTop: "1px solid rgba(88,130,255,0.08)" }}>
          &#125; // TOOLS_END
        </div>
      </div>

      {/* Section 3 — Practice */}
      <div className="card-float mb-5">
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(88,130,255,0.1)", background: "rgba(0,0,0,0.2)" }}
        >
          <span className="term-label text-text-muted">// PRACTICE.RESOURCES &#123;</span>
          <span className="term-label text-text-muted/40">[{guide.practice.length}] LINKS</span>
        </div>

        <div className="divide-y" style={{ borderColor: "rgba(88,130,255,0.07)" }}>
          {guide.practice.map((p, i) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="guide-practice-link flex items-center gap-3 px-4 py-3"
            >
              <span className="font-display text-base text-text-muted shrink-0 leading-none">
                {String(i).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-ctf-blue uppercase tracking-wide flex-1">{p.label}</span>
              <ExternalLink className="w-2.5 h-2.5 text-text-muted shrink-0" />
            </a>
          ))}
        </div>

        <div className="px-4 py-1.5 term-label text-text-muted/40" style={{ borderTop: "1px solid rgba(88,130,255,0.08)" }}>
          &#125; // PRACTICE_END
        </div>
      </div>

      {/* Cross-link to cheatsheet */}
      <div className="card-float px-4 py-3 flex items-center justify-between">
        <span className="term-label text-text-muted">
          // LOOKING FOR PAYLOADS? CHECK THE CHEATSHEET →
        </span>
        <Link
          href={`/cheatsheet?category=${guide.category}`}
          className="term-label text-ctf-blue hover:opacity-80 transition-opacity"
        >
          CHEATSHEET.OPEN()
        </Link>
      </div>

      <div className="mt-3 term-label text-text-muted/40">&#125; // GUIDE_{guide.category.toUpperCase()}_END</div>
    </div>
  );
}
