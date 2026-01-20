import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Image component that displays an image with optional caption.
 * 
 * @component
 * @param {ImageProps} props - The component props
 * @param {string} props.src - The image source URL
 * @param {string} props.alt - Alternative text for the image
 * @param {string} [props.caption] - Optional caption text displayed below the image
 * @param {string | number} [props.width] - Optional image width (CSS value or number)
 * @param {string | number} [props.height] - Optional image height (CSS value or number)
 * @param {string} [props.className=""] - Optional additional CSS classes to apply to the figure element
 * @returns {JSX.Element} A figure element containing an image and optional figcaption
 * 
 * @example
 * <Image 
 *   src="./image.jpg" 
 *   alt="Description" 
 *   caption="Image caption"
 *   width="100%"
 *   height="auto"
 * />
 */
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
