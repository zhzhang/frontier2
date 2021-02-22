import { Document, Page } from "react-pdf";
import { useRef } from "../lib/firebase";
import { pdfjs } from "react-pdf";
import { useState } from "react";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file, fileRef, width }) => {
  const [pageNumber, setPageNumber] = useState(1);
  if (fileRef !== null && fileRef !== undefined) {
    file = useRef(fileRef);
    if (file === undefined) {
      return "Loading...";
    }
  }
  return (
    <>
      <Document file={file}>
        <Page pageNumber={pageNumber} width={width} />
      </Document>
      <button onClick={() => setPageNumber(pageNumber + 1)}>Up</button>
      <button onClick={() => setPageNumber(pageNumber - 1)}>Down</button>
    </>
  );
};

export default PdfViewer;
