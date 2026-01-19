import BookCard from "../../components/BookCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppWriteBooks } from "../../hooks/useAppWriteBooks";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSEO } from "../../hooks/useSEO";
import Divider from "@mui/material/Divider";
import Breadcrumb from "../../components/Breadcrumb";

export default function Programming() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "pt" ? "pt" : "en";
  const area = "Programming";
  const { books, loading, error } = useAppWriteBooks(area, lang);
  const { t } = useTranslation();

  useSEO({
    title: t("HUB.Programming"),
    description: `Free programming resources and books for students and professionals in geophysics and related fields.`,
    keywords: ["programming", "resources", "books", "geophysics"],
    url: "/hub/programming",
    type: "website",
    locale: i18n.language,
  });

  React.useEffect(() => {
    document.title = t("HUB.Programming") + " | GeofisicaHub";
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-5 flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading {area} books...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-5 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Books
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-geo-primary dark:bg-geo-darkprimary text-white px-4 py-2 rounded hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-10 flex flex-col items-center">
        {/* Header Section */}
        <section className="w-full max-w-7xl mx-auto pt-12 pb-6 px-4 flex flex-col items-center space-y-4">
          <div className="w-full">
            <Breadcrumb />
          </div>
          <h1 className="text-4xl md:text-5xl text-center font-bold bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            {t("HUB.Programming")}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl">
            Free programming resources and books for students and professionals.
          </p>
        </section>

        <Divider
          sx={{
            width: { xs: "80%", md: "66%" },
            opacity: 0.6,
            mb: 5,
            borderColor: "gray.300",
            ".dark &": { borderColor: "gray.600" },
          }}
        />

        {/* Content Section */}
        {books.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-xl">
              No books available yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Books will appear here once uploaded to the AppWrite bucket.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[1600px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {books.map((book, index) => (
                <div
                  key={index}
                  className="transform hover:-translate-y-2 transition-transform duration-300 h-full"
                >
                  <BookCard
                    cover={book.cover}
                    title={book.title}
                    author={book.author}
                    fileId={book.fileId}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
