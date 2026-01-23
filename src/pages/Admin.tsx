import React, { useState, useEffect } from "react";
import {
  tableDB,
  storage,
  BUCKET_ID,
  COVER_BUCKET_ID,
  DATABASE_ID,
  COLLECTION_ID,
} from "../services/appwrite";
import { Query } from "appwrite";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import { MdDelete, MdLogout, MdBook } from "react-icons/md";
import BookForm from "../components/BookForm";
import BooksTable from "../components/BooksTable";
interface Book {
  $id: string;
  title: string;
  author: string;
  area: string;
  language: string;
  cover: string;
  fileId: string;
  year: number;
}

export default function Admin() {
  const { logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    book: Book | null;
  }>({
    open: false,
    book: null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [form, setForm] = useState({
    title: "",
    author: "",
    area: "Geophysics",
    language: "en",
    year: 2000,
    coverFile: null as File | null,
    pdfFile: null as File | null,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await tableDB.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        queries: [Query.limit(1000)], // Increase limit to fetch all books
      });
      console.log("Fetched books:", response.documents);
      setBooks(response.documents as unknown as Book[]);
    } catch (error: any) {
      console.error("Error fetching books:", error);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      let coverId = editingBook ? editingBook.cover : "";
      let pdfId = editingBook ? editingBook.fileId : "";

      if (form.coverFile) {
        const coverUpload = await storage.createFile({
          bucketId: COVER_BUCKET_ID,
          fileId: "unique()",
          file: form.coverFile,
        });
        coverId = coverUpload.$id;
      }

      if (form.pdfFile) {
        const pdfUpload = await storage.createFile(
          BUCKET_ID,
          "unique()",
          form.pdfFile,
        );
        pdfId = pdfUpload.$id;
      }

      const bookData = {
        title: form.title,
        author: form.author,
        area: form.area,
        language: form.language,
        year: form.year,
        cover: coverId,
        fileId: pdfId,
      };

      if (editingBook) {
        await tableDB.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          editingBook.$id,
          bookData,
        );
        setSuccess("Book updated successfully!");
      } else {
        await tableDB.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          "unique()",
          bookData,
        );
        setSnackbar({
          open: true,
          message: "Book added successfully!",
          severity: "success",
        });
      }

      fetchBooks();
      resetForm();
    } catch (error: any) {
      console.error("Error saving book:", error);
      setError(error.message || "Failed to save book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.book) return;

    try {
      setError("");
      await tableDB.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        deleteDialog.book.$id,
      );
      setSuccess("Book deleted successfully!");
      fetchBooks();
      setDeleteDialog({ open: false, book: null });
    } catch (error: any) {
      console.error("Error deleting book:", error);
      setError(error.message || "Failed to delete book. Please try again.");
      setDeleteDialog({ open: false, book: null });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      area: "",
      language: "en",
      year: 2024,
      coverFile: null,
      pdfFile: null,
    });
    setEditingBook(null);
    setError("");
    setSuccess("");
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const startEdit = (book: Book) => {
    clearMessages();
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      area: book.area,
      language: book.language,
      year: book.year || 2024,
      coverFile: null,
      pdfFile: null,
    });
  };

  if (loading) {
    return (
      <Box className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg p-6 flex items-center justify-center">
        <Typography
          variant="h6"
          className="text-geo-primary dark:text-geo-darkprimary"
        >
          Loading books...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg p-6">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="flex justify-between items-center mb-8">
          <Box className="flex items-center gap-3">
            <MdBook className="text-3xl text-geo-primary dark:text-geo-darkprimary" />
            <Typography
              variant="h4"
              className="font-bold text-[#2e333d] dark:text-white"
            >
              Admin Panel - Manage Books
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<MdLogout />}
            onClick={logout}
            sx={{
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert
            severity="success"
            className="mb-6 rounded-lg"
            onClose={clearMessages}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert
            severity="error"
            className="mb-6 rounded-lg"
            onClose={clearMessages}
          >
            {error}
          </Alert>
        )}

        {/* Add/Edit Form */}
        <BookForm
          form={form}
          submitting={submitting}
          editingBook={!!editingBook}
          onChange={(field, value) =>
            setForm((prev) => ({ ...prev, [field]: value }))
          }
          onFileChange={(field, file) =>
            setForm((prev) => ({ ...prev, [field]: file }))
          }
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {/* Books List */}
        <BooksTable
          books={books}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onRefresh={fetchBooks}
          onEdit={startEdit}
          onDelete={(book) => setDeleteDialog({ open: true, book })}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, book: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="flex items-center gap-2">
            <MdDelete className="text-red-500" />
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{deleteDialog.book?.title}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialog({ open: false, book: null })}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
