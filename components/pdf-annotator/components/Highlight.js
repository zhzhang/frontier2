import React, { Component } from "react";

import "./Highlight.module.css";

class Highlight extends Component {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      isScrolledTo,
    } = this.props;

    const { rects } = position;

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className="Highlight__part"
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
