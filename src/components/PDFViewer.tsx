import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { storage, BUCKET_ID } from "../services/appwrite";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiZoomIn, FiZoomOut, FiRotateCcw } from "react-icons/fi";
import { MdFitScreen, MdOutlineOpenInFull } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";
import PDFPage from "./PDFPage";

import "pdfjs-dist/web/pdf_viewer.css";

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { EventBus, PDFLinkService } from "pdfjs-dist/web/pdf_viewer.mjs";
import type { PDFDocumentProxy, RefProxy } from "pdfjs-dist/types/src/display/api";
import type { EventBus as EventBusType } from "pdfjs-dist/types/web/event_utils";
import type { PDFLinkService as PDFLinkServiceType } from "pdfjs-dist/types/web/pdf_link_service";

interface PDFOutlineItem {
  title: string;
  dest: string | unknown[] | null;
  items?: PDFOutlineItem[];
}

try {
  GlobalWorkerOptions.workerSrc = workerSrc;
} catch {
  // ignore
}

const ZOOM_LEVELS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
  2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0,
];
const FIT_WIDTH_SCALE = 1.0;

const PDFViewer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const fileId = searchParams.get("fileId");
  const initialPage = parseInt(searchParams.get("page") || "1") || 1;

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [outline, setOutline] = useState<PDFOutlineItem[]>([]);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const [scale, setScale] = useState(FIT_WIDTH_SCALE);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [firstPageAspect, setFirstPageAspect] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputPage, setInputPage] = useState(String(initialPage));

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPageRef = useRef(currentPage);
  const objectUrlRef = useRef<string | null>(null);
  const eventBusRef = useRef<EventBusType>(new EventBus());
  const linkServiceRef = useRef<PDFLinkServiceType>(
    new PDFLinkService({ eventBus: eventBusRef.current }),
  );
  const navigate = useNavigate();

  // Measure container dimensions
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Fetch and load PDF
  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setLoadProgress(0);
        setError(null);

        const viewUrl = storage.getFileView({ bucketId: BUCKET_ID, fileId });
        const response = await fetch(viewUrl, { method: "GET", mode: "cors" });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;

        const loadingTask = getDocument(url);
        loadingTask.onProgress = ({ loaded, total }) => {
          if (total > 0) setLoadProgress(Math.round((loaded / total) * 100));
        };

        const pdf = await loadingTask.promise;
        if (cancelled) return;

        // Revoke blob URL now that PDF.js has loaded the document
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);

        try {
          if (typeof linkServiceRef.current.setDocument === "function") {
            linkServiceRef.current.setDocument(pdf);
          }
        } catch {
          // ignore
        }

        // Get first page aspect ratio for fit-page zoom
        const firstPage = await pdf.getPage(1);
        const vp = firstPage.getViewport({ scale: 1 });
        setFirstPageAspect(vp.height / vp.width);

        const outlineData = await pdf.getOutline();
        setOutline((outlineData || []) as PDFOutlineItem[]);

        setLoading(false);

        // Restore page position from URL
        if (initialPage > 1) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.getElementById(`pdf-page-${initialPage}`);
              el?.scrollIntoView({ block: "start" });
            });
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF load error:", err);
          setError("Failed to load PDF. Please check permissions.");
          setLoading(false);
        }
      }
    };

    loadPdf();
    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [fileId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync currentPage to ref
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Sync page to URL (debounced via ref approach to avoid spamming)
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(currentPage));
        return next;
      },
      { replace: true },
    );
  }, [currentPage, setSearchParams]);

  // Maintain scroll position when zoom changes
  useEffect(() => {
    const page = currentPageRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(`pdf-page-${page}`)?.scrollIntoView({ block: "start" });
      });
    });
  }, [scale]);

  const handleZoom = useCallback((type: "in" | "out" | "reset" | "fitwidth" | "fitpage") => {
    setScale((prev) => {
      if (type === "fitwidth") return FIT_WIDTH_SCALE;
      if (type === "fitpage") {
        if (firstPageAspect && containerHeight > 0 && containerWidth > 0) {
          // scale so page height fits container (with 64px header + 32px padding)
          const availH = containerHeight - 96;
          const pageHeightAtFitWidth = containerWidth * firstPageAspect;
          return Math.max(0.1, availH / pageHeightAtFitWidth);
        }
        return FIT_WIDTH_SCALE;
      }
      if (type === "reset") return FIT_WIDTH_SCALE;
      if (type === "in") return ZOOM_LEVELS.find((z) => z > prev + 0.001) || prev;
      return [...ZOOM_LEVELS].reverse().find((z) => z < prev - 0.001) || prev;
    });
  }, [firstPageAspect, containerHeight, containerWidth]);

  const scrollToPage = useCallback((page: number) => {
    const el = document.getElementById(`pdf-page-${page}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(page);
      setInputPage(String(page));
    }
  }, []);

  const handlePageChange = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= numPages) {
      scrollToPage(page);
    } else {
      setInputPage(String(currentPage));
    }
    inputRef.current?.blur();
  };

  const handlePageVisible = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (document.activeElement?.id !== "page-input") {
      setInputPage(String(pageNumber));
    }
  }, []);

  const renderOutlineItems = (items: PDFOutlineItem[]) => (
    <ul className="pl-4 custom-pdf-outline">
      {items.map((item, idx) => (
        <li key={idx} className="mb-1">
          <button
            onClick={async () => {
              if (pdfDocument && item.dest) {
                try {
                  const dest =
                    typeof item.dest === "string"
                      ? await pdfDocument.getDestination(item.dest)
                      : item.dest;
                  if (Array.isArray(dest)) {
                    const ref = dest[0] as RefProxy;
                    const pageIndex = await pdfDocument.getPageIndex(ref);
                    document
                      .getElementById(`pdf-page-${pageIndex + 1}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          {item.items && item.items.length > 0 && renderOutlineItems(item.items)}
        </li>
      ))}
    </ul>
  );

  if (!fileId) {
    return (
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Invalid Request</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">No file ID provided.</p>
          <Button
            onClick={() => navigate("/hub")}
            variant="contained"
            sx={{ borderRadius: "15px", fontFamily: "Poppins" }}
            className="!bg-geo-primary hover:!bg-geo-darkprimary"
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
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm px-3 py-2">
        <div className="max-w-6xl mx-auto flex items-center gap-2 justify-between">
          {/* Left: Back + TOC */}
          <div className="flex items-center gap-1 shrink-0">
            <IconButton onClick={() => navigate("/hub")} size="small" title="Back">
              <IoMdArrowRoundBack className="text-gray-700 dark:text-gray-200" />
            </IconButton>
            {!loading && outline.length > 0 && (
              <IconButton
                onClick={() => setOutlineOpen(true)}
                size="small"
                title="Table of Contents"
                className="!text-geo-primary dark:!text-geo-darkprimary"
              >
                <FormatListBulletedIcon fontSize="small" />
              </IconButton>
            )}
          </div>

          {/* Center: Page navigation */}
          {numPages > 0 && (
            <div className="flex items-center gap-1">
              <IconButton
                onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                size="small"
                title="Previous page"
              >
                <IoChevronBack className="text-gray-700 dark:text-gray-200" size={16} />
              </IconButton>
              <form
                onSubmit={handlePageChange}
                className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600"
              >
                <input
                  ref={inputRef}
                  id="page-input"
                  type="text"
                  inputMode="numeric"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onBlur={() => setInputPage(String(currentPage))}
                  className="w-8 text-center bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 p-0 outline-none"
                />
                <span className="text-gray-400 dark:text-gray-500 text-sm">/ {numPages}</span>
              </form>
              <IconButton
                onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                size="small"
                title="Next page"
              >
                <IoChevronForward className="text-gray-700 dark:text-gray-200" size={16} />
              </IconButton>
            </div>
          )}

          {/* Right: Zoom controls */}
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 border border-gray-300 dark:border-gray-600 shrink-0">
            <IconButton onClick={() => handleZoom("out")} disabled={scale <= ZOOM_LEVELS[0]} size="small" title="Zoom Out">
              <FiZoomOut className="text-gray-700 dark:text-gray-200" size={15} />
            </IconButton>
            <span className="min-w-[3rem] text-center text-xs font-medium text-gray-700 dark:text-gray-200 select-none tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <IconButton onClick={() => handleZoom("in")} disabled={scale >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]} size="small" title="Zoom In">
              <FiZoomIn className="text-gray-700 dark:text-gray-200" size={15} />
            </IconButton>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-0.5" />
            <IconButton onClick={() => handleZoom("fitwidth")} size="small" title="Fit to width">
              <MdOutlineOpenInFull className="text-gray-700 dark:text-gray-200" size={15} />
            </IconButton>
            <IconButton onClick={() => handleZoom("fitpage")} size="small" title="Fit page">
              <MdFitScreen className="text-gray-700 dark:text-gray-200" size={15} />
            </IconButton>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-0.5" />
            <IconButton onClick={() => handleZoom("reset")} size="small" title="Reset zoom">
              <FiRotateCcw className="text-gray-700 dark:text-gray-200" size={14} />
            </IconButton>
          </div>
        </div>

        {/* Progress bar */}
        {loading && loadProgress > 0 && loadProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-geo-primary dark:bg-geo-darkprimary transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="w-full h-full flex-1 relative">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <LoadingSpinner />
              <div className="flex flex-col items-center gap-2">
                <span className="text-geo-primary dark:text-geo-darkprimary text-sm font-medium">
                  Loading PDF{loadProgress > 0 ? ` — ${loadProgress}%` : "..."}
                </span>
                {loadProgress > 0 && (
                  <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-geo-primary dark:bg-geo-darkprimary rounded-full transition-all duration-300"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-24 p-8">
              <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Ensure the bucket has read permissions set to "Any" in AppWrite.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="contained"
                sx={{ borderRadius: "15px", fontFamily: "Poppins" }}
                className="!bg-geo-primary hover:!bg-geo-darkprimary"
              >
                Try Again
              </Button>
            </div>
          )}

          {!error && !loading && pdfDocument && (
            <div className="bg-geo-lightbg dark:bg-geo-darkbg flex flex-col w-full h-full">
              {/* TOC Sidebar */}
              <div
                className={`fixed inset-y-0 left-0 z-[100] w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                  outlineOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="h-full flex flex-col">
                  <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                    <Typography variant="h6" className="!text-sm !font-semibold text-gray-800 dark:text-gray-200 font-poppins">
                      Table of Contents
                    </Typography>
                    <IconButton onClick={() => setOutlineOpen(false)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 custom-pdf-outline">
                    {renderOutlineItems(outline)}
                  </div>
                </div>
              </div>

              {outlineOpen && (
                <div
                  className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
                  onClick={() => setOutlineOpen(false)}
                />
              )}

              {/* Pages */}
              <div
                className="flex-1 w-full bg-gray-300 dark:bg-gray-900 h-full overflow-auto"
                ref={containerRef}
                style={{ scrollBehavior: "auto" }}
              >
                <div className="flex flex-col items-center py-6 gap-0 max-w-full mx-auto">
                  {Array.from({ length: numPages }, (_, i) => (
                    <PDFPage
                      key={i + 1}
                      pageNumber={i + 1}
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

      {/* Branding */}
      <div className="fixed bottom-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm pointer-events-none select-none">
        GeofisicaHub Reader
      </div>
    </div>
  );
};

export default PDFViewer;
