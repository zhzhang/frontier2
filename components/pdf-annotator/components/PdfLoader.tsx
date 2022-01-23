import CenteredSpinner from "@/components/CenteredSpinner";
import * as pdfjs from "@/lib/pdfjs";
import { useEffect, useState } from "react";

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
  return <CenteredSpinner />;
};

export default PDFLoader;
