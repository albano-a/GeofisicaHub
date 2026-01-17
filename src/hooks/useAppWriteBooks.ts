// TODO: Actually take a look at this file

import { useState, useEffect } from "react";
import {
  getAllPDFFiles,
  getBookMetadata,
  getFileDownloadUrl,
  getFilePreviewUrl,
  BookMetadata,
  BookFile,
} from "../services/appwrite";

export interface Book {
  title: string;
  description: string;
  cover: string;
  link: string;
  category?: string;
  fileId?: string;
}

export function useAppWriteBooks(category?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError(null);

        // Try to get metadata from database first
        let metadata = await getBookMetadata();

        // If no metadata, fall back to file list
        if (metadata.length === 0) {
          const files = await getAllPDFFiles();

          // Convert files to book format
          metadata = files.map((file) => ({
            fileId: file.$id,
            title: file.name.replace(".pdf", "").replace(/_/g, " "),
            description: `PDF file: ${file.name}`,
            cover:
              getFilePreviewUrl(file.$id, 300, 400) ||
              "/default-book-cover.jpg",
            category: category || "geophysics",
            downloadUrl: getFileDownloadUrl(file.$id),
          }));
        }

        // Filter by category if specified
        const filteredBooks = category
          ? metadata.filter((book) => book.category === category)
          : metadata;

        // Convert to Book format
        const booksData: Book[] = filteredBooks.map((book) => ({
          title: book.title,
          description: book.description,
          cover: book.cover,
          link: book.downloadUrl,
          category: book.category,
          fileId: book.fileId,
        }));

        setBooks(booksData);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err instanceof Error ? err.message : "Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [category]);

  return { books, loading, error, refetch: () => fetchBooks() };
}

// Hook for uploading books
export function useBookUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadBook = async (
    file: File,
    title: string,
    description: string,
    category: string = "geophysics"
  ) => {
    try {
      setUploading(true);
      setUploadError(null);

      const { uploadPDFFile } = await import("../services/appwrite");
      await uploadPDFFile(file, title, description);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setUploadError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return { uploadBook, uploading, uploadError };
}
