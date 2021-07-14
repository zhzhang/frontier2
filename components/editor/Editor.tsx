import DraftEditor from "@draft-js-plugins/editor";
import Code from "@material-ui/icons/Code";
import FormatBold from "@material-ui/icons/FormatBold";
import FormatItalic from "@material-ui/icons/FormatItalic";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import FormatQuote from "@material-ui/icons/FormatQuote";
import FormatUnderlined from "@material-ui/icons/FormatUnderlined";
import Title from "@material-ui/icons/Title";
import { convertToRaw, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import React, { useState } from "react";
import styles from "./Editor.module.css";
import createMathPlugin from "./math";

export function newEditorState(): EditorState {
  return EditorState.createEmpty();
}

export function serialize(editorState: EditorState): String {
  return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
}

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
  { icon: <Title />, style: "header-one" },
  { icon: <FormatQuote />, style: "blockquote" },
  { icon: <FormatListBulleted />, style: "unordered-list-item" },
  { icon: <FormatListNumbered />, style: "ordered-list-item" },
  { icon: <Code />, style: "code-block" },
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
  { icon: <FormatBold />, style: "BOLD" },
  { icon: <FormatItalic />, style: "ITALIC" },
  { icon: <FormatUnderlined />, style: "UNDERLINE" },
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

function Editor({ placeholder, onChange, editorState }) {
  const [borderStyle, setBorderStyle] = useState(styles.RichEditorBorder);

  const toggleBlockType = (blockType) =>
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  const toggleInlineStyle = (inlineStyle) =>
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  console.log(serialize(editorState));

  return (
    <div className={`${styles.RichEditorRoot} ${borderStyle}`}>
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
        onChange={onChange}
        plugins={plugins}
        placeholder={placeholder}
        onFocus={() => setBorderStyle(styles.RichEditorFocusBorder)}
        onBlur={() => setBorderStyle(styles.RichEditorBorder)}
      />
    </div>
  );
}

export default Editor;
