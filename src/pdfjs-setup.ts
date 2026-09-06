import * as pdfjsLib from "pdfjs-dist";

// pdf_viewer.mjs destructures from globalThis.pdfjsLib at module evaluation time.
// This must run before any import of pdfjs-dist/web/pdf_viewer.mjs.
(globalThis as unknown as Record<string, unknown>).pdfjsLib = pdfjsLib;
