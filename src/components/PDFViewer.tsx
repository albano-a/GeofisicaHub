import React, { useState, useEffect, useRef } from "react";
import { Document, Page, Outline, pdfjs } from "react-pdf";
import { useSearchParams } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Options for PDF.js to support non-latin characters, JPEG 2000, and standard fonts
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  wasmUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/wasm/`,
};

const PDFViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("fileId");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  const maxWidth = 1200; // Maximum width for PDF pages

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Fetch PDF as blob to bypass CORS
  useEffect(() => {
    const fetchPdf = async () => {
      if (!fileId) return;

      try {
        setLoading(true);
        setError(null);

        // Get the view URL from AppWrite
        const viewUrl = storage.getFileView({
          bucketId: BUCKET_ID,
          fileId: fileId,
        });

        // Fetch the PDF as a blob
        const response = await fetch(viewUrl, {
          method: "GET",
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        setPdfBlob(blob);
      } catch (err: any) {
        console.error("PDF fetch error:", err);
        setError("Failed to load PDF. Please check permissions.");
        setLoading(false);
      }
    };

    fetchPdf();
  }, [fileId]);

  // Measure container width for responsive PDF sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 32; // Subtract padding
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!numPages) return;
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => {
          const next = prev - 1;
          scrollToPage(next);
          return next;
        });
      } else if (e.key === "ArrowRight" && currentPage < numPages) {
        setCurrentPage((prev) => {
          const next = prev + 1;
          scrollToPage(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages]); // Ensure dependencies are stable

  const scrollToPage = (pageNum: number) => {
    // Ensure target page is mounted before scrolling
    setTimeout(() => {
      const pageElement = pageRefs.current[pageNum - 1];
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  // Jump to specific page
  const goToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (pageNum >= 1 && pageNum <= (numPages || 1)) {
      setCurrentPage(pageNum);
      scrollToPage(pageNum);
    }
    setPageInput("");
  };

  if (!fileId) {
    return (
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Invalid Request
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No file ID provided.
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="contained"
            sx={{
              borderRadius: "15px",
              fontFamily: "Poppins",
            }}
            className="!bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
            startIcon={<HomeIcon fontSize="small" />}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    // Ensure first page(s) are visible/mounted immediately
  }

  function onDocumentLoadError(err: Error) {
    setError("Failed to render PDF. The file may be corrupted.");
    setLoading(false);
    console.error("PDF render error:", err);
  }

  return (
    <div
      className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg flex flex-col"
      onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-geo-lightbg dark:bg-geo-darkbg shadow-md p-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Back Button */}
          <Button
            variant="contained"
            sx={{
              borderRadius: "15px",
              fontFamily: "Poppins",
            }}
            onClick={() => window.history.back()}
            className="!bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
            startIcon={<HomeIcon fontSize="small" />}
          >
            Back
          </Button>
        </div>
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 overflow-auto p-4" ref={pdfContainerRef}>
        <div className="max-w-full mx-auto" ref={containerRef}>
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <LoadingSpinner />
              <span className="mt-4 text-geo-primary dark:text-geo-darkprimary">
                Loading PDF...
              </span>
            </div>
          )}

          {error && (
            <div className="text-center py-24 bg-geo-lightbg dark:bg-geo-darkbg rounded-xl shadow-lg p-8">
              <p className="text-red-600 dark:text-red-400 text-lg mb-4">
                {error}
              </p>
              <p className="text-geo-primary dark:text-geo-darkprimary text-sm mb-6">
                Ensure the bucket has read permissions set to "Any" in AppWrite.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="contained"
                sx={{
                  borderRadius: "15px",
                  fontFamily: "Poppins",
                }}
                className="!bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
              >
                Try Again
              </Button>
            </div>
          )}

          {!error && pdfBlob && (
            <div
              className="bg-geo-lightbg dark:bg-geo-darkbg rounded-xl shadow-lg p-4 flex flex-col items-center gap-6 select-none"
              style={{ userSelect: "none" }}
            >
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
                options={options}
                className="flex flex-col items-center gap-6"
              >
                {numPages &&
                  Array.from({ length: numPages }, (_, index) => (
                    <div
                      key={`page_${index + 1}`}
                      data-page-index={index}
                      ref={(el) => {
                        pageRefs.current[index] = el;
                      }}
                      className="relative w-full"
                    >
                      <div className="absolute -top-2 left-2 bg-geo-primary text-white text-xs px-2 py-0.5 rounded-full z-10">
                        {index + 1}
                      </div>
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={Math.min(containerWidth, maxWidth)}
                        renderTextLayer={false}
                        renderAnnotationLayer={true}
                        className="shadow-lg"
                      />
                    </div>
                  ))}
                <Outline
                  onItemClick={({ pageNumber }) => {
                    setCurrentPage(pageNumber);
                    scrollToPage(pageNumber);
                  }}
                  className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-96 overflow-auto"
                />
              </Document>
            </div>
          )}
        </div>
      </div>

      {/* Watermark / Branding */}
      <div className="fixed bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm pointer-events-none">
        GeofisicaHub Reader
      </div>
    </div>
  );
};

export default PDFViewer;
