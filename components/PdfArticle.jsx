import React, { Component } from "react";

import {
  PdfLoader,
  PdfAnnotator,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "./pdf-annotator";

import "./PdfArticle.module.css";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => location.hash.slice("#highlight-".length);

const resetHash = () => {
  location.hash = "";
};

class PdfArticle extends Component {
  scrollViewerTo = (highlight) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { url, highlights } = this.props;
    if (highlights.length === 1) {
      this.scrollViewerTo(highlights[0]);
    }
  }

  getHighlightById(id) {
    const { highlights } = this.props;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight) {
    const { sendHighlight } = this.props;
    sendHighlight({ ...highlight, id: getNextId() });
  }

  render() {
    const { highlights, isEditing, document } = this.props;

    return (
      <PdfAnnotator
        pdfDocument={document}
        enableAreaSelection={(event) => event.shiftKey}
        onScrollChange={resetHash}
        scrollRef={(scrollTo) => {
          this.scrollViewerTo = scrollTo;

          this.scrollToHighlightFromHash();
        }}
        onSelectionFinished={(
          position,
          content,
          hideTipAndSelection,
          transformSelection
        ) =>
          isEditing ? (
            <Tip
              onOpen={transformSelection}
              onConfirm={() => {
                this.addHighlight({ content, position });
                hideTipAndSelection();
              }}
            />
          ) : null
        }
        highlightTransform={(
          highlight,
          index,
          setTip,
          hideTip,
          viewportToScaled,
          screenshot,
          isScrolledTo
        ) => {
          const isTextHighlight = !(
            highlight.content && highlight.content.image
          );

          const component = isTextHighlight ? (
            <Highlight
              isScrolledTo={isScrolledTo}
              position={highlight.position}
            />
          ) : (
            <AreaHighlight highlight={highlight} />
          );

          return component;
        }}
        highlights={highlights}
      />
    );
  }
}

export default PdfArticle;
