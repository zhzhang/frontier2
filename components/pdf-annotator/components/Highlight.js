import React, { Component } from "react";

import styles from "./Highlight.module.css";

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
        className={`${styles.Highlight} ${
          isScrolledTo ? styles.HighlightScrolledTo : ""
        }`}
      >
        <div className={styles.HighlightParts}>
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className={styles.HighlightPart}
              id={index}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
