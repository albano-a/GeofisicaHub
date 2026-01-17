#!/usr/bin/env node

/**
 * Quick test script to verify AppWrite connection
 * Run with: node test_appwrite.js
 */
import { config } from "dotenv";
import { writeFile } from "fs/promises";
import { join } from "path";
config();

import { Client, Storage, Databases, Query } from "appwrite";

// Load environment variables
const endpoint: string | undefined = process.env.VITE_APPWRITE_ENDPOINT;
const projectId: string | undefined = process.env.VITE_APPWRITE_PROJECT_ID;
const bucketId: string | undefined = process.env.VITE_APPWRITE_BUCKET_ID;
const databaseId: string | undefined = process.env.VITE_APPWRITE_DATABASE_ID;
const collectionId: string | undefined =
  process.env.VITE_APPWRITE_COLLECTION_ID;

async function testConnection(): Promise<void> {
  console.log("🧪 Testing AppWrite connection...\n");

  if (!endpoint || !projectId || !bucketId || !databaseId || !collectionId) {
    console.error("❌ Missing environment variables. Check your .env file.");
    return;
  }

  try {
    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    const storage = new Storage(client);
    const databases = new Databases(client);

    console.log("📡 Endpoint:", endpoint);
    console.log("🆔 Project ID:", projectId);
    console.log("🪣 Bucket ID:", bucketId);
    console.log();

    // Test bucket access
    const files = await storage.listFiles(bucketId);
    console.log(`✅ Connection successful!`);
    console.log(`📊 Found ${files.files.length} files in bucket`);

    if (files.files.length > 0) {
      console.log("\n📁 Recent files:");
      files.files.slice(0, 5).forEach((file) => {
        console.log(
          `  - ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
        );
      });
    }

    console.log();

    const titleQuery = [
      Query.equal("title", "Well Logging for Earth Scientists"),
    ];
    const titleDocs = await databases.listDocuments(
      databaseId,
      collectionId,
      titleQuery
    );
    if (titleDocs.documents.length > 0) {
      const fileId = titleDocs.documents[0].fileId;
      const downloadUrl = storage.getFileDownload(bucketId, fileId);
      const response = await fetch(downloadUrl);
      const buffer = await response.arrayBuffer();
      await writeFile(
        join(process.cwd(), "Well Logging for Earth Scientists.pdf"),
        Buffer.from(buffer)
      );
      console.log("File downloaded successfully.");
    } else {
      console.log("No document found with that title.");
    }

    // Test database access
    const area = 2007;
    const col = "year";
    const queries = [Query.equal(col, area)];
    const documents = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );
    console.log(`✅ Database connection successful!`);
    console.log(
      `📊 Found ${documents.documents.length} documents in collection with filter ${area}`
    );

    if (documents.documents.length > 0) {
      console.log("\n📄 First 3 documents:");
      documents.documents.forEach((doc, index) => {
        console.log(`  ${index + 1}. Title: ${doc.title}`);
      });
    }
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your .env file has correct values");
    console.log("2. Verify bucket exists and has read permissions");
    console.log("3. Check your project ID is correct");
    console.log("4. Ensure AppWrite server is running");
  }
}

testConnection();
