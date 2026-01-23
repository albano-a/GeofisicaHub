import React from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  MdAdd,
  MdEdit,
  MdBook,
  MdPerson,
  MdLanguage,
  MdCategory,
  MdSave,
  MdCancel,
  MdImage,
  MdPictureAsPdf,
} from "react-icons/md";

interface BookFormProps {
  form: {
    title: string;
    author: string;
    area: string;
    language: string;
    year: number;
    coverFile: File | null;
    pdfFile: File | null;
  };
  submitting: boolean;
  editingBook: boolean;
  onChange: (field: string, value: any) => void;
  onFileChange: (field: string, file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  form,
  submitting,
  editingBook,
  onChange,
  onFileChange,
  onSubmit,
  onCancel,
}) => {
  return (
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
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={(e) => onChange("title", e.target.value)}
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
                onChange={(e) => onChange("author", e.target.value)}
                required
                disabled={submitting}
                InputProps={{
                  startAdornment: <MdPerson className="mr-2 text-gray-400" />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={form.year}
                onChange={(e) => {
                  const val = Math.max(
                    1800,
                    Math.min(2100, Number(e.target.value)),
                  );
                  onChange("year", val);
                }}
                required
                disabled={submitting}
                inputProps={{ min: 1800, max: 2100 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth disabled={submitting}>
                <Select
                  fullWidth
                  value={form.area}
                  onChange={(e) => onChange("area", e.target.value)}
                  required
                  startAdornment={<MdCategory className="mr-2 text-gray-400" />}
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
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth disabled={submitting}>
                <Select
                  value={form.language}
                  onChange={(e) => onChange("language", e.target.value)}
                  startAdornment={<MdLanguage className="mr-2 text-gray-400" />}
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
            <Grid size={{ xs: 12 }}>
              <Box
                component="label"
                sx={{
                  border: "2px dashed",
                  borderColor: form.coverFile ? "#1077bc" : "#e0e0e0",
                  borderRadius: "16px",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: submitting ? "default" : "pointer",
                  bgcolor: form.coverFile
                    ? "rgba(16, 119, 188, 0.04)"
                    : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#1077bc",
                    bgcolor: "rgba(16, 119, 188, 0.08)",
                  },
                  ".dark &": {
                    borderColor: form.coverFile ? "#53a6e8" : "#4b5563",
                    "&:hover": {
                      borderColor: "#53a6e8",
                    },
                  },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    onFileChange(
                      "coverFile",
                      (e.target as HTMLInputElement).files?.[0] || null,
                    )
                  }
                />
                <Box className="bg-blue-50 dark:bg-gray-800 p-4 rounded-full mb-3">
                  <MdImage
                    className={`text-4xl ${form.coverFile ? "text-[#1077bc] dark:text-[#53a6e8]" : "text-gray-400"}`}
                  />
                </Box>
                <Typography
                  variant="h6"
                  className="font-semibold mb-1"
                  color={form.coverFile ? "primary" : "textPrimary"}
                >
                  {form.coverFile ? form.coverFile.name : "Upload Cover Image"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {form.coverFile
                    ? "Click to replace"
                    : "Click to upload or drag and drop"}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className="mt-1"
                >
                  SVG, PNG, JPG or GIF (max. 5MB)
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box
                component="label"
                sx={{
                  border: "2px dashed",
                  borderColor: form.pdfFile ? "#1077bc" : "#e0e0e0",
                  borderRadius: "16px",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: submitting ? "default" : "pointer",
                  bgcolor: form.pdfFile
                    ? "rgba(16, 119, 188, 0.04)"
                    : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#1077bc",
                    bgcolor: "rgba(16, 119, 188, 0.08)",
                  },
                  ".dark &": {
                    borderColor: form.pdfFile ? "#53a6e8" : "#4b5563",
                    "&:hover": {
                      borderColor: "#53a6e8",
                    },
                  },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) =>
                    onFileChange(
                      "pdfFile",
                      (e.target as HTMLInputElement).files?.[0] || null,
                    )
                  }
                />
                <Box className="bg-red-50 dark:bg-gray-800 p-4 rounded-full mb-3">
                  <MdPictureAsPdf
                    className={`text-4xl ${form.pdfFile ? "text-[#1077bc] dark:text-[#53a6e8]" : "text-gray-400"}`}
                  />
                </Box>
                <Typography
                  variant="h6"
                  className="font-semibold mb-1"
                  color={form.pdfFile ? "primary" : "textPrimary"}
                >
                  {form.pdfFile ? form.pdfFile.name : "Upload PDF File"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {form.pdfFile
                    ? "Click to replace"
                    : "Click to upload or drag and drop"}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className="mt-1"
                >
                  PDF files only (max. 500MB)
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={<MdSave />}
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
                onClick={onCancel}
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
  );
};

export default BookForm;
