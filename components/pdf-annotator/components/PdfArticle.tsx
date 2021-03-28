import React, { useEffect, useRef } from "react";
import ReactDom from "react-dom";
import * as pdfjsWeb from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";
import styles from "./PdfAnnotator.module.css";
import {
  getWindow,
  getPageFromRange,
  findOrCreateContainerLayer,
} from "../lib/pdfjs-dom";
import getClientRects from "../lib/get-client-rects";
import getBoundingRect from "../lib/get-bounding-rect";
import { scaledToViewport, viewportToScaled } from "../lib/coordinates";
import debounce from "lodash.debounce";

import Tip from "./Tip";
import TipContainer from "./TipContainer";

export default class PdfArticle extends React.Component {
  viewer: null;
  containerNode = null;
  eventBus = new pdfjsWeb.EventBus();
  linkService = new pdfjsWeb.PDFLinkService({
    eventBus: this.eventBus,
    externalLinkTarget: 2,
  });
  state = {
    ghostHighlight: null,
    isCollapsed: true,
    range: null,
    scrolledToHighlightId: "",
    isAreaSelectionInProgress: false,
    tip: null,
    tipPosition: null,
    tipChildren: null,
  };

  unsubscribe = () => {};

  attachRef = (ref) => {
    const { eventBus, resizeObserver: observer } = this;
    this.containerNode = ref;
    this.unsubscribe();

    if (ref) {
      const { ownerDocument: doc } = ref;
      // eventBus.on("textlayerrendered", this.onTextLayerRendered);
      eventBus.on("pagesinit", this.onDocumentReady);
      doc.addEventListener("selectionchange", this.onSelectionChange);
      doc.addEventListener("keydown", this.handleKeyDown);
      doc.defaultView.addEventListener("resize", this.debouncedScaleValue);
      if (observer) observer.observe(ref);

      this.unsubscribe = () => {
        eventBus.off("pagesinit", this.onDocumentReady);
        eventBus.off("textlayerrendered", this.onTextLayerRendered);
        doc.removeEventListener("selectionchange", this.onSelectionChange);
        doc.removeEventListener("keydown", this.handleKeyDown);
        doc.defaultView.removeEventListener("resize", this.debouncedScaleValue);
        if (observer) observer.disconnect();
      };
    }
  };

  onDocumentReady = () => {
    this.handleScaleValue();
  };

  onTextLayerRendered = () => {
    this.renderHighlights();
  };

  onSelectionChange = () => {
    const container = this.containerNode;
    const selection = getWindow(container).getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (selection.isCollapsed) {
      this.setState({ isCollapsed: true });
      return;
    }

    if (
      !range ||
      !container ||
      !container.contains(range.commonAncestorContainer)
    ) {
      return;
    }

    this.setState({
      isCollapsed: false,
      range,
    });

    this.debouncedAfterSelection();
  };

  viewportPositionToScaled({ pageNumber, boundingRect, rects }) {
    const viewport = this.viewer.getPageView(pageNumber - 1).viewport;

    return {
      boundingRect: viewportToScaled(boundingRect, viewport),
      rects: (rects || []).map((rect) => viewportToScaled(rect, viewport)),
      pageNumber,
    };
  }

  handleScaleValue = () => {
    if (this.viewer) {
      this.viewer.currentScaleValue = "auto"; //"page-width";
    }
  };

  afterSelection = () => {
    // const { onSelectionFinished } = this.props;
    const { isCollapsed, range } = this.state;
    if (!range || isCollapsed) {
      return;
    }
    const page = getPageFromRange(range);
    if (!page) {
      return;
    }
    const rects = getClientRects(range, page.node);
    if (rects.length === 0) {
      return;
    }
    const boundingRect = getBoundingRect(rects);
    const viewportPosition = { boundingRect, rects, pageNumber: page.number };
    const content = {
      text: range.toString(),
    };
    const scaledPosition = this.viewportPositionToScaled(viewportPosition);
    this.setTip(
      viewportPosition,
      <Tip
        onOpen={() =>
          this.setState(
            {
              ghostHighlight: { position: scaledPosition },
            },
            () => this.renderHighlights()
          )
        }
        onConfirm={(comment) => {
          this.addHighlight({ content, position, comment });

          hideTipAndSelection();
        }}
      />
    );
  };

