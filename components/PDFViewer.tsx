import { useRef } from "../lib/firebase";
import { useState } from "react";
import { PdfLoader, PdfAnnotator } from "./pdf-annotator";

const PdfViewer = ({ file, fileRef, highlights, setHighlights, editing }) => {
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
        return (
          <PdfAnnotator
            document={pdfDocument}
            highlights={highlights}
            setHighlights={setHighlights}
          />
        );
      }}
    </PdfLoader>
  );
};

export default PdfViewer;
