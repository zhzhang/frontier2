import { Document, Page } from "react-pdf";
import { useRef } from "../lib/firebase";
import { pdfjs } from "react-pdf";
import { useState } from "react";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file, fileRef, width }) => {
  const [numPages, setNumPages] = useState(null);
  if (fileRef !== null && fileRef !== undefined) {
    file = useRef(fileRef);
    if (file === undefined) {
      return "Loading...";
    }
  }
  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      {Array.apply(null, Array(numPages))
        .map((x, i) => i + 1)
        .map((page) => (
          <Page pageNumber={page} width={width} style={{ border: 1 }} />
        ))}
    </Document>
  );
};

export default PdfViewer;
