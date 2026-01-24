import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathProps {
  f: string;
  block?: boolean | string;
  caption?: string;
}

export default function Math({ f, block, caption }: MathProps) {
  // Accept boolean or HTML/MDX-style presence-only attributes (e.g. `<Math block />`).
  const isBlock = (() => {
    if (block === undefined) return false;
    if (typeof block === "boolean") return block;
    const val = String(block).toLowerCase().trim();
    if (val === "") return true; // presence without value -> treated as true
    return val !== "false" && val !== "0";
  })();

  if (isBlock) {
    return (
      <figure className="my-4">
        <div className="flex justify-center">
          <BlockMath math={f} />
        </div>
        {caption && (
          <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <span className="inline-flex flex-col items-center">
      <InlineMath math={f} />
      {caption && (
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
          {caption}
        </span>
      )}
    </span>
  );
}
