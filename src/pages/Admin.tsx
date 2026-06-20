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
import { useAuth } from "../hooks/useAuth";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MdAdd, MdDelete, MdLogout, MdBook } from "react-icons/md";
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

interface BookFormState {
  title: string;
  author: string;
  area: string;
  language: string;
  year: number;
  coverFile: File | null;
  pdfFile: File | null;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const COVER_MAX_BYTES = 5 * 1024 * 1024;
const PDF_MAX_BYTES = 500 * 1024 * 1024;

const initialForm: BookFormState = {
  title: "",
  author: "",
  area: "Geophysics",
  language: "en",
  year: new Date().getFullYear(),
  coverFile: null,
  pdfFile: null,
};

const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
};

const validateFile = (
  field: "coverFile" | "pdfFile",
  file: File | null,
): string | null => {
  if (!file) return null;

  if (field === "coverFile") {
    if (!file.type.startsWith("image/")) {
      return "Cover must be an image file.";
    }
    if (file.size > COVER_MAX_BYTES) {
      return `Cover must be ${formatFileSize(COVER_MAX_BYTES)} or smaller.`;
    }
  }

  if (field === "pdfFile") {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return "Book file must be a PDF.";
    }
    if (file.size > PDF_MAX_BYTES) {
      return `PDF must be ${formatFileSize(PDF_MAX_BYTES)} or smaller.`;
    }
  }

  return null;
};

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
  const [form, setForm] = useState<BookFormState>(initialForm);

  const [formOpen, setFormOpen] = useState(false);

  // Keep hooks in the same order across renders
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

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
    } catch (error: unknown) {
      console.error("Error fetching books:", error);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedFormChanges = () => {
    if (form.coverFile || form.pdfFile) return true;

    if (editingBook) {
      return (
        form.title !== editingBook.title ||
        form.author !== editingBook.author ||
        form.area !== editingBook.area ||
        form.language !== editingBook.language ||
        form.year !== editingBook.year
      );
    }

    return (
      form.title !== initialForm.title ||
      form.author !== initialForm.author ||
      form.area !== initialForm.area ||
      form.language !== initialForm.language ||
      form.year !== initialForm.year
    );
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.author.trim()) return "Author is required.";
    if (!form.area) return "Area is required.";
    if (!form.language) return "Language is required.";
    if (form.year < 1800 || form.year > 2100) {
      return "Year must be between 1800 and 2100.";
    }
    if (!editingBook && !form.pdfFile) {
      return "PDF file is required when adding a new book.";
    }

    return (
      validateFile("coverFile", form.coverFile) ||
      validateFile("pdfFile", form.pdfFile)
    );
  };

  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return false;
    }

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

      await fetchBooks();
      resetForm();
      setFormOpen(false);
      return true;
    } catch (error: unknown) {
      console.error("Error saving book:", error);
      setError(getErrorMessage(error, "Failed to save book. Please try again."));
      return false;
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
      await fetchBooks();
      setDeleteDialog({ open: false, book: null });
    } catch (error: unknown) {
      console.error("Error deleting book:", error);
      setError(
        getErrorMessage(error, "Failed to delete book. Please try again."),
      );
      setDeleteDialog({ open: false, book: null });
    }
  };

  const resetForm = () => {
    setForm(initialForm);
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

  const handleFormCancel = () => {
    if (hasUnsavedFormChanges()) {
      const shouldDiscard = window.confirm(
        "Discard unsaved changes to this book?",
      );
      if (!shouldDiscard) return;
    }
    resetForm();
    setFormOpen(false);
  };

  const handleDialogClose = () => {
    if (submitting) return;
    handleFormCancel();
  };

  const handleFileChange = (field: "coverFile" | "pdfFile", file: File | null) => {
    const validationError = validateFile(field, file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setForm((prev) => ({ ...prev, [field]: file }));
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
    setFormOpen(true);
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

          <Box className="flex items-center gap-3">
            <Button
              variant="outlined"
              startIcon={<MdAdd />}
              onClick={() => {
                clearMessages();
                resetForm();
                setFormOpen(true);
              }}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                mr: 1,
              }}
            >
              Add Book
            </Button>
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

        {/* Add/Edit Form (now in dialog) */}
        <Dialog
          open={formOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
          fullScreen={fullScreenDialog}
        >
          <DialogTitle>{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
          <DialogContent>
            {submitting && (
              <Alert severity="info" className="mb-4 rounded-lg">
                Saving book and uploading files. Keep this tab open until it
                finishes.
              </Alert>
            )}
            <BookForm
              form={form}
              submitting={submitting}
              editingBook={!!editingBook}
              onChange={(field, value) =>
                setForm((prev) => ({ ...prev, [field]: value }))
              }
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Books List */}
        <BooksTable
          books={books}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
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
