import React, { useState, useEffect } from "react";
import {
  tableDB,
  storage,
  BUCKET_ID,
  DATABASE_ID,
  COLLECTION_ID,
} from "../services/appwrite";
import { useAuth } from "../contexts/AuthContext";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Chip,
  FormControl,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdLogout,
  MdBook,
  MdPerson,
  MdLanguage,
  MdCategory,
  MdUpload,
  MdSave,
  MdCancel,
} from "react-icons/md";

interface Book {
  $id: string;
  title: string;
  author: string;
  area: string;
  language: string;
  cover: string;
  fileId: string;
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
  const [form, setForm] = useState({
    title: "",
    author: "",
    area: "",
    language: "en",
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
      const response = await tableDB.listDocuments(DATABASE_ID, COLLECTION_ID);
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
        const coverUpload = await storage.createFile(
          BUCKET_ID,
          "unique()",
          form.coverFile,
        );
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
        setSuccess("Book added successfully!");
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

  const startEdit = (book: Book) => {
    clearMessages();
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      area: book.area,
      language: book.language,
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
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <Box className="flex items-center gap-2 mb-6">
              {editingBook ? (
                <MdEdit className="text-geo-secondary dark:text-geo-darksecondary text-2xl" />
              ) : (
                <MdAdd className="text-geo-primary dark:text-geo-darkprimary text-2xl" />
              )}
              <Typography variant="h5" className="font-semibold">
                {editingBook ? "Edit Book" : "Add New Book"}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                    disabled={submitting}
                    InputProps={{
                      startAdornment: <MdBook className="mr-2 text-gray-400" />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Author"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    required
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <MdPerson className="mr-2 text-gray-400" />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth disabled={submitting}>
                    <Select
                      fullWidth
                      value={form.area}
                      onChange={(e) =>
                        setForm({ ...form, area: e.target.value })
                      }
                      required
                      disabled={submitting}
                      startAdornment={
                        <MdCategory className="mr-2 text-gray-400" />
                      }
                      sx={{
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    >
                      <MenuItem value="Geology">Geology</MenuItem>
                      <MenuItem value="Geophysics">Geophysics</MenuItem>
                      <MenuItem value="Physics">Physics</MenuItem>
                      <MenuItem value="Calculus">Calculus</MenuItem>
                      <MenuItem value="Programming">Programming</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth disabled={submitting}>
                    <Select
                      value={form.language}
                      onChange={(e) =>
                        setForm({ ...form, language: e.target.value })
                      }
                      startAdornment={
                        <MdLanguage className="mr-2 text-gray-400" />
                      }
                      sx={{
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="pt">Portuguese</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<MdUpload />}
                    disabled={submitting}
                    sx={{
                      height: "56px",
                      borderRadius: "12px",
                      borderColor: form.coverFile
                        ? "#1077bc"
                        : "rgba(0, 0, 0, 0.23)",
                      color: form.coverFile ? "#1077bc" : "rgba(0, 0, 0, 0.6)",
                      justifyContent: "flex-start",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#1077bc",
                        backgroundColor: "rgba(16, 119, 188, 0.04)",
                      },
                      ".dark &": {
                        borderColor: form.coverFile
                          ? "#53a6e8"
                          : "rgba(255, 255, 255, 0.23)",
                        color: form.coverFile
                          ? "#53a6e8"
                          : "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  >
                    {form.coverFile
                      ? form.coverFile.name
                      : "Upload Cover Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          coverFile:
                            (e.target as HTMLInputElement).files?.[0] || null,
                        })
                      }
                    />
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<MdUpload />}
                    disabled={submitting}
                    sx={{
                      height: "56px",
                      borderRadius: "12px",
                      borderColor: form.pdfFile
                        ? "#1077bc"
                        : "rgba(0, 0, 0, 0.23)",
                      color: form.pdfFile ? "#1077bc" : "rgba(0, 0, 0, 0.6)",
                      justifyContent: "flex-start",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#1077bc",
                        backgroundColor: "rgba(16, 119, 188, 0.04)",
                      },
                      ".dark &": {
                        borderColor: form.pdfFile
                          ? "#53a6e8"
                          : "rgba(255, 255, 255, 0.23)",
                        color: form.pdfFile
                          ? "#53a6e8"
                          : "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  >
                    {form.pdfFile ? form.pdfFile.name : "Upload PDF File"}
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          pdfFile:
                            (e.target as HTMLInputElement).files?.[0] || null,
                        })
                      }
                    />
                  </Button>
                </Grid>
              </Grid>

              <Box className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={editingBook ? <MdSave /> : <MdAdd />}
                  sx={{
                    backgroundColor: "#1077bc",
                    "&:hover": { backgroundColor: "#53a6e8" },
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                  }}
                >
                  {submitting
                    ? "Saving..."
                    : editingBook
                      ? "Update Book"
                      : "Add Book"}
                </Button>
                {editingBook && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={resetForm}
                    disabled={submitting}
                    startIcon={<MdCancel />}
                    sx={{
                      borderColor: "#6b7280",
                      color: "#6b7280",
                      "&:hover": {
                        borderColor: "#4b5563",
                        backgroundColor: "#f9fafb",
                      },
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Books List */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Typography
              variant="h5"
              className="font-semibold mb-4 flex items-center gap-2"
            >
              <MdBook className="text-geo-primary dark:text-geo-darkprimary" />
              Books Collection ({books.length})
            </Typography>

            <TableContainer component={Paper} className="rounded-lg shadow-sm">
              <Table>
                <TableHead>
                  <TableRow className="bg-geo-primary dark:bg-geo-primary">
                    <TableCell className="font-semibold text-white">
                      Title
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      Author
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      Area
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      Language
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((book) => (
                      <TableRow
                        key={book.$id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className="font-medium">
                          {book.title}
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Chip
                            label={book.area}
                            size="small"
                            sx={{
                              backgroundColor: "#1077bc",
                              color: "white",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              book.language === "en" ? "English" : "Portuguese"
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: "#1077bc",
                              color: "#1077bc",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box className="flex gap-1">
                            <IconButton
                              onClick={() => startEdit(book)}
                              size="small"
                              sx={{
                                color: "#f59e0b",
                                "&:hover": { backgroundColor: "#fef3c7" },
                              }}
                            >
                              <MdEdit />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                setDeleteDialog({ open: true, book })
                              }
                              size="small"
                              sx={{
                                color: "#dc2626",
                                "&:hover": { backgroundColor: "#fecaca" },
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={books.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Table>
            </TableContainer>

            {books.length === 0 && (
              <Box className="text-center py-12">
                <MdBook className="text-6xl text-gray-300 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-500">
                  No books found. Add your first book above.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Books per page"
          sx={{
            borderTop: "1px solid #e0e0e0",
            "& .MuiTablePagination-toolbar": {
              gap: "16px",
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              paddingY: "10px",
            },
          }}
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
    </Box>
  );
}
