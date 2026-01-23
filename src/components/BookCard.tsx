import { useState } from "react";
import { Skeleton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { COVER_BUCKET_ID } from "../services/appwrite";

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

interface BookCardProps {
  cover: string;
  title: string;
  author: string;
  fileId: string;
}

export default function BookCard({
  cover,
  title,
  author,
  fileId,
}: BookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function isUrl(str: string) {
    return /^https?:\/\//i.test(str);
  }

  let coverSrc = cover;
  if (!isUrl(cover)) {
    coverSrc = `${APPWRITE_ENDPOINT}/storage/buckets/${COVER_BUCKET_ID}/files/${cover}/preview?project=${APPWRITE_PROJECT_ID}`;
  }

  return (
    <a
      href={`/viewer?fileId=${fileId}`}
      className="group flex flex-col h-full max-w-[280px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {!imageLoaded && !imgError && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            className="absolute inset-0"
            sx={{ bgcolor: "rgba(0,0,0,0.06)" }}
          />
        )}

        {imgError ? (
          <div className="flex items-center justify-center h-full">
            <MenuBookIcon
              style={{ fontSize: 80, opacity: 0.15 }}
              className="text-gray-400"
            />
          </div>
        ) : (
          <img
            src={coverSrc}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="flex flex-col gap-2 mt-4 px-2 py-3 rounded-lg backdrop-blur-sm transition-all duration-500 group-hover:bg-white/60 dark:group-hover:bg-gray-800/30 group-hover:shadow-md">
        <h2 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-geo-primary dark:group-hover:text-geo-darkprimary transition-colors duration-300">
          {title}
        </h2>

        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-geo-primary/10 dark:bg-geo-primary/20 flex items-center justify-center flex-shrink-0">
            <PersonIcon
              style={{ fontSize: 12 }}
              className="text-geo-primary dark:text-geo-darkprimary"
            />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-1 tracking-wide">
            {author || "Unknown Author"}
          </span>
        </div>
      </div>
    </a>
  );
}
