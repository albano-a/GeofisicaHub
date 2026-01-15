import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const shareOnTwitter = () => {
    const text = `Check this post: '${title}'`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Check this post: ${title}`,
          text: `Check this post: '${title}'`,
          url: url,
        })
        .catch(() => {
          // Fallback to opening window if share fails
          window.open(shareUrl, "_blank");
        });
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Check out: ${title}`,
          url: url,
        })
        .catch(() => {
          window.open(shareUrl, "_blank");
        });
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title)}&hashtag=${encodeURIComponent(url)}`;

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Check out: ${title}`,
          url: url,
        })
        .catch(() => {
          window.open(shareUrl, "_blank");
        });
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have a direct share URL, so we use Web Share API primarily
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Check out: ${title}`,
          url: url,
        })
        .catch(() => {
          // Fallback: try to open Instagram app or web
          window.open(
            `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
            "_blank"
          );
        });
    } else {
      window.open(
        `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here

      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const buttonClass =
    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div className="flex gap-3 mb-6 justify-center">
      <button
        onClick={shareOnTwitter}
        className={buttonClass}
        title="Share on Twitter"
      >
        <FaXTwitter className="text-blue-500 w-5 h-5" />
      </button>

      <button
        onClick={shareOnLinkedIn}
        className={buttonClass}
        title="Share on LinkedIn"
      >
        <FaLinkedin className="text-blue-700 w-5 h-5" />
      </button>

      <button
        onClick={shareOnFacebook}
        className={buttonClass}
        title="Share on Facebook"
      >
        <FaFacebook className="text-blue-600 w-5 h-5" />
      </button>

      <button
        onClick={shareOnInstagram}
        className={buttonClass}
        title="Share on Instagram"
      >
        <FaInstagram className="text-pink-500 w-5 h-5" />
      </button>

      <button onClick={copyLink} className={buttonClass} title="Copy link">
        <FaLink className="text-gray-600 dark:text-gray-400 w-5 h-5" />
      </button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={
          <button
            onClick={() => setSnackbarOpen(false)}
            className="text-white hover:text-gray-200 ml-2"
          >
            ✕
          </button>
        }
      />
    </div>
  );
}
