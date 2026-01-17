import BookCard from "../../components/BookCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppWriteBooks } from "../../hooks/useAppWriteBooks";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Geophysics() {
  const { books, loading, error } = useAppWriteBooks("geophysics");
  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = t("HUB.Geophysics") + " | GeofisicaHub";
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-5 flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading geophysics books...
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
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-5 flex flex-col items-center justify-center">
        <h1 className="text-4xl py-10 font-bold text-geo-primary dark:text-geo-darkprimary mb-8">
          {t("HUB.Geophysics")}
        </h1>

        {books.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No books available yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Books will appear here once uploaded to the AppWrite bucket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <BookCard
                key={book.fileId || index}
                cover={book.cover}
                title={book.title}
                description={book.description}
                link={book.link}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
