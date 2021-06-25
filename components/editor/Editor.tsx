import DraftEditor from "@draft-js-plugins/editor";
import { EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import React, { useState } from "react";
import {
  BlockquoteLeft,
  CodeSlash,
  ListOl,
  ListUl,
  TypeBold,
  TypeH1,
  TypeH2,
  TypeItalic,
  TypeUnderline,
} from "react-bootstrap-icons";
import styles from "./Editor.module.css";
import createMathPlugin from "./math";

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const StyleButton = ({ icon, style, active, onToggle }) => {
  let className = styles.RichEditorStyleButton;
  if (active) {
    className = styles.RichEditorActiveButton;
  }
  return (
    <span
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
    >
      {icon}
    </span>
  );
};

const BLOCK_TYPES = [
  { icon: <TypeH1 />, style: "header-one" },
  { icon: <TypeH2 />, style: "header-two" },
  { icon: <BlockquoteLeft />, style: "blockquote" },
  { icon: <ListUl />, style: "unordered-list-item" },
  { icon: <ListOl />, style: "ordered-list-item" },
  { icon: <CodeSlash />, style: "code-block" },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <>
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </>
  );
};

const INLINE_STYLES = [
  { icon: <TypeBold />, style: "BOLD" },
  { icon: <TypeItalic />, style: "ITALIC" },
  { icon: <TypeUnderline />, style: "UNDERLINE" },
];

const InlineStyleControls = ({ onToggle, editorState }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          icon={type.icon}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </>
  );
};

const mathjaxPlugin = createMathPlugin();
const plugins = [mathjaxPlugin];

function Editor({ placeholder }) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const toggleBlockType = (blockType) =>
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  const toggleInlineStyle = (inlineStyle) =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));

  return (
    <div className={styles.RichEditorRoot}>
      <div className={styles.RichEditorControls}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </div>
      <DraftEditor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Editor;
