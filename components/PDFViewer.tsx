import { useRef } from "../lib/firebase";
import { useState } from "react";
import { PdfLoader } from "./pdf-annotator";
import PdfArticle from "./pdf-annotator/PdfArticle";

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
      {(pdfDocument) => {
        return <PdfArticle document={pdfDocument} highlights={[]} />;
      }}
    </PdfLoader>
  );
};

export default PdfViewer;
