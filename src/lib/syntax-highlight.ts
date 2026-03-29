import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["tokyo-night"],
      langs: ["bash", "python", "html", "sql", "javascript", "c", "diff", "plaintext"],
    });
  }
  return highlighterPromise;
}

export function detectLanguage(code: string): string {
  const c = code.trim();

  // Python
  if (/^(from|import)\s+\w/m.test(c)) return "python";
  if (/\bdef\s+\w+\s*\(/.test(c)) return "python";
  if (/\bprint\s*\(/.test(c)) return "python";
  if (/bytes\.fromhex|b64decode|Crypto\.|gmpy2|pwnlib|pwn\.|elf\.|process\(|remote\(/.test(c)) return "python";

  // HTML / JS payloads
  if (/<(script|img|svg|iframe|input|a |body|meta)\b/i.test(c)) return "html";

  // SQL injection patterns
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE)\b/im.test(c)) return "sql";
  if (/'.*OR.*=.*'|UNION\s+SELECT/i.test(c)) return "sql";

  // Default: bash (shell commands, comments with #, etc.)
  return "bash";
}
