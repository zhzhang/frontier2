import { useRef } from "../lib/firebase";
import { PdfLoader, PdfAnnotator } from "./pdf-annotator";

const PdfViewer = ({ file, fileRef, ...props }) => {
  if (fileRef !== null && fileRef !== undefined) {
    file = useRef(fileRef);
    if (file === undefined) {
      return "Loading...";
    }
  }
  return (
    <PdfLoader url={file}>
      {(pdfDocument) => {
        return <PdfAnnotator document={pdfDocument} {...props} />;
      }}
    </PdfLoader>
  );
};

export default PdfViewer;
