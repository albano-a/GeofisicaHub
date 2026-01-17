// TODO: Actually take a look at this file

import { Client, Storage, Databases, Query } from "appwrite";

// AppWrite configuration
const client = new Client()
  .setEndpoint(
    import.meta.env.VITE_APPWRITE_ENDPOINT || "YOUR_APPWRITE_ENDPOINT"
  )
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID");

export const storage = new Storage(client);
export const databases = new Databases(client);

// Bucket configuration
export const BUCKET_ID =
  import.meta.env.VITE_APPWRITE_BUCKET_ID || "YOUR_BUCKET_ID";
export const DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || "YOUR_DATABASE_ID";
export const COLLECTION_ID = "books_metadata";

export interface BookFile {
  $id: string;
  name: string;
  size: number;
  mimeType: string;
  title?: string;
  description?: string;
  cover?: string;
  category?: string;
}

export interface BookMetadata {
  fileId: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  downloadUrl: string;
}

/**
 * Get all PDF files from the AppWrite bucket
 */
export async function getAllPDFFiles(): Promise<BookFile[]> {
  try {
    const files = await storage.listFiles(BUCKET_ID, [
      Query.equal("mimeType", "application/pdf"),
      Query.orderDesc("$createdAt"),
    ]);
    return files.files as BookFile[];
  } catch (error) {
    console.error("Error fetching PDF files:", error);
    throw error;
  }
}

/**
 * Get download URL for a file
 */
export function getFileDownloadUrl(fileId: string): string {
  return storage.getFileDownload(BUCKET_ID, fileId);
}

/**
 * Get file preview URL (for thumbnails if available)
 */
export function getFilePreviewUrl(
  fileId: string,
  width?: number,
  height?: number
): string {
  return storage.getFilePreview(BUCKET_ID, fileId, width, height);
}

/**
 * Get book metadata from database (optional)
 * If you have a database collection with book metadata
 */
export async function getBookMetadata(): Promise<BookMetadata[]> {
  try {
    const documents = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return documents.documents.map((doc) => ({
      fileId: doc.fileId,
      title: doc.title,
      description: doc.description,
      cover: doc.cover,
      category: doc.category,
      downloadUrl: getFileDownloadUrl(doc.fileId),
    }));
  } catch (error) {
    console.error("Error fetching book metadata:", error);
    return [];
  }
}

/**
 * Upload a PDF file to the bucket
 */
export async function uploadPDFFile(
  file: File,
  title?: string,
  description?: string
): Promise<BookFile> {
  try {
    const result = await storage.createFile(BUCKET_ID, "unique()", file);

    // Optionally save metadata to database
    if (title && description) {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", {
        fileId: result.$id,
        title,
        description,
        category: "geophysics", // or detect from filename/path
        uploadDate: new Date().toISOString(),
      });
    }

    return result as BookFile;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}

/**
 * Delete a PDF file from the bucket
 */
export async function deletePDFFile(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
    // Also delete metadata if it exists
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, fileId);
    } catch (e) {
      // Metadata might not exist, ignore
    }
  } catch (error) {
    console.error("Error deleting PDF:", error);
    throw error;
  }
}
