import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function LessonReader({ markdown }: { markdown: string }) {
  return (
    <div className="min-w-0 space-y-5 leading-8 text-foreground/90 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-3 [&_.katex]:text-base">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h2: ({ children }) => (
            <h2 className="pt-7 text-2xl font-semibold leading-snug tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="pt-4 text-lg font-semibold text-foreground">
              {children}
            </h3>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="break-words font-medium text-accent-foreground underline underline-offset-4"
              target={href?.startsWith("https:") ? "_blank" : undefined}
              rel={href?.startsWith("https:") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6 marker:text-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6 marker:text-primary">
              {children}
            </ol>
          ),
          pre: ({ children }) => (
            <pre
              tabIndex={0}
              aria-label="Read-only code example"
              className="overflow-x-auto rounded-xl border bg-secondary/50 p-5 text-sm leading-7 focus-visible:outline-2 focus-visible:outline-primary"
            >
              {children}
            </pre>
          ),
          code: ({ children, className }) => (
            <code
              className={
                className ?? "rounded bg-secondary px-1 py-0.5 text-sm"
              }
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b bg-secondary/60 px-4 py-3 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b px-4 py-3">{children}</td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary bg-secondary/40 px-5 py-3">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="my-6 block rounded-xl border bg-white p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-4"
                aria-label={`${alt}. Open full-size figure in a new tab`}
              >
                <Image
                  src={src}
                  alt={alt ?? ""}
                  width={960}
                  height={540}
                  className="h-auto w-full"
                  unoptimized
                />
                <span className="mt-2 block px-2 text-center text-xs leading-relaxed text-muted-foreground">
                  {alt}{" "}
                  <span className="text-accent-foreground">
                    Open full size ↗
                  </span>
                </span>
              </a>
            ) : null,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
