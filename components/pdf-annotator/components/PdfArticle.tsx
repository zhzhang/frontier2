import _ from "lodash";
import * as pdfjsWeb from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";
import React from "react";
import ReactDom from "react-dom";
import { scaledToViewport, viewportToScaled } from "../lib/coordinates";
import getBoundingRect from "../lib/get-bounding-rect";
import getClientRects from "../lib/get-client-rects";
import {
  findOrCreateContainerLayer,
  getPageFromRange,
  getWindow,
} from "../lib/pdfjs-dom";
import Highlight from "./Highlight";
import styles from "./PdfAnnotator.module.css";
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
      eventBus.on("textlayerrendered", this.onTextLayerRendered);
      eventBus.on("pagesinit", this.onDocumentReady);
      doc.addEventListener("selectionchange", this.onSelectionChange);
      doc.defaultView.addEventListener("resize", this.debouncedScaleValue);
      if (observer) observer.observe(ref);
      this.unsubscribe = () => {
        eventBus.off("pagesinit", this.onDocumentReady);
        eventBus.off("textlayerrendered", this.onTextLayerRendered);
        doc.removeEventListener("selectionchange", this.onSelectionChange);
        doc.defaultView.removeEventListener("resize", this.debouncedScaleValue);
        if (observer) observer.disconnect();
      };
    }
  };

  onDocumentReady = () => {
    this.handleScaleValue();
  };

  onTextLayerRendered = () => {
    const { onRenderedCallback, setScrollTo } = this.props;
    if (onRenderedCallback) {
      onRenderedCallback(this);
    }
    if (setScrollTo) {
      setScrollTo(() => this.scrollTo);
    }
    this.renderHighlights();
  };

  onMouseDown = (event) => {
    this.hideTipAndSelection();
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

  onScroll = () => {
    this.setState(
      {
        scrolledToHighlightId: null,
      },
      () => this.renderHighlights()
    );

    this.viewer.container.removeEventListener("scroll", this.onScroll);
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
      this.viewer.currentScaleValue = 0.9; //"page-width";
    }
  };

  hideTipAndSelection = () => {
    this.setState({
      tipPosition: null,
      tipChildren: null,
    });

    this.setState({ ghostHighlight: null, tip: null }, () =>
      this.renderHighlights()
    );
  };

  afterSelection = () => {
    const { editing } = this.props;
    if (!editing) {
      return;
    }
    const { isCollapsed, range } = this.state;
    if (!range || isCollapsed) {
      return;
    }
    const page = getPageFromRange(range);
    if (!page) {
      return;
    }
    const rects = getClientRects(range, page.node).filter(
      (rect) => rect.height > 0
    );
    if (rects.length === 0) {
      return;
    }
    const boundingRect = getBoundingRect(rects);
    const viewportPosition = { boundingRect, rects, pageNumber: page.number };
    const scaledPosition = this.viewportPositionToScaled(viewportPosition);

    this.setTip(
      viewportPosition,
      <Tip
        onConfirm={() => {
          const { highlights, setHighlights, articleVersion } = this.props;
          const highlight = {
            ...scaledPosition,
            id: highlights.length + 1,
            articleVersion,
            text: range.toString(),
          };
          setHighlights([...highlights, highlight]);
          this.hideTipAndSelection();
        }}
      />
    );
  };

  debouncedAfterSelection = _.debounce(this.afterSelection, 500);

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
        const { pageNumber } = highlight;

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
      styles.PdfHighlightLayer
    );
  }

  scaledPositionToViewport({
    pageNumber,
    boundingRect,
    rects,
    usePdfCoordinates,
  }) {
    const viewport = this.viewer.getPageView(pageNumber - 1).viewport;

    return {
      boundingRect: scaledToViewport(boundingRect, viewport, usePdfCoordinates),
      rects: (rects || []).map((rect) =>
        scaledToViewport(rect, viewport, usePdfCoordinates)
      ),
      pageNumber,
    };
  }

  scrollTo = (highlight) => {
    const { id, pageNumber, boundingRect, usePdfCoordinates } = highlight;

    this.viewer.container.removeEventListener("scroll", this.onScroll);

    const pageViewport = this.viewer.getPageView(pageNumber - 1).viewport;

    const scrollMargin = 200;

    this.viewer.scrollPageIntoView({
      pageNumber,
      destArray: [
        null,
        { name: "XYZ" },
        ...pageViewport.convertToPdfPoint(
          0,
          scaledToViewport(boundingRect, pageViewport, usePdfCoordinates).top -
            scrollMargin
        ),
        0,
      ],
    });

    this.setState(
      {
        scrolledToHighlightId: id,
      },
      () => this.renderHighlights()
    );

    // wait for scrolling to finish
    setTimeout(() => {
      this.viewer.container.addEventListener("scroll", this.onScroll);
    }, 100);
  };

  renderHighlights(nextProps?) {
    const { highlights, articleVersion } = nextProps || this.props;

    const { document } = this.props;

    const { scrolledToHighlightId } = this.state;

    const highlightsToRender = _.filter(
      highlights,
      (h) => h.articleVersion === articleVersion
    );

    const highlightsByPage = this.groupHighlightsByPage(highlightsToRender);

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const highlightLayer = this.findOrCreateHighlightLayer(pageNumber);

      if (highlightLayer) {
        ReactDom.render(
          <div>
            {(highlightsByPage[String(pageNumber)] || []).map(
              (highlight, index) => {
                const isScrolledTo = Boolean(
                  scrolledToHighlightId === highlight.id
                );
                const position = this.scaledPositionToViewport(highlight);

                return (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={position}
                    id={highlight.id}
                    key={highlight.id}
                  />
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
      <div ref={this.attachRef} className={styles.PdfAnnotator}>
        {this.renderTip()}
        <div className="pdfViewer" onMouseDown={this.onMouseDown} />
      </div>
    );
  }
}
