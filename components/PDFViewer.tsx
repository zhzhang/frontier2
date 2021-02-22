import { Document, Page } from "react-pdf";
import { useRef } from "../lib/firebase";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file, fileRef, width, pageNumber }) => {
  if (fileRef !== null && fileRef !== undefined) {
    file = useRef(fileRef);
    if (file === undefined) {
      return "Loading...";
    }
  }
  return (
    <Document file={file}>
      <Page pageNumber={pageNumber} width={width} />
    </Document>
  );
};

export default PdfViewer;
