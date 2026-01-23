import React from "react";
import {
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
  IconButton,
  Chip,
  TablePagination,
} from "@mui/material";
import { MdEdit, MdDelete, MdBook, MdRefresh } from "react-icons/md";

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
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <Typography
              variant="h5"
              className="font-semibold flex items-center gap-2"
            >
              <MdBook className="text-geo-primary dark:text-geo-darkprimary" />
              Books Collection ({books.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<MdRefresh />}
              onClick={onRefresh}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                ml: 2,
              }}
            >
              Refresh
            </Button>
          </Box>

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
                    Year
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
                      <TableCell>{book.year}</TableCell>
                      <TableCell>
                        <Box className="flex gap-1">
                          <IconButton
                            onClick={() => onEdit(book)}
                            size="small"
                            sx={{
                              color: "#f59e0b",
                              "&:hover": { backgroundColor: "#fef3c7" },
                            }}
                          >
                            <MdEdit />
                          </IconButton>
                          <IconButton
                            onClick={() => onDelete(book)}
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
    </>
  );
};

export default BooksTable;
