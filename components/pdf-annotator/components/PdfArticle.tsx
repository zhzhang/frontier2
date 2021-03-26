import React, { useEffect, useRef } from "react";
import * as pdfjsWeb from "pdfjs-dist/web/pdf_viewer";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

export default class PdfArticle extends React.Component {
  containerNode = null;

  componentDidMount() {
    const { document } = this.props;
    this.eventBus = new pdfjsWeb.EventBus();
    this.linkService = new pdfjsWeb.PDFLinkService({
      eventBus: this.eventBus,
    });
    this.viewer = new pdfjsWeb.PDFViewer({
      container: this.containerNode,
      enhanceTextSelection: true,
      removePageBorders: true,
      linkService: this.linkService,
      eventBus: this.eventBus,
    });
    console.log(this.viewer);
    this.viewer.setDocument(document);
    this.linkService.setDocument(document);
  }

  componentWillUnmount() {
    document.removeEventListener("selectionchange", this.onSelectionChange);
    document.removeEventListener("keydown", this.handleKeyDown);

    this.containerNode &&
      this.containerNode.removeEventListener(
        "textlayerrendered",
        this.onTextLayerRendered
      );
  }

  render() {
    // document.getPage(1).then((page) => {
    //   const viewport = page.getViewport({ scale: scale });

    //   const canvas = ref.current;
    //   const context = canvas.getContext("2d");
    //   canvas.height = viewport.height;
    //   canvas.width = viewport.width;

    //   const renderContext = {
    //     canvasContext: context,
    //     viewport: viewport,
    //   };
    //   page.render(renderContext);
    // });

    return (
      <div
        ref={(node) => {
          this.containerNode = node;
        }}
        className="PdfAnnotator"
      >
        <div className="pdfViewer" />
      </div>
    );
  }
}
