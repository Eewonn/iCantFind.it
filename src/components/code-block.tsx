"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getHighlighter, detectLanguage } from "@/lib/syntax-highlight";

interface CodeBlockProps {
  code: string;
  className?: string;
  maxHeight?: string;
  label?: string;
  language?: string;
}

export default function CodeBlock({ code, className, maxHeight = "12rem", label, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    const lang = language ?? detectLanguage(code);
    let cancelled = false;

    getHighlighter().then((hl) => {
      if (cancelled) return;
      const html = hl.codeToHtml(code, {
        lang,
        theme: "tokyo-night",
        transformers: [
          {
            pre(node) {
              // Remove shiki's default styles we don't want
              delete node.properties["style"];
              delete node.properties["tabindex"];
            },
            code(node) {
              delete node.properties["style"];
            },
          },
        ],
      });
      setHighlightedHtml(html);
    });

    return () => { cancelled = true; };
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = code.split("\n");

  return (
    <div
      className={cn("relative group font-mono text-xs", className)}
      style={{ border: "1px solid #1c2d44", background: "#060c1a" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: "1px solid #1c2d44", background: "rgba(0,0,0,0.5)" }}
      >
        <span className="text-[10px] text-text-muted uppercase tracking-widest">
          {label ? `// ${label}` : "// SNIPPET"}
        </span>
        <button
          onClick={handleCopy}
          className="text-[10px] uppercase tracking-widest transition-all px-2 py-0.5"
          style={{
            border: `1px solid ${copied ? "#3fb950" : "#1c2d44"}`,
            color: copied ? "#3fb950" : "#607998",
            background: copied ? "rgba(63,185,80,0.08)" : "transparent",
          }}
        >
          {copied ? "COPIED()" : "COPY()"}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div
        className="overflow-x-auto"
        style={{
          maxHeight: maxHeight === "none" ? undefined : maxHeight,
          overflowY: maxHeight === "none" ? "visible" : "auto",
        }}
      >
        <div className="flex">
          {/* Line numbers */}
          <div
            className="select-none shrink-0 text-right py-3 pr-3 pl-3"
            style={{ borderRight: "1px solid #1a2030", color: "#1c2d44", minWidth: "2.5rem" }}
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-5 text-[10px]">{i + 1}</div>
            ))}
          </div>

          {/* Code — highlighted or plain fallback */}
          {highlightedHtml ? (
            <div
              className="flex-1 py-3 px-3 overflow-x-auto shiki-wrap"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre className="flex-1 py-3 px-3 text-foreground/85 leading-5 overflow-x-auto">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
