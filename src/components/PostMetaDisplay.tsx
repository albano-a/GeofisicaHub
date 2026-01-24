import type { PostMeta } from "../pages/EachPost";
import DateRangeTwoToneIcon from "@mui/icons-material/DateRangeTwoTone";
import UpdateTwoToneIcon from "@mui/icons-material/UpdateTwoTone";

interface PostMetaDisplayProps {
  meta: PostMeta;
  /** Optional title size. If not provided, auto-sizes based on title length */
  titleSize?: string;
}

export default function PostMetaDisplay({
  meta,
  titleSize,
}: PostMetaDisplayProps) {
  // Auto-size based on title length if no size specified
  // Responsive: smaller on mobile, larger on desktop
  const getTitleSize = () => {
    if (titleSize) return titleSize;

    const length = meta.title.length;
    if (length <= 20) return "text-4xl md:text-5xl"; // Short titles: big and bold
    if (length <= 40) return "text-3xl md:text-4xl"; // Medium titles: standard size
    if (length <= 60) return "text-2xl md:text-3xl"; // Long titles: slightly smaller
    return "text-xl md:text-2xl"; // Very long titles: compact
  };

  const finalTitleSize = getTitleSize();
  return (
    <div className="mb-3 flex flex-col items-center text-center">
      <h1 className={`${finalTitleSize} font-bold mb-2`}>{meta.title}</h1>
      <p className="text-xl font-semibold mb-4">{meta.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="bg-geo-primary/10 dark:bg-geo-darkprimary/20 text-geo-primary dark:text-geo-darkprimary px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Post dates */}
      <div className="flex gap-4 text-sm font-semibold text-geo-primary dark:text-geo-darkprimary mt-6 mb-1 justify-center items-center">
        {meta.posted && (
          <span className="font-mono">
            <DateRangeTwoToneIcon fontSize="small" sx={{ color: "#1077bc" }} />{" "}
            Posted: {meta.posted}
          </span>
        )}
        {meta.updated && meta.updated !== meta.posted && (
          <span className="font-mono">
            <UpdateTwoToneIcon fontSize="small" sx={{ color: "#1077bc" }} />{" "}
            Updated: {meta.updated}
          </span>
        )}

        {meta.readingTime && (
          <span className="font-mono ml-2 inline-flex items-center gap-1 bg-geo-primary/10 dark:bg-geo-darkprimary/20 text-geo-primary dark:text-geo-darkprimary px-2 py-1 rounded-full text-sm">
            ⏱ {meta.readingTime} min read
          </span>
        )}
      </div>
    </div>
  );
}
