/**
 * Upload local PDF files to the configured Appwrite bucket.
 * Required env vars: VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID,
 * VITE_APPWRITE_BUCKET_ID, UPLOAD_PDFS_DIR.
 * Optional env var: APPWRITE_API_KEY.
 *
 * Run with: npx ts-node scripts/upload_pdfs.ts
 */

import { config } from "dotenv";
config();

import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const bucketId = process.env.VITE_APPWRITE_BUCKET_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const dirPath = process.env.UPLOAD_PDFS_DIR;

if (!endpoint || !projectId || !bucketId || !dirPath) {
  console.error("Missing environment variables. Check your .env file.");
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId);
if (apiKey) {
  client.setKey(apiKey);
}

const storage = new Storage(client);

async function uploadPdfs() {
  try {
    const files = await readdir(dirPath);
    const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      console.log("No PDF files found in the directory.");
      return;
    }

    console.log(`Found ${pdfFiles.length} PDF(s) to upload.`);

    for (const fileName of pdfFiles) {
      const filePath = join(dirPath, fileName);
      const buffer = await readFile(filePath);
      const fileId = ID.unique();
      const inputFile = InputFile.fromBuffer(buffer, fileName);

      await storage.createFile({
        bucketId,
        fileId,
        file: inputFile,
      });
      console.log(`Uploaded: ${fileName} (ID: ${fileId})`);
    }

    console.log("All PDFs uploaded successfully.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload failed:", message);
  }
}

uploadPdfs();
