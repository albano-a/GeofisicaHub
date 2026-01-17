import { useState, useEffect } from "react";
import {
  tablesDB,
  storage,
  DATABASE_ID,
  COLLECTION_ID,
  BUCKET_ID,
} from "../services/appwrite";
import { Query } from "appwrite";

export interface Book {
  title: string;
  cover: string;
  author: string;
  link: string;
  fileId: string;
}

export function useAppWriteBooks(area: string, language: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const queries = [
          Query.or([
            Query.and([
              Query.equal("area", area),
              Query.equal("language", language),
            ]), // Match selected language
            Query.and([
              Query.equal("area", area),
              Query.equal("language", "en"),
            ]), // Fallback to English
          ]),
        ];
        const response = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          queries: queries,
        });
        const fetchedBooks: Book[] = response.rows.map((row) => ({
          title: row.title,
          cover: row.cover,
          author: row.author,
          link: storage.getFileDownload({
            bucketId: BUCKET_ID,
            fileId: row.fileId,
          }),
          fileId: row.fileId,
        }));
        setBooks(fetchedBooks);
      } catch (err: any) {
        setError(err.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [area, language]);

  return { books, loading, error };
}
