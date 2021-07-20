import "draft-js/dist/Draft.css";
import React, { useState } from "react";
import Editor from "./Editor";
import styles from "./Editor.module.css";

export default function InputEditor(props) {
  const [borderStyle, setBorderStyle] = useState(styles.RichEditorBorder);

  return (
    <div className={`${styles.RichEditorRoot} ${borderStyle}`}>
      <Editor
        onFocus={() => setBorderStyle(styles.RichEditorFocusBorder)}
        onBlur={() => setBorderStyle(styles.RichEditorBorder)}
        {...props}
      />
    </div>
  );
}
