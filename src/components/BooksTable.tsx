import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  TablePagination,
  Avatar,
  Skeleton,
} from "@mui/material";
import { MdEdit, MdDelete, MdBook, MdRefresh } from "react-icons/md";
import { COVER_BUCKET_ID } from "../services/appwrite";

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

function isUrl(str: string) {
  return /^https?:\/\//i.test(str);
}

function getCoverSrc(cover: string | undefined | null) {
  if (!cover) return undefined;
  if (isUrl(cover)) return cover;
  return `${APPWRITE_ENDPOINT}/storage/buckets/${COVER_BUCKET_ID}/files/${cover}/preview?project=${APPWRITE_PROJECT_ID}`;
}

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

interface BooksTableProps {
  books: Book[];
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({
  books,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  const areaColors = {
    default: { bg: "#1077bc", text: "#fff" },
    tech: { bg: "#3b82f6", text: "#fff" },
    science: { bg: "#10b981", text: "#fff" },
    arts: { bg: "#f59e0b", text: "#fff" },
    business: { bg: "#8b5cf6", text: "#fff" },
  };

  const getAreaColor = (area: string) => {
    const key = area.toLowerCase();
    return areaColors[key as keyof typeof areaColors] || areaColors.default;
  };

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto" }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #1077bc 0%, #0d5a8f 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(16, 119, 188, 0.3)",
                }}
              >
                <MdBook style={{ fontSize: 24, color: "#fff" }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  Books Collection
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                  {books.length} {books.length === 1 ? "book" : "books"} in
                  library
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<MdRefresh />}
              onClick={onRefresh}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#1077bc",
                color: "#1077bc",
                "&:hover": {
                  borderColor: "#0d5a8f",
                  backgroundColor: "#f0f9ff",
                },
              }}
            >
              Refresh
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.875rem",
                      py: 2,
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.875rem",
                    }}
                  >
                    Author
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.875rem",
                    }}
                  >
                    Area
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.875rem",
                    }}
                  >
                    Language
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.875rem",
                    }}
                  >
                    Year
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.875rem",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: rowsPerPage || 5 }).map((_, idx) => (
                      <TableRow
                        key={`skeleton-${idx}`}
                        sx={{
                          borderBottom:
                            idx === (rowsPerPage || 5) - 1
                              ? "none"
                              : "1px solid #f1f5f9",
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Skeleton
                              variant="rectangular"
                              width={40}
                              height={56}
                              sx={{ borderRadius: 1 }}
                            />
                            <Box sx={{ width: "60%" }}>
                              <Skeleton width="80%" height={18} />
                              <Skeleton
                                width="40%"
                                height={14}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton width="80%" height={16} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} height={28} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} height={28} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={40} height={16} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Skeleton
                              variant="circular"
                              width={32}
                              height={32}
                            />
                            <Skeleton
                              variant="circular"
                              width={32}
                              height={32}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : books
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((book, idx) => {
                        const areaClr = getAreaColor(book.area);
                        return (
                          <TableRow
                            key={book.$id}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#f8fafc",
                                transition: "all 0.2s ease",
                              },
                              borderBottom:
                                idx ===
                                books.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage,
                                ).length -
                                  1
                                  ? "none"
                                  : "1px solid #f1f5f9",
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  src={getCoverSrc(book.cover)}
                                  variant="rounded"
                                  sx={{
                                    width: 40,
                                    height: 56,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    border: "1px solid #e5e7eb",
                                  }}
                                >
                                  <MdBook />
                                </Avatar>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    fontSize: "0.9375rem",
                                  }}
                                >
                                  {book.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{ color: "#64748b", fontSize: "0.9375rem" }}
                              >
                                {book.author}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={book.area}
                                size="small"
                                sx={{
                                  backgroundColor: areaClr.bg,
                                  color: areaClr.text,
                                  fontWeight: 600,
                                  fontSize: "0.8125rem",
                                  borderRadius: "8px",
                                  height: "28px",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  book.language === "en"
                                    ? "English"
                                    : "Portuguese"
                                }
                                size="small"
                                sx={{
                                  backgroundColor: "#f1f5f9",
                                  color: "#475569",
                                  fontWeight: 500,
                                  fontSize: "0.8125rem",
                                  borderRadius: "8px",
                                  height: "28px",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  color: "#64748b",
                                  fontSize: "0.9375rem",
                                  fontWeight: 500,
                                }}
                              >
                                {book.year}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <IconButton
                                  onClick={() => onEdit(book)}
                                  size="small"
                                  sx={{
                                    color: "#f59e0b",
                                    backgroundColor: "#fef3c7",
                                    borderRadius: "8px",
                                    width: 32,
                                    height: 32,
                                    "&:hover": {
                                      backgroundColor: "#fde68a",
                                      transform: "scale(1.05)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <MdEdit size={16} />
                                </IconButton>
                                <IconButton
                                  onClick={() => onDelete(book)}
                                  size="small"
                                  sx={{
                                    color: "#dc2626",
                                    backgroundColor: "#fecaca",
                                    borderRadius: "8px",
                                    width: 32,
                                    height: 32,
                                    "&:hover": {
                                      backgroundColor: "#fca5a5",
                                      transform: "scale(1.05)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <MdDelete size={16} />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>

          {books.length === 0 && (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <MdBook style={{ fontSize: 40, color: "#94a3b8" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: "#64748b", fontWeight: 600, mb: 1 }}
              >
                No books yet
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Add your first book to get started
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage="Books per page"
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            "& .MuiTablePagination-toolbar": {
              gap: 2,
              px: 2,
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              py: 1.25,
              borderRadius: "8px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default BooksTable;
