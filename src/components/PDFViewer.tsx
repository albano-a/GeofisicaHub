import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiZoomIn, FiZoomOut, FiRotateCcw } from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";
import PDFPage from "./PDFPage";

import "pdfjs-dist/web/pdf_viewer.css";

import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";

const pdfLib: any =
  typeof (window as any).pdfjsLib !== "undefined"
    ? (window as any).pdfjsLib
    : pdfjsLib;
const pdfViewerLib: any =
  typeof (window as any).pdfjsViewer !== "undefined"
    ? (window as any).pdfjsViewer
    : (pdfjsViewer as any);

// Set up PDF.js worker (use CDN worker path if available)
try {
  const workerPath =
    typeof pdfLib?.version === "string"
      ? `//unpkg.com/pdfjs-dist@${pdfLib.version}/build/pdf.worker.min.mjs`
      : `//unpkg.com/pdfjs-dist/build/pdf.worker.min.mjs`;
  if (pdfLib && pdfLib.GlobalWorkerOptions) {
    pdfLib.GlobalWorkerOptions.workerSrc = workerPath;
  }
} catch (e) {
  // ignore
}

const ZOOM_LEVELS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
  2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0,
];
const INIT_SCALE = 0.5;

const PDFViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("fileId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pdfDocument, setPdfDocument] = useState<any | null>(null);
  const [numPages, setNumPages] = useState<number>(0); // Number of pages
  const [outline, setOutline] = useState<any[]>([]);

  const [outlineOpen, setOutlineOpen] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1"); // For controlled input, but it needs to be connected to numPages and currentPage

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendZoomRef = useRef<number | null>(null);
  const eventBusRef = useRef<any>(new pdfViewerLib.EventBus());
  const linkServiceRef = useRef<any>(
    new pdfViewerLib.PDFLinkService({ eventBus: eventBusRef.current }),
  );

  // Measure available width for PDF pages
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Fetch and Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      if (!fileId) return;

      try {
        setLoading(true);
        setError(null);

        // 1. Get View URL
        const viewUrl = storage.getFileView({
          bucketId: BUCKET_ID,
          fileId: fileId,
        });
        console.log("Fetching PDF from URL:", viewUrl);

        // 2. Fetch as blob (for Auth/CORS handling as per previous code)
        const response = await fetch(viewUrl, {
          method: "GET",
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // 3. Load Document with PDF.js
        const loadingTask = pdfLib.getDocument(url);
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
        console.log(`[DEBUG] PDF loaded with ${pdf.numPages} pages.`);

        // Wire link service to the loaded document so annotations/internal links work
        try {
          if (
            linkServiceRef.current &&
            typeof linkServiceRef.current.setDocument === "function"
          ) {
            linkServiceRef.current.setDocument(pdf);
          }
        } catch (e) {
          // ignore if linking fails
        }

        // 4. Get Outline
        const outlineData = await pdf.getOutline();
        setOutline(outlineData || []);

        setLoading(false);
      } catch (err: any) {
        console.error("PDF load error:", err);
        setError("Failed to load PDF. Please check permissions.");
        setLoading(false);
      }
    };

    loadPdf();
  }, [fileId]);

  useEffect(() => {
    const maintainPosition = () => {
      const pageEl = document.getElementById(`pdf-page-${currentPage}`);
      if (pageEl) {
        pageEl.scrollIntoView({ block: "start" });
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(maintainPosition);
    });
  }, [scale]); // Intentionally omitting currentPage to avoid snapping during scroll

  const handleZoom = (type: "in" | "out" | "reset") => {
    setScale((prev) => {
      if (type === "reset") return INIT_SCALE;
      if (type === "in")
        return ZOOM_LEVELS.find((z) => z > prev + 0.001) || prev;
      return [...ZOOM_LEVELS].reverse().find((z) => z < prev - 0.001) || prev;
    });
  };

  const handlePageChange = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    console.log(`[DEBUG] Current input page: ${inputPage}, parsed: ${page}`);
    if (page >= 1 && page <= numPages) {
      const el = document.getElementById(`pdf-page-${page}`);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        setCurrentPage(page);
      }
    } else {
      setInputPage(currentPage.toString());
    }
    inputRef.current?.blur();
  };

  const handlePageVisible = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (document.activeElement?.id !== "page-input") {
      setInputPage(pageNumber.toString());
    }
  };

  // Helper to render outline recursively
  const renderOutlineItems = (items: any[]) => {
    return (
      <ul className="pl-4 custom-pdf-outline">
        {items.map((item, idx) => (
          <li key={idx} className="mb-1">
            <button
              onClick={async () => {
                if (pdfDocument && item.dest) {
                  try {
                    let dest = item.dest;
                    if (typeof dest === "string") {
                      dest = await pdfDocument.getDestination(dest);
                    }
                    if (Array.isArray(dest)) {
                      const ref = dest[0];
                      const pageIndex = await pdfDocument.getPageIndex(ref);

                      // Scroll to element
                      const el = document.getElementById(
                        `pdf-page-${pageIndex + 1}`,
                      );
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }
                  } catch (e) {
                    console.error("Navigation error:", e);
                  }
                }
                setOutlineOpen(false);
              }}
              className="text-left text-sm text-gray-700 dark:text-gray-300 hover:text-geo-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 w-full block truncate transition-colors"
            >
              {item.title}
            </button>
            {item.items &&
              item.items.length > 0 &&
              renderOutlineItems(item.items)}
          </li>
        ))}
      </ul>
    );
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
            onClick={() => <Link to="/hub" />}
            variant="contained"
            sx={{
              borderRadius: "15px",
              fontFamily: "Poppins",
            }}
            className="!bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
            startIcon={<IoMdArrowRoundBack size={18} />}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg flex flex-col"
      onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-geo-lightbg dark:bg-geo-darkbg shadow-md p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4 z-10">
            {/* Back Button */}
            <Button
              variant="text"
              sx={{
                borderRadius: "25px",
                fontFamily: "Poppins",
              }}
              onClick={() => <Link to="/hub" />}
              className=" dark:!text-geo-lightbg"
            >
              <IoMdArrowRoundBack size={24} />
            </Button>

            {/* Outline Toggle Button */}
            <Button
              variant="text"
              sx={{
                borderRadius: "25px",
                fontFamily: "Poppins",
              }}
              onClick={() => setOutlineOpen(true)}
              className=" !text-geo-primary  dark:!border-geo-darkprimary dark:!text-geo-darkprimary"
            >
              <FormatListBulletedIcon fontSize="small" />
            </Button>
          </div>

          {/* Page Navigation - ABSOLUTE CENTER */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            {numPages > 0 && (
              <form
                onSubmit={handlePageChange}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm"
              >
                <input
                  ref={inputRef}
                  id="page-input"
                  type="text"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  onBlur={() => setInputPage(currentPage.toString())}
                  className="w-10 text-center bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 p-0"
                />
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  / {numPages}
                </span>
              </form>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 border border-gray-300 dark:border-gray-700 shadow-sm z-10">
            <IconButton
              onClick={() => handleZoom("out")}
              disabled={scale <= ZOOM_LEVELS[0]}
              size="small"
              title="Zoom Out"
            >
              <FiZoomOut className="text-gray-700 dark:text-gray-200" />
            </IconButton>
            <span className="min-w-[3.5rem] text-center text-sm font-medium text-gray-700 dark:text-gray-200 select-none">
              {Math.round(scale * 100)}%
            </span>
            <IconButton
              onClick={() => handleZoom("in")}
              disabled={scale >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
              size="small"
              title="Zoom In"
            >
              <FiZoomIn className="text-gray-700 dark:text-gray-200" />
            </IconButton>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <IconButton
              onClick={() => handleZoom("reset")}
              size="small"
              title="Reset Zoom"
            >
              <FiRotateCcw
                className="text-gray-700 dark:text-gray-200"
                size={16}
              />
            </IconButton>
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

          {!error && !loading && pdfDocument && (
            <div className="bg-geo-lightbg dark:bg-geo-darkbg shadow-none p-0 flex flex-col items-stretch w-full h-full">
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
                    {outline.length > 0 ? (
                      renderOutlineItems(outline)
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No table of contents available.
                      </p>
                    )}
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
                className="flex-1 w-full bg-gray-100 dark:bg-gray-800 p-8 h-full overflow-auto"
                ref={containerRef}
              >
                <div className="flex flex-col items-center gap-0 max-w-full mx-auto">
                  {Array.from({ length: numPages }, (_, index) => (
                    <PDFPage
                      key={index + 1}
                      pageNumber={index + 1}
                      pdf={pdfDocument}
                      scale={scale}
                      containerWidth={containerWidth}
                      onVisible={handlePageVisible}
                      eventBus={eventBusRef.current}
                      linkService={linkServiceRef.current}
                    />
                  ))}
                </div>
              </div>
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
