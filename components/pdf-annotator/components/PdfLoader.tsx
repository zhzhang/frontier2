import CenteredSpinner from "@/components/CenteredSpinner";
import { useEffect, useState } from "react";
import * as pdfjs from "../pdfjs";

const PDFLoader = ({ url, children }) => {
  const [document, setDocument] = useState(null);
  useEffect(() => {
    setDocument(null);
  }, [url]);
  if (document) {
    return children(document);
  }
  const loadingTask = pdfjs.getDocument(url);
  loadingTask.promise.then((pdfDocument) => {
    setDocument(pdfDocument);
  });
  return (
    <div>
      <CenteredSpinner />
    </div>
  );
};

export default PDFLoader;
