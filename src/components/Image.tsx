import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Image({
  src,
  alt,
  caption,
  width,
  height,
  className = "",
}: ImageProps) {
  const imageStyle: React.CSSProperties = {
    width: width || "auto",
    height: height || "auto",
  };

  return (
    <figure className={`my-6 ${className}`}>
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        className="rounded-lg shadow-md mx-auto block"
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
