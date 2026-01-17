#!/usr/bin/env node

/**
 * Quick test script to verify AppWrite connection
 * Run with: node test_appwrite.js
 */

import { Client, Storage } from "appwrite";

// Load environment variables
const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const bucketId = process.env.VITE_APPWRITE_BUCKET_ID;

async function testConnection() {
  console.log("🧪 Testing AppWrite connection...\n");

  try {
    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    const storage = new Storage(client);

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