  debouncedAfterSelection = debounce(this.afterSelection, 500);

  setTip(position, inner) {
    this.setState(
      {
        tipPosition: position,
        tipChildren: inner,
      },
      () => this.renderHighlights()
    );
  }

  componentDidMount() {
    const { document } = this.props;

    this.viewer =
      this.viewer ||
      new pdfjsWeb.PDFViewer({
        container: this.containerNode,
        eventBus: this.eventBus,
        enhanceTextSelection: true,
        removePageBorders: true,
        linkService: this.linkService,
      });

    // Additional pointers to allow link service to function.
    this.linkService.setDocument(document);
    this.linkService.setViewer(this.viewer);
    this.viewer.setDocument(document);

    // debug
    window.PdfViewer = this;
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

  groupHighlightsByPage(highlights) {
    const { ghostHighlight } = this.state;

    return [...highlights, ghostHighlight]
      .filter(Boolean)
      .reduce((res, highlight) => {
        const { pageNumber } = highlight.position;

        res[pageNumber] = res[pageNumber] || [];
        res[pageNumber].push(highlight);

        return res;
      }, {});
  }

  findOrCreateHighlightLayer(page: number) {
    const { textLayer } = this.viewer.getPageView(page - 1) || {};

    if (!textLayer) {
      return null;
    }

    return findOrCreateContainerLayer(
      textLayer.textLayerDiv,
      "PdfHighlighter__highlight-layer"
    );
  }

  renderHighlights(nextProps?) {
    const { highlightTransform, highlights } = nextProps || this.props;

    const { document } = this.props;

    const { tip, scrolledToHighlightId } = this.state;
    console.log(tip);

    const highlightsByPage = this.groupHighlightsByPage(highlights);

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const highlightLayer = this.findOrCreateHighlightLayer(pageNumber);

      if (highlightLayer) {
        ReactDom.render(
          <div>
            {(highlightsByPage[String(pageNumber)] || []).map(
              ({ position, id, ...highlight }, index) => {
                const viewportHighlight = {
                  id,
                  position: this.scaledPositionToViewport(position),
                  ...highlight,
                };

                if (tip && tip.highlight.id === String(id)) {
                  this.showTip(tip.highlight, tip.callback(viewportHighlight));
                }

                const isScrolledTo = Boolean(scrolledToHighlightId === id);

                return highlightTransform(
                  viewportHighlight,
                  index,
                  (highlight, callback) => {
                    this.setState({
                      tip: { highlight, callback },
                    });

                    this.showTip(highlight, callback(highlight));
                  },
                  this.hideTipAndSelection,
                  (rect) => {
                    const viewport = this.viewer.getPageView(pageNumber - 1)
                      .viewport;

                    return viewportToScaled(rect, viewport);
                  },
                  (boundingRect) => this.screenshot(boundingRect, pageNumber),
                  isScrolledTo
                );
              }
            )}
          </div>,
          highlightLayer
        );
      }
    }
  }

  renderTip = () => {
    const { tipPosition, tipChildren } = this.state;
    if (!tipPosition) return null;
    console.log(tipPosition);
    console.log(tipChildren);

    const { boundingRect, pageNumber } = tipPosition;
    const page = {
      node: this.viewer.getPageView(pageNumber - 1).div,
    };

    return (
      <TipContainer
        scrollTop={this.viewer.container.scrollTop}
        pageBoundingRect={page.node.getBoundingClientRect()}
        style={{
          left:
            page.node.offsetLeft + boundingRect.left + boundingRect.width / 2,
          top: boundingRect.top + page.node.offsetTop,
          bottom: boundingRect.top + page.node.offsetTop + boundingRect.height,
        }}
      >
        {tipChildren}
      </TipContainer>
    );
  };

  render() {
    return (
      <div
        ref={this.attachRef}
        className={styles.PdfAnnotator}
        // style={{
        //   minWidth: 730,
        //   width: "auto",
        //   position: "relative",
        //   overflowY: "scroll",
        //   height: "calc(100vh - 55px)",
        // }}
      >
        <div className="pdfViewer" />
        {this.renderTip()}
      </div>
    );
  }
}
