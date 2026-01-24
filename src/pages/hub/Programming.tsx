import BookCard from "../../components/BookCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppWriteBooks } from "../../hooks/useAppWriteBooks";
import { Skeleton } from "@mui/material";
import { useSEO } from "../../hooks/useSEO";
import Divider from "@mui/material/Divider";
import Breadcrumb from "../../components/Breadcrumb";

import Metrics from "../../components/Metrics";

type SortOpt = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function Programming() {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "pt" ? "pt" : "en";
  const area = "Programming";
  const { books, loading, error } = useAppWriteBooks(area, language);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOpt>("name-asc");

  // Filter books based on search query (title or author, case-insensitive)
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === "name-asc") return a.title.localeCompare(b.title);
    if (sortOption === "name-desc") return b.title.localeCompare(a.title);
    // For date, since no date field, sort by title
    if (sortOption === "date-asc") return a.title.localeCompare(b.title);
    if (sortOption === "date-desc") return b.title.localeCompare(a.title);
    return 0;
  });

  useSEO({
    title: t("HUB.Programming"),
    description: `Free programming resources and books for students and professionals in geophysics and related fields.`,
    keywords: ["programming", "resources", "books", "geophysics"],
    url: "/hub/programming",
    type: "website",
    locale: i18n.language,
  });

  useEffect(() => {
    document.title = t("HUB.Programming") + " | GeofisicaHub";
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-10 flex flex-col items-center">
        {/* Header Section consistent with MaterialHub */}
        <section className="w-full max-w-7xl mx-auto pt-12 pb-6 px-4 flex flex-col items-center space-y-4">
          <div className="w-full">
            <Breadcrumb />
          </div>
          <h1 className="text-4xl md:text-5xl pb-2 text-center font-bold bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            {t("HUB.Programming")}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl">
            {t("HUB.ProgrammingDesc")}
          </p>
        </section>

        <Metrics loading showSort />

        <Divider
          sx={{
            width: { xs: "80%", md: "66%" },
            opacity: 0.6,
            mb: 5,
            borderColor: "gray.300",
            ".dark &": { borderColor: "gray.600" },
          }}
        />

        {/* Skeleton Content Section */}
        <div className="w-full max-w-[1600px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="transform hover:-translate-y-2 transition-transform duration-300 h-full"
              >
                <a className="group flex flex-col h-full max-w-[280px] pointer-events-none">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                      sx={{ bgcolor: "rgba(0,0,0,0.06)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  <div className="flex flex-col gap-2 mt-4 px-2 py-3 rounded-lg backdrop-blur-sm">
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={24}
                      className="mb-2"
                    />

                    <div className="flex items-center gap-1">
                      <Skeleton
                        variant="circular"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      <Skeleton variant="text" width="60%" height={16} />
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
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
          <h1 className="text-4xl md:text-5xl pb-2 text-center font-bold bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            {t("HUB.Programming")}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl">
            {t("HUB.ProgrammingDesc")}
          </p>
        </section>

        <Metrics
          label={t("HUB.BookCount")}
          value={filteredBooks.length} // Update to show filtered count
          onSearchChange={setSearchQuery}
          onSortChange={setSortOption}
          showSort={true}
        />

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
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-xl">
              {searchQuery
                ? "No books match your search."
                : "No books available yet."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchQuery
                ? "Try a different search term."
                : "Books will appear here once uploaded to the AppWrite bucket."}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[1600px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {sortedBooks.map((book, index) => (
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
