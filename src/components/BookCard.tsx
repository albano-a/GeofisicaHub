import { useState } from 'react';
import { Skeleton } from '@mui/material';

interface BookCardProps {
  cover: string;
  title: string;
  description: string;
  link: string;
}

export default function BookCard({
  cover,
  title,
  description,
  link,
}: BookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800 p-3 rounded-md shadow-md max-w-xs text-center transform transition hover:scale-105"
    >
      <div className="w-full h-0 relative pb-[140%] overflow-hidden rounded-md mb-3">
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            sx={{ borderRadius: '6px' }}
          />
        )}
        <img
          src={cover}
          alt={title}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <h2 className="text-lg font-semibold text-geo-primary dark:text-geo-darkprimary ">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-3 text-md line-clamp-3">
        {description}
      </p>
    </a>
  );
}
