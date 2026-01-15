import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathProps {
  math: string;
  block?: boolean;
  caption?: string;
}

export default function Math({ math, block = false, caption }: MathProps) {
  if (block) {
    return (
      <figure className="my-4">
        <div className="flex justify-center">
          <BlockMath math={math} />
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
      <InlineMath math={math} />
      {caption && (
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
          {caption}
        </span>
      )}
    </span>
  );
}
