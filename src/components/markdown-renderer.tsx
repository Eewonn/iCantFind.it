import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content.trim()) {
    return (
      <p className="text-text-muted text-sm italic">No notes yet. Start writing above.</p>
    );
  }

  return (
    <div className={cn("prose prose-invert max-w-none text-sm", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mt-6 mb-3 border-b border-border-subtle pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold text-foreground mt-5 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold text-foreground mt-4 mb-1.5">{children}</h3>,
          p: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-3">{children}</p>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-ctf-blue hover:underline">{children}</a>,
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-[#080e1e] border border-border-subtle rounded-md p-3 font-mono text-xs text-foreground overflow-x-auto my-3">
                  {children}
                </code>
              );
            }
            return <code className="bg-surface-2 border border-border-subtle rounded px-1.5 py-0.5 font-mono text-xs text-ctf-orange">{children}</code>;
          },
          pre: ({ children }) => <>{children}</>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-foreground/90">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-foreground/90">{children}</ol>,
          li: ({ children }) => <li className="text-foreground/90">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-ctf-red/50 pl-4 my-3 text-text-muted italic">{children}</blockquote>
          ),
          strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-foreground/80">{children}</em>,
          hr: () => <hr className="border-border-subtle my-4" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full text-sm border-collapse border border-border-subtle">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border border-border-subtle px-3 py-2 bg-surface-2 text-left font-medium text-foreground">{children}</th>,
          td: ({ children }) => <td className="border border-border-subtle px-3 py-2 text-foreground/90">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
