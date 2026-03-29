"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

const links = [
  { href: "/",           label: "DASHBOARD",  index: "00" },
  { href: "/cheatsheet", label: "CHEATSHEET", index: "01" },
  { href: "/writeup",    label: "WRITEUP",    index: "02" },
  { href: "/guide",      label: "GUIDE",      index: "03" },
];

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Sidebar — desktop */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 z-40 panel-ambient"
        style={{ borderRight: "1px solid #1c2d44", background: "#080e1e" }}
      >
        {/* Terminal title bar */}
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="term-label text-text-muted mb-0.5">
            INTERFACE_NAV &#123;
          </div>
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="term-label text-text-muted px-2 mb-3 opacity-50">
            ROUTES.MAP((R) =&gt;
          </div>

          {links.map(({ href, label, index }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-2 text-xs font-mono uppercase tracking-wider transition-all",
                  active
                    ? "term-label-active"
                    : "text-text-muted hover:text-foreground/70"
                )}
                style={active ? {
                  background: "rgba(247,129,102,0.05)",
                  borderLeft: "2px solid #f78166",
                  paddingLeft: "calc(0.5rem - 2px)",
                } : {
                  borderLeft: "2px solid transparent",
                }}
              >
                <span
                  className="font-display text-base shrink-0"
                  style={{ color: active ? "#f78166" : "#1c2d44", lineHeight: 1 }}
                >
                  [{index}]
                </span>
                <span className={active ? "glow-red" : ""}>{label}</span>
                {active && (
                  <span className="ml-auto text-ctf-red/60 cursor-blink text-[10px]">█</span>
                )}
              </Link>
            );
          })}

          <div className="term-label text-text-muted px-2 mt-3 opacity-50">
            )
          </div>
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid #1c2d44" }}
        >
          <div className="term-label text-text-muted/40 mb-1">&#125; // NAV_END</div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#3fb950", boxShadow: "0 0 4px #3fb950" }}
            />
            <span className="term-label text-text-muted/60">PUBLIC • NO_AUTH</span>
          </div>
        </div>
      </aside>

      {/* Bottom nav — mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ borderTop: "1px solid #1c2d44", background: "#080e1e" }}
      >
        <div className="flex">
          {links.map(({ href, label, index }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors",
                  active ? "text-ctf-red" : "text-text-muted"
                )}
              >
                <span className={cn("font-display text-lg leading-none", active && "glow-red")}>
                  [{index}]
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
