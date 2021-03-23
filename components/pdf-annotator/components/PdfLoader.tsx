import { useState } from "react";
import pdfjs from "pdfjs-dist";

const PDFLoader = ({ url, children }) => {
  const [document, setDocument] = useState(null);
  pdfjs.getDocument(url).then((pdfDocument) => {
    setDocument(pdfDocument);
  });
  if (document) {
    return children(document);
  }
  return "Loading";
};

export default PDFLoader;
