import { useState } from "react";
import { Skeleton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { COVER_BUCKET_ID } from "../services/appwrite";

// AppWrite configuration for image URLs
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

  // Helper to check if cover is a URL
  function isUrl(str: string) {
    return /^https?:\/\//i.test(str);
  }

  // If cover is a URL, use it directly. If not, treat as Appwrite file ID
  let coverSrc = cover;
  if (!isUrl(cover)) {
    // Construct Appwrite preview URL for cover images
    coverSrc = `${APPWRITE_ENDPOINT}/storage/buckets/${COVER_BUCKET_ID}/files/${cover}/preview?project=${APPWRITE_PROJECT_ID}`;
  }

  return (
    <a
      href={`/viewer?fileId=${fileId}`}
      className="group flex flex-col h-full bg-white dark:bg-[#1f242d] rounded-xl shadow-md hover:shadow-2xl hover:shadow-geo-primary/20 transition-all duration-300 transform hover:-translate-y-2 border border-transparent dark:border-gray-700 max-w-[280px] overflow-hidden"
    >
      {/* Cover Container - Agora ocupa toda largura (sem padding) */}
      <div className="w-full relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
        {!imageLoaded && !imgError && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            sx={{ bgcolor: "rgba(0,0,0,0.1)" }}
          />
        )}

        {imgError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MenuBookIcon style={{ fontSize: 60, opacity: 0.3 }} />
          </div>
        ) : (
          <img
            src={coverSrc}
            alt={title}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-105 transition-transform duration-700`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[1px]">
          <span className="bg-white/95 text-geo-primary px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-geo-primary hover:text-white">
            Read Now <AutoStoriesIcon fontSize="small" />
          </span>
        </div>

        {/* Corner Icon */}
        <div className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 backdrop-blur-md">
          <OpenInNewIcon style={{ fontSize: 18 }} />
        </div>

        {/* Gradient na parte inferior da imagem para transição suave */}
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-300"></div>
      </div>

      {/* Info Container - Padding adicionado aqui */}
      <div className="flex flex-col gap-3 p-5 mt-auto text-left">
        <h2 className="text-lg leading-tight font-bold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-geo-primary dark:group-hover:text-geo-darkprimary transition-colors">
          {title}
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          <PersonIcon fontSize="small" className="text-geo-primary/80" />
          <span className="line-clamp-1 font-medium text-xs uppercase tracking-wide">
            {author || "Unknown Author"}
          </span>
        </div>
      </div>
    </a>
  );
}
