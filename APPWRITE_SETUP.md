# AppWrite Integration Setup Guide

This guide will help you migrate from static `books.json` to dynamic AppWrite storage for your PDF books.

## Prerequisites

1. **AppWrite Account**: Sign up at [appwrite.io](https://appwrite.io)
2. **AppWrite Project**: Create a new project
3. **Storage Bucket**: Create a bucket for PDF files
4. **Database** (Optional): Create a database for book metadata

## Step 1: AppWrite Setup

### 1.1 Create Project
1. Go to AppWrite Console
2. Create a new project (e.g., "GeofisicaHub")
3. Note your Project ID

### 1.2 Create Storage Bucket
1. Go to Storage → Create Bucket
2. Name: "geophysics-pdfs" (or your preference)
3. Set permissions to allow public reads
4. Note the Bucket ID

### 1.3 Create Database (Optional but Recommended)
1. Go to Database → Create Database
2. Name: "books-metadata"
3. Create Collection: "books_metadata"
4. Add these attributes:
   - `fileId` (string, required)
   - `title` (string, required)
   - `description` (string, required)
   - `category` (string, required)
   - `cover` (string, optional)

### 1.4 Get API Key
1. Go to API Keys → Create Key
2. Give it storage and database permissions
3. Note the API Key (keep it secret!)

## Step 2: Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your AppWrite details:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_actual_project_id
   VITE_APPWRITE_BUCKET_ID=your_actual_bucket_id
   VITE_APPWRITE_DATABASE_ID=your_actual_database_id
   ```

## Step 3: Migrate Existing PDFs

Run the migration script to upload your existing PDFs:

```bash
# Update the credentials in migrate_to_appwrite.py first
python migrate_to_appwrite.py
```

This will:
- Download PDFs from your Google Drive links
- Upload them to AppWrite storage
- Create metadata documents

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `/hub/geophysics` - books should now load from AppWrite

## Step 5: Upload Additional PDFs

### Via AppWrite Console
1. Go to Storage → Your Bucket
2. Upload PDF files
3. Add metadata via Database if using metadata collection

### Programmatically
Use the upload functions in `src/hooks/useAppWriteBooks.ts`

## File Structure After Migration

```
src/
├── services/
│   └── appwrite.ts          # AppWrite client setup
├── hooks/
│   └── useAppWriteBooks.ts  # React hooks for books
└── pages/hub/
    └── Geophysics.tsx       # Updated to use AppWrite
```

## API Reference

### Storage Functions
- `getAllPDFFiles()` - List all PDFs in bucket
- `getFileDownloadUrl(fileId)` - Get download URL
- `uploadPDFFile(file, title, desc)` - Upload PDF
- `deletePDFFile(fileId)` - Delete PDF

### React Hooks
- `useAppWriteBooks(category?)` - Fetch books by category
- `useBookUpload()` - Upload new books

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**:
   - Check your `.env` configuration
   - Verify bucket permissions allow public reads

2. **Empty book list**:
   - Ensure PDFs are uploaded to the bucket
   - Check if metadata collection has data

3. **CORS errors**:
   - AppWrite should handle CORS automatically
   - Check your project settings

### Debug Mode

Add this to your `.env` for verbose logging:
```env
VITE_DEBUG=true
```

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Set appropriate bucket permissions (public read for PDFs)
- Consider implementing authentication for admin functions

## Next Steps

1. **Add cover images**: Upload book cover images to AppWrite
2. **Implement search**: Add search/filter functionality
3. **Add categories**: Support multiple book categories
4. **User uploads**: Allow users to upload their own PDFs
5. **Caching**: Implement local caching for better performance

## Support

If you encounter issues:
1. Check AppWrite documentation: https://appwrite.io/docs
2. Verify your project settings in AppWrite Console
3. Check browser console for detailed error messages