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
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800 p-3 rounded-md shadow-md max-w-xs text-center transform transition hover:scale-105"
    >
      <div className="w-full h-0 relative pb-[140%] overflow-hidden rounded-md mb-3">
        <img
          src={cover}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold text-geo-primary dark:text-geo-darkprimary truncate">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-3">
        {description}
      </p>
    </a>
  );
}
