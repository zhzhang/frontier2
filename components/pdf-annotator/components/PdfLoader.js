import React, { Component } from "react";
import { pdfjs } from "react-pdf";

class PdfLoader extends Component {
  state = {
    pdfDocument: null,
  };

  componentDidMount() {
    const { url } = this.props;
    const loadingTask = pdfjs.getDocument(url);
    loadingTask.promise.then((pdfDocument) => {
      this.setState({
        pdfDocument,
      });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { url } = this.props;
    if (prevProps.url !== url) {
      this.setState({
        pdfDocument: null,
      });
      pdfjs.getDocument(url).then((pdfDocument) => {
        this.setState({
          pdfDocument,
        });
      });
    }
  }

  render() {
    const { children, beforeLoad } = this.props;
    const { pdfDocument } = this.state;

    if (pdfDocument) {
      return children(pdfDocument);
    }

    return beforeLoad;
  }
}

export default PdfLoader;
