import Prism from "prismjs";
// import "prismjs/themes/prism-twilight.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-ruby";
import { useEffect, useRef } from "react";

type Props = {
  code: string;
  // accept either `lang` or `language` since MDX callers often use `language`
  lang?: string;
  language?: string;
};

const languageMap: Record<string, string> = {
  py: "python",
  python: "python",
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  sh: "bash",
  bash: "bash",
  html: "markup",
  xml: "markup",
  c: "c",
  cpp: "cpp",
  java: "java",
  go: "go",
  rb: "ruby",
  ruby: "ruby",
};

export default function CodeBlock({ code, lang, language }: Props) {
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!codeRef.current) return;

    const incomingRaw = (lang ?? language ?? "").toString();
    const incoming = incomingRaw.trim().toLowerCase();
    const mappedLang = languageMap[incoming] ?? incoming;
    // Prism's languages object is untyped; use any to access by key.
    const languagesAny = Prism.languages as any;
    const grammar =
      mappedLang && languagesAny[mappedLang]
        ? languagesAny[mappedLang]
        : mappedLang && languagesAny[mappedLang.split("-")[0]]
          ? languagesAny[mappedLang.split("-")[0]]
          : null;

    try {
      if (grammar) {
        const html = Prism.highlight(code, grammar, mappedLang);
        codeRef.current.innerHTML = html;
      } else {
        // No grammar available: output plain text safely
        codeRef.current.textContent = code;
      }
    } catch (err) {
      codeRef.current.textContent = code;
    }
  }, [code, lang, language]);

  const classLang = (() => {
    const incomingRaw = (lang ?? language ?? "").toString();
    const incoming = incomingRaw.trim().toLowerCase();
    return languageMap[incoming] ?? incoming ?? "";
  })();

  return (
    <pre
      style={{
        fontSize: "1.2rem",
        lineHeight: 1.4,
        padding: "1rem",
        borderRadius: "0.375rem",
        overflowX: "auto",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <code ref={codeRef} className={`language-${classLang}`}>
        {code}
      </code>
    </pre>
  );
}
