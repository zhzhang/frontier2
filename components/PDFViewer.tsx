import CenteredSpinner from "@/components/CenteredSpinner";
import { useRef } from "@/lib/firebase";
import { PdfAnnotator, PdfLoader } from "./pdf-annotator";

const PdfViewer = ({ file, fileRef, ...props }) => {
  if (fileRef !== null && fileRef !== undefined) {
    file = useRef(fileRef);
    if (file === undefined) {
      return (
        <div>
          <CenteredSpinner />
        </div>
      );
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
