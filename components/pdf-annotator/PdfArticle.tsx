import { useEffect, useRef } from "react";

const PdfArticle = ({ document }) => {
  const ref = useRef(null);
  useEffect(() => {
    var scale = 1.2;
    document.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: scale });

      const canvas = ref.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  });

  return <canvas ref={ref} />;
};

export default PdfArticle;
