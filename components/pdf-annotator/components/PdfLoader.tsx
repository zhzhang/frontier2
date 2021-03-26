import { useState } from "react";
import * as pdfjs from "../pdfjs";

const PDFLoader = ({ url, children }) => {
  const [document, setDocument] = useState(null);
  if (document) {
    return children(document);
  }
  const loadingTask = pdfjs.getDocument(url);
  loadingTask.promise.then((pdfDocument) => {
    setDocument(pdfDocument);
  });
  return "Loading";
};

export default PDFLoader;
