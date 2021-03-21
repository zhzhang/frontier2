import { Document, Page } from "react-pdf";
import { useRef } from "../lib/firebase";
import { pdfjs } from "react-pdf";
import { useState } from "react";
import { PdfLoader } from "./pdf-annotator";
import PdfArticle from "./PdfArticle";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file, fileRef, width, editing }) => {
  const [numPages, setNumPages] = useState(null);
  if (fileRef !== null && fileRef !== undefined) {
    file = useRef(fileRef);
    if (file === undefined) {
      return "Loading...";
    }
  }
  return (
    <PdfLoader url={file} beforeLoad={<span>loading</span>}>
      {(pdfDocument) => <PdfArticle document={pdfDocument} highlights={[]} />}
    </PdfLoader>
  );
  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      {Array.apply(null, Array(numPages))
        .map((x, i) => i + 1)
        .map((page) => (
          <Page pageNumber={page} width={700} key={page} />
        ))}
    </Document>
  );
};

export default PdfViewer;
