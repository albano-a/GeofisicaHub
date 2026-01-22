#!/usr/bin/env python3
#// TODO: Actually take a look at this file

"""
Script to upload PDFs from books.json to AppWrite bucket
Run this once to migrate your existing PDFs to AppWrite
"""

import json
import os
import requests
from pathlib import Path

# AppWrite configuration - update these with your values
APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
PROJECT_ID = "your_project_id"
BUCKET_ID = "your_bucket_id"
DATABASE_ID = "your_database_id"
COLLECTION_ID = "books_metadata"

# You'll need to get these from AppWrite console
API_KEY = "your_api_key"  # Server API key with storage and database permissions


def upload_file_to_appwrite(file_path, title, description, category):
    """Upload a file to AppWrite storage"""
    url = f"{APPWRITE_ENDPOINT}/storage/buckets/{BUCKET_ID}/files"

    headers = {
        "X-Appwrite-Project": PROJECT_ID,
        "X-Appwrite-Key": API_KEY,
    }

    with open(file_path, "rb") as file:
        files = {"file": (os.path.basename(file_path), file, "application/pdf")}
        data = {"fileId": "unique()", "permissions": '["read("anyone")"]'}  # Public read access

        response = requests.post(url, headers=headers, files=files, data=data)

        if response.status_code == 201:
            file_data = response.json()
            file_id = file_data["$id"]

            # Create metadata document
            create_metadata(file_id, title, description, category)

            print(f"✅ Uploaded: {title}")
            return file_id
        else:
            print(f"❌ Failed to upload {title}: {response.text}")
            return None


def create_metadata(file_id, title, description, category):
    """Create metadata document in database"""
    url = f"{APPWRITE_ENDPOINT}/databases/{DATABASE_ID}/collections/{COLLECTION_ID}/documents"

    headers = {
        "X-Appwrite-Project": PROJECT_ID,
        "X-Appwrite-Key": API_KEY,
        "Content-Type": "application/json",
    }

    data = {
        "documentId": "unique()",
        "data": {
            "fileId": file_id,
            "title": title,
            "description": description,
            "category": category,
            "cover": "/default-book-cover.jpg",  # You can update this later
        },
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code != 201:
        print(f"⚠️  Failed to create metadata for {title}: {response.text}")


def download_and_upload_from_url(url, title, description, category, output_dir="temp_pdfs"):
    """Download PDF from URL and upload to AppWrite"""
    try:
        # Create temp directory
        Path(output_dir).mkdir(exist_ok=True)

        # Download file
        response = requests.get(url, stream=True)
        response.raise_for_status()

        filename = f"{title.replace(' ', '_').replace('/', '_')}.pdf"
        file_path = Path(output_dir) / filename

        with open(file_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"📥 Downloaded: {title}")

        # Upload to AppWrite
        upload_file_to_appwrite(str(file_path), title, description, category)

        # Clean up
        file_path.unlink(missing_ok=True)

    except Exception as e:
        print(f"❌ Error processing {title}: {e}")


def main():
    # Load books.json
    with open("src/assets/books.json", "r", encoding="utf-8") as f:
        books_data = json.load(f)

    print("🚀 Starting migration from books.json to AppWrite")
    print(f"📊 Found {len(books_data['geophysics'])} geophysics books")

    for book in books_data["geophysics"]:
        download_and_upload_from_url(book["link"], book["title"], book["description"], "geophysics")

    print("🎉 Migration complete!")
    print("\n📝 Next steps:")
    print("1. Update your .env file with actual AppWrite credentials")
    print("2. Test the app - books should now load from AppWrite")
    print("3. Optionally upload cover images and update metadata")


if __name__ == "__main__":
    main()
