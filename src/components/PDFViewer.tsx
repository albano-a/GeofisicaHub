import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSearchParams } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import HomeIcon from "@mui/icons-material/Home";

// Set up PDF.js worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PDFViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("fileId");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pageInput, setPageInput] = useState("");
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [maxPagesToShow, setMaxPagesToShow] = useState(10);
  const [pendingScrollPage, setPendingScrollPage] = useState<number | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Handle pending scroll after loading more pages
  useEffect(() => {
    if (pendingScrollPage && pendingScrollPage <= maxPagesToShow) {
      const pageElement = pageRefs.current[pendingScrollPage - 1];
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
        setPendingScrollPage(null);
      }
    }
  }, [maxPagesToShow, pendingScrollPage]);

  // Jump to specific page
  const goToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (pageNum >= 1 && pageNum <= (numPages || 1)) {
      if (pageNum > maxPagesToShow) {
        setMaxPagesToShow(pageNum);
        setPendingScrollPage(pageNum);
      } else {
        const pageElement = pageRefs.current[pageNum - 1];
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
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
  }

  function onDocumentLoadError(err: Error) {
    setError("Failed to render PDF. The file may be corrupted.");
    setLoading(false);
    console.error("PDF render error:", err);
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

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

          {/* Page Count & Jump to Page */}
          {numPages && (
            <form onSubmit={goToPage} className="flex items-center gap-2">
              <span className="text-geo-primary dark:text-geo-darkprimary font-medium">
                {numPages} pages
              </span>
              <span className="text-gray-400">|</span>
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder="Go to..."
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-geo-primary"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "15px",
                  fontFamily: "Poppins",
                }}
                className="!bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
                size="small"
              >
                Go
              </Button>
            </form>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              variant="contained"
              sx={{
                borderRadius: "15px",
                fontFamily: "Poppins",
              }}
              className="!bg-gray-200 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 disabled:!opacity-50 disabled:!cursor-not-allowed hover:!bg-gray-300 dark:hover:!bg-gray-600"
              size="small"
            >
              <ZoomOutIcon fontSize="small" />
            </Button>
            <span className="text-geo-primary dark:text-geo-darkprimary font-medium min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              onClick={zoomIn}
              disabled={scale >= 2.5}
              variant="contained"
              sx={{
                borderRadius: "15px",
                fontFamily: "Poppins",
              }}
              className="!bg-gray-200 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 disabled:!opacity-50 disabled:!cursor-not-allowed hover:!bg-gray-300 dark:hover:!bg-gray-600"
              size="small"
            >
              <ZoomInIcon fontSize="small" />
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 overflow-auto p-4">
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
                className="flex flex-col items-center gap-6"
              >
                {numPages &&
                  Array.from(
                    { length: Math.min(numPages, maxPagesToShow) },
                    (_, index) => (
                      <div
                        key={`page_${index + 1}`}
                        ref={(el) => {
                          pageRefs.current[index] = el;
                        }}
                        className="relative"
                      >
                        <div className="absolute -top-2 left-2 bg-geo-primary text-white text-xs px-2 py-0.5 rounded-full z-10">
                          {index + 1}
                        </div>
                        <Page
                          pageNumber={index + 1}
                          width={containerWidth * scale}
                          renderTextLayer={false}
                          renderAnnotationLayer={true}
                          className="shadow-lg"
                        />
                      </div>
                    )
                  )}
              </Document>
              {numPages && maxPagesToShow < numPages && (
                <div className="mt-6">
                  <Button
                    onClick={() =>
                      setMaxPagesToShow((prev) =>
                        Math.min(prev + 10, numPages!)
                      )
                    }
                    variant="contained"
                    sx={{
                      borderRadius: "15px",
                      fontFamily: "Poppins",
                    }}
                    className="!bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
                  >
                    Load More Pages
                  </Button>
                </div>
              )}
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
