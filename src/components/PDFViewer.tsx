import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import { Link, useSearchParams } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoMdArrowRoundBack } from "react-icons/io";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";
import { FiZoomIn, FiZoomOut, FiRotateCcw } from "react-icons/fi";
// Import annotation layer CSS
import "pdfjs-dist/web/pdf_viewer.css";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Upper bound so extremely wide screens do not stretch the PDF excessively
const maxWidth = 1400;

// Zoom levels: 50-150% in 10% steps, then 150-500% in 50% steps
const ZOOM_LEVELS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
  2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0,
];

interface PDFPageProps {
  pageNumber: number;
  pdf: pdfjsLib.PDFDocumentProxy;
  scale: number;
  containerWidth: number;
  onVisible: (pageNumber: number) => void;
  eventBus: any;
  linkService: any;
}

const PDFPage: React.FC<PDFPageProps> = ({
  pageNumber,
  pdf,
  scale,
  containerWidth,
  onVisible,
  eventBus,
  linkService,
}) => {
  const [viewport, setViewport] = useState<any>(null);
  const pageHostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pageViewRef = useRef<any>(null);
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(1.414); // Default A4ish

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        // Only update page number if it's > 50% visible to reduce jitter
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          onVisible(pageNumber);
        }
      },
      {
        rootMargin: "200% 0px", // Keep pre-rendering margin
        threshold: [0, 0.5], // Trigger at 0 (for render) and 0.5 (for page count)
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onVisible, pageNumber]);

  // Render Page
  useEffect(() => {
    // 1. If not visible or no PDF, cleanup and return
    if (!isVisible || !pdf) {
      // Destroy any existing PDFPageView
      try {
        if (
          pageViewRef.current &&
          typeof pageViewRef.current.destroy === "function"
        ) {
          pageViewRef.current.destroy();
        }
      } catch (err) {
        console.error("Error destroying page view:", err);
      }
      if (pageHostRef.current) {
        pageHostRef.current.innerHTML = "";
      }
      return;
    }

    let active = true;

    const render = async () => {
      try {
        console.log(`Rendering page ${pageNumber}`);
        const page = await pdf.getPage(pageNumber);
        console.log(`Page ${pageNumber} fetched:`, page);

        if (!active) return;

        // Determine viewport
        const unscaledViewport = page.getViewport({ scale: 1 });
        console.log(
          `Unscaled viewport for page ${pageNumber}:`,
          unscaledViewport,
        );
        setPageAspectRatio(unscaledViewport.height / unscaledViewport.width);

        // Calculate fit scale
        const targetWidth = containerWidth
          ? Math.min(containerWidth, maxWidth)
          : maxWidth;

        const fitScale = targetWidth / unscaledViewport.width;
        const totalScale = fitScale * scale;

        const newViewport = page.getViewport({ scale: totalScale });
        console.log(`Viewport for page ${pageNumber}:`, newViewport);
        setViewport(newViewport);

        // Use PDFPageView from pdfjs viewer which will create canvas, textLayer and annotationLayer
        if (pageHostRef.current) {
          // Clean up any previous view to avoid stacking multiple .page elements
          if (
            pageViewRef.current &&
            typeof pageViewRef.current.destroy === "function"
          ) {
            try {
              pageViewRef.current.destroy();
            } catch (e) {
              console.warn("Failed to destroy existing pageView:", e);
            }
            pageViewRef.current = null;
          }
          pageHostRef.current.innerHTML = "";

          // Render at device pixel ratio for crisp output:
          // create a base viewport (scale:1) and ask PDFPageView to render at totalScale * pixelRatio
          const pixelRatio = Math.max(window.devicePixelRatio || 1, 1);
          const baseViewport = page.getViewport({ scale: 1 });
          const pageView = new (pdfjsViewer as any).PDFPageView({
            container: pageHostRef.current,
            id: pageNumber,
            defaultViewport: baseViewport,
            scale: totalScale * pixelRatio,
            eventBus: eventBus,
            linkService: linkService,
            textLayerMode: 1,
            annotationLayerFactory: null,
            enhanceTextSelection: true,
            useOnlyCssZoom: false,
          });

          pageViewRef.current = pageView;
          pageView.setPdfPage(page);
          console.log(`Drawing page ${pageNumber}`);
          await pageView.draw();
          // Ensure the generated .page and canvas match our computed viewport exactly.
          try {
            const pageEl = pageHostRef.current.querySelector(".page");
            if (pageEl) {
              // Force relative positioning and explicit pixel size
              pageEl.style.position = "relative";
              pageEl.style.width = `${Math.round(newViewport.width)}px`;
              pageEl.style.height = `${Math.round(newViewport.height)}px`;
            }

            const canvas = pageHostRef.current.querySelector("canvas");
            if (canvas) {
              // Let PDF.js control the canvas pixel buffer; only enforce CSS sizing
              canvas.style.width = "100%";
              canvas.style.height = "100%";
              // Ensure wrapper doesn't overflow and matches our computed viewport
              const wrapper = canvas.parentElement as HTMLElement | null;
              if (wrapper) {
                wrapper.style.width = `${Math.round(newViewport.width)}px`;
                wrapper.style.height = `${Math.round(newViewport.height)}px`;
                wrapper.style.overflow = "hidden";
              }
            }
          } catch (err) {
            console.warn("Failed to normalize page/canvas sizing:", err);
          }

          console.log(`Page ${pageNumber} drawn successfully`);
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
      if (
        pageViewRef.current &&
        typeof pageViewRef.current.destroy === "function"
      ) {
        try {
          pageViewRef.current.destroy();
        } catch (e) {
          console.error("Error destroying page view on cleanup:", e);
        }
        pageViewRef.current = null;
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
        overflow: "hidden", // clip any overflowing canvas or layers
        marginBottom: "2rem",
      }}
    >
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10 font-medium tracking-wide pointer-events-none">
        {pageNumber}
      </div>

      {/* Host element where PDFPageView will render canvas, text and annotation layers */}
      <div
        ref={pageHostRef}
        className="w-full h-full pdf-page-host"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          // Force override of .page class styles from pdf_viewer.css and prevent overflow
          border: "none",
          margin: "0",
          boxShadow: "none",
          overflow: "hidden",
        }}
      />
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
  const [scale, setScale] = useState(0.5);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1");

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const eventBusRef = useRef<any>(new (pdfjsViewer as any).EventBus());
  const linkServiceRef = useRef<any>(
    new (pdfjsViewer as any).PDFLinkService({ eventBus: eventBusRef.current }),
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
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);

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

  const handleResetZoom = () => setScale(0.5);

  const handlePageChange = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= numPages) {
      const el = document.getElementById(`pdf-page-${page}`);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        setCurrentPage(page);
      }
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const handlePageVisible = (pageNumber: number) => {
    // Only update if the page is significantly different to avoid jitter
    // We actually want the *most* visible page, but for now,
    // the intersection observer triggers on 'entry'.
    // A simple approximation is fine for lazy loading, but for the counter
    // we might want a more precise observer on the main container.
    // However, for simplicity, let's update current page when a page enters viewport
    // and is close to the center.
    // Better yet: we just update it.
    setCurrentPage(pageNumber);
    if (document.activeElement?.id !== "page-input") {
      setInputPage(pageNumber.toString());
    }
  };

  // Handle visibility with a IntersectionObserver for the MAIN container
  // identifying which page is CENTERED in the view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntry = entries.reduce((prev, current) => {
          return prev.intersectionRatio > current.intersectionRatio
            ? prev
            : current;
        });

        if (
          visibleEntry.isIntersecting &&
          visibleEntry.intersectionRatio > 0.1
        ) {
          // Extract page number from ID
          const id = visibleEntry.target.id;
          const num = parseInt(id.replace("pdf-page-", ""));
          if (!isNaN(num)) {
            // Only update if it's the dominant page
            handlePageVisible(num);
          }
        }
      },
      {
        root: null, // viewport
        threshold: [0.1, 0.5, 0.9], // Check at different visibility levels
      },
    );

    // We can't observe from inside the component easily if we want to compare ALL pages.
    // Actually, passing onVisible up is fine, but the "wonkiness" comes from
    // multiple observers firing at once.
    // Let's stick to the local observer but with a high threshold.
    // If we want "middle of screen", we use rootMargin.

    // ... reverting to local observer with better logic ...
  }, []);

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
