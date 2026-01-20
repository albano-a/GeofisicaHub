declare module "pdfjs-dist/web/pdf_viewer" {
  const pdfjsViewer: any;
  export = pdfjsViewer;
}

declare module "pdfjs-dist" {
  const pdfjsLib: any;
  export = pdfjsLib;
}

declare const pdfjsLib: any;
declare const pdfjsViewer: any;
declare module "pdfjs-dist/web/pdf_viewer" {
  const x: any;
  export = x;
}
