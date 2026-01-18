import React, { useState, useEffect, useRef } from "react";
import { Document, Page, Outline, pdfjs } from "react-pdf";
import { useSearchParams } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";
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
  const [outlineOpen, setOutlineOpen] = useState(false);

  const containerWidth = 800;
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
        console.log("Fetching PDF from URL:", viewUrl);

        // Fetch the PDF as a blob
        const response = await fetch(viewUrl, {
          method: "GET",
          mode: "cors",
        });
        console.log("Fetch response:", response);

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

  const scrollToPage = (pageNum: number) => {
    // Ensure target page is mounted before scrolling
    setTimeout(() => {
      const pageElement = pageRefs.current[pageNum - 1];
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
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
          <div className="flex items-center gap-4">
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

            {/* Outline Toggle Button */}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "15px",
                fontFamily: "Poppins",
              }}
              onClick={() => setOutlineOpen(true)}
              className="!border-geo-primary !text-geo-primary hover:!bg-geo-lightbg dark:!border-geo-darkprimary dark:!text-geo-darkprimary dark:hover:!bg-gray-800"
              startIcon={<FormatListBulletedIcon fontSize="small" />}
            >
              Contents
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Display Area */}
      <div
        className="flex-1 overflow-hidden flex flex-col relative"
        ref={pdfContainerRef}
      >
        <div className="w-full h-full flex-1 relative">
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
              className="bg-geo-lightbg dark:bg-geo-darkbg shadow-none p-0 flex flex-col items-stretch w-full h-full"
              style={{ userSelect: "none" }}
            >
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
                options={options}
                className="flex flex-col items-center w-full h-full gap-0"
              >
                {/* Outline Sidebar (Custom Drawer) */}
                <div
                  className={`fixed inset-y-0 left-0 z-[100] w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    outlineOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                      <Typography
                        variant="h6"
                        className="text-gray-800 dark:text-gray-200 font-poppins"
                      >
                        Table of Contents
                      </Typography>
                      <IconButton
                        onClick={() => setOutlineOpen(false)}
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-pdf-outline">
                      <Outline
                        onItemClick={({ pageNumber }) => {
                          scrollToPage(pageNumber);
                          if (window.innerWidth < 768) {
                            setOutlineOpen(false);
                          }
                        }}
                        className="custom-pdf-outline"
                      />
                    </div>
                  </div>
                </div>

                {/* Overlay for mobile */}
                {outlineOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-[90]"
                    onClick={() => setOutlineOpen(false)}
                  />
                )}

                {/* Pages Section */}
                <div
                  className="flex-1 w-full bg-gray-100 dark:bg-gray-800 p-8 h-full overflow-y-auto"
                  ref={containerRef}
                >
                  <div className="flex flex-col items-center gap-8 max-w-full">
                    {numPages &&
                      Array.from({ length: numPages }, (_, index) => (
                        <div
                          key={`page_${index + 1}`}
                          data-page-index={index}
                          ref={(el) => {
                            pageRefs.current[index] = el;
                          }}
                          className="relative shadow-xl transition-shadow hover:shadow-2xl"
                        >
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10 font-medium tracking-wide">
                            Page {index + 1}
                          </div>
                          <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={Math.min(containerWidth, maxWidth)}
                            renderTextLayer={false}
                            renderAnnotationLayer={true}
                          />
                        </div>
                      ))}
                  </div>
                </div>
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
