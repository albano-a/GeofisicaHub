/**
 * Script to upload PDFs from D:\Livros\GeofisicaHub\Cálculo\pt to AppWrite bucket
 * Run with: npx ts-node upload_pdfs.ts
 */

import { config } from "dotenv";
config();

import { Client, Storage, ID } from "appwrite";
import { InputFile } from "node-appwrite/file"; // Correct import for Node.js
import { readdir, readFile } from "fs/promises";
import { join } from "path";

// Load environment variables
const endpoint = process.env.VITE_APPWRITE_ENDPOINT as string;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID as string;
const bucketId = process.env.VITE_APPWRITE_BUCKET_ID as string;

if (!endpoint || !projectId || !bucketId) {
  console.error("Missing environment variables. Check your .env file.");
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId);
const storage = new Storage(client);

async function uploadPdfs() {
  const dirPath = "D:\\Livros\\GeofisicaHub\\Física\\en"; // Windows path

  try {
    const files = await readdir(dirPath);
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

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

      await storage.createFile(bucketId, fileId, inputFile); // Note: Using deprecated positional args; update to object style if needed
      console.log(`Uploaded: ${fileName} (ID: ${fileId})`);
    }

    console.log("All PDFs uploaded successfully.");
  } catch (error: any) {
    console.error("Upload failed:", error.message);
  }
}

uploadPdfs();
