import React, { Component } from "react";

import "./Tip.module.css";

class Tip extends Component {
  render() {
    const { onConfirm, onOpen } = this.props;

    return (
      <div className="Tip">
        <div className="Tip__compact" onClick={onConfirm}>
          Add reference
        </div>
      </div>
    );
  }
}

export default Tip;
