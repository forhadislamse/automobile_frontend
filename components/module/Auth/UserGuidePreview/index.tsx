"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function UserGuidePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageWidth, setPageWidth] = useState(900);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setPageWidth(Math.min(container.clientWidth - 32, 900));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[70vh] flex-1 overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-2 sm:p-4"
    >
      <Document
        file="/SmartAutoTech Quick Start Guide.pdf"
        loading={
          <div className="flex h-full min-h-[480px] items-center justify-center text-sm text-slate-500">
            Loading preview...
          </div>
        }
        error={
          <div className="flex h-full min-h-[480px] items-center justify-center text-sm text-red-500">
            Could not load the Quick start guide preview.
          </div>
        }
        onLoadError={(error) => {
          console.error("Quick start guide preview failed to load:", error);
        }}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        className="flex flex-col items-center gap-4"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth}
            className="overflow-hidden rounded-md bg-white shadow-sm"
          />
        ))}
      </Document>
    </div>
  );
}
