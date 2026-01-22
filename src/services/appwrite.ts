// TODO: Actually take a look at this file

import { Client, Storage, Databases, TablesDB, Account } from "appwrite";

// AppWrite configuration
const client = new Client()
  .setEndpoint(
    import.meta.env.VITE_APPWRITE_ENDPOINT || "YOUR_APPWRITE_ENDPOINT",
  )
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID");

export const storage = new Storage(client);
export const tableDB = new Databases(client);
export const tablesDB = new TablesDB(client);
export const account = new Account(client);

// Bucket configuration
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

export interface BookMetadata {
  $id: string;
  title: string;
  author: string;
  year: number;
  area: string;
  cover: string;
  fileId: string;
  language: string;
}
