import { Link } from "react-router-dom";
import type { PostMeta } from "../pages/EachPost";
import DateRangeTwoToneIcon from "@mui/icons-material/DateRangeTwoTone";
import UpdateTwoToneIcon from "@mui/icons-material/UpdateTwoTone";
interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post.slug}`}
      className="flex flex-col bg-white dark:bg-geo-primary/20 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-geo-primary transition-shadow p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {post.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {post.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-geo-primary/10 dark:bg-geo-darkprimary/20 text-geo-primary dark:text-geo-darkprimary px-2 py-1 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
        {post.posted && (
          <span className="flex items-center gap-1">
            <DateRangeTwoToneIcon fontSize="small" sx={{ color: "#1077bc" }} />
            {post.posted}
          </span>
        )}
        {post.updated && post.updated !== post.posted && (
          <span className="flex items-center gap-1">
            <UpdateTwoToneIcon fontSize="small" sx={{ color: "#1077bc" }} />
            {post.updated}
          </span>
        )}
      </div>
    </Link>
  );
}
