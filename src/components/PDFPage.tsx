import React, { useState, useEffect, useRef } from "react";
// Import annotation layer CSS
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

const maxWidth = 1400;

interface PDFPageProps {
  pageNumber: number;
  pdf: any; // PDFDocumentProxy (use any to avoid missing-global type errors in CI)
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
    const obs = new IntersectionObserver(
      ([ent]) => {
        setIsVisible(ent.isIntersecting);
        if (ent.isIntersecting && ent.intersectionRatio > 0.5) {
          onVisible(pageNumber);
        }
      },
      {
        rootMargin: "100px 0px", // Keep pre-rendering margin
        threshold: [0, 0.5, 1.0], // Trigger at 0 (for render) and 0.5 (for page count)
      },
    );

    if (containerRef.current) {
      obs.observe(containerRef.current);
    }

    return () => {
      obs.disconnect();
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
          const pageView = new pdfViewerLib.PDFPageView({
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
          await pageView.draw();
          // Ensure the generated .page and canvas match our computed viewport exactly.
          try {
            const pageEl = pageHostRef.current.querySelector(
              ".page",
            ) as HTMLElement | null;
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
      {/* Page Number Badge */}
      <div className="absolute bottom-4 right-4  text-black text-xs px-3 py-1  z-10 font-medium tracking-wide pointer-events-none">
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

export default PDFPage;
