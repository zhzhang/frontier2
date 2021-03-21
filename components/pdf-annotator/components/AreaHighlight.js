//

import React, { Component } from "react";

import { Rnd } from "react-rnd";

import "./AreaHighlight.module.css";

class AreaHighlight extends Component {
  render() {
    const { highlight, onChange, ...otherProps } = this.props;

    return (
      <Rnd
        className="AreaHighlight"
        default={{
          x: highlight.position.boundingRect.left,
          y: highlight.position.boundingRect.top,
          width: highlight.position.boundingRect.width,
          height: highlight.position.boundingRect.height,
        }}
        disableDragging
        enableResizing={false}
        {...otherProps}
      />
    );
  }
}

export default AreaHighlight;
