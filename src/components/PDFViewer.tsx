import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useSearchParams } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";
import { FiZoomIn, FiZoomOut, FiRotateCcw } from "react-icons/fi";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Upper bound so extremely wide screens do not stretch the PDF excessively
const maxWidth = 1400;

// Zoom levels: 50-120% in 10% steps, then 150-500% in 50% steps
const ZOOM_LEVELS = [
  0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5,
  5.0,
];

interface PDFPageProps {
  pageNumber: number;
  pdf: pdfjsLib.PDFDocumentProxy;
  scale: number;
  containerWidth: number;
}

const PDFPage: React.FC<PDFPageProps> = ({
  pageNumber,
  pdf,
  scale,
  containerWidth,
}) => {
  const [viewport, setViewport] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const renderTaskRef = useRef<any>(null);
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(1.414); // Default A4ish

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "200% 0px", // Pre-render when 2 screens away
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Render Page
  useEffect(() => {
    // 1. If not visible or no PDF, cleanup and return
    if (!isVisible || !pdf) {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      // Clear canvas to free memory
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );
        }
      }
      return;
    }

    let active = true;

    const render = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (!active) return;

        // Determine viewport
        const unscaledViewport = page.getViewport({ scale: 1 });
        setPageAspectRatio(unscaledViewport.height / unscaledViewport.width);

        // Calculate fit scale
        const targetWidth = containerWidth
          ? Math.min(containerWidth, maxWidth)
          : maxWidth;

        const fitScale = targetWidth / unscaledViewport.width;
        const totalScale = fitScale * scale;

        const newViewport = page.getViewport({ scale: totalScale });
        setViewport(newViewport);

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          if (context) {
            // Handle HiDPI
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = newViewport.width * pixelRatio;
            canvas.height = newViewport.height * pixelRatio;
            canvas.style.width = `${newViewport.width}px`;
            canvas.style.height = `${newViewport.height}px`;

            context.scale(pixelRatio, pixelRatio);

            // Cancel any previous render task
            if (renderTaskRef.current) {
              try {
                renderTaskRef.current.cancel();
              } catch (e) {
                // Ignore cancel errors
              }
            }

            const renderContext = {
              canvasContext: context,
              viewport: newViewport,
              canvas: canvas,
            };

            renderTaskRef.current = page.render(renderContext);

            await renderTaskRef.current.promise;
          }
        }
      } catch (e: any) {
        if (e.name !== "RenderingCancelledException") {
          console.error(`Error rendering page ${pageNumber}:`, e);
        }
      }
    };

    render();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [isVisible, pdf, pageNumber, scale, containerWidth]);

  // Dimensions for placeholder
  const widthPx = containerWidth
    ? Math.min(containerWidth, maxWidth) * scale
    : maxWidth * scale;
  const heightPx = widthPx * pageAspectRatio;

  return (
    <div
      ref={containerRef}
      id={`pdf-page-${pageNumber}`}
      className="relative shadow-xl transition-shadow hover:shadow-2xl bg-white dark:bg-gray-800 mx-auto"
      style={{
        width: viewport ? viewport.width : widthPx,
        height: viewport ? viewport.height : heightPx,
        marginBottom: "2rem",
      }}
    >
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10 font-medium tracking-wide pointer-events-none">
        Page {pageNumber}
      </div>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

const PDFViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("fileId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [outline, setOutline] = useState<any[]>([]);

  const [outlineOpen, setOutlineOpen] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

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
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);

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

  const handleZoomIn = () => {
    setScale((prev) => {
      const next = ZOOM_LEVELS.find((z) => z > prev + 0.001);
      return next ?? prev;
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      // Find the largest level strictly less than current scale
      for (let i = ZOOM_LEVELS.length - 1; i >= 0; i--) {
        if (ZOOM_LEVELS[i] < prev - 0.001) {
          return ZOOM_LEVELS[i];
        }
      }
      return prev;
    });
  };

  const handleResetZoom = () => setScale(1.0);

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

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 border border-gray-300 dark:border-gray-700 shadow-sm">
            <IconButton
              onClick={handleZoomOut}
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
              onClick={handleZoomIn}
              disabled={scale >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
              size="small"
              title="Zoom In"
            >
              <FiZoomIn className="text-gray-700 dark:text-gray-200" />
            </IconButton>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <IconButton
              onClick={handleResetZoom}
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
