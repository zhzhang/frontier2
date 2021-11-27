import DraftEditor from "@draft-js-plugins/editor";
import Code from "@mui/icons-material/Code";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import FormatQuote from "@mui/icons-material/FormatQuote";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import Functions from "@mui/icons-material/Functions";
import Title from "@mui/icons-material/Title";
import { convertFromRaw, convertToRaw, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import React from "react";
import styles from "./Editor.module.css";
import createMathPlugin from "./math";
import createReferencePlugin from "./reference";

export function newEditorState(): EditorState {
  return EditorState.createEmpty();
}

export function serialize(editorState: EditorState): String {
  return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
}

export function deserialize(serialized: string): EditorState {
  return EditorState.createWithContent(convertFromRaw(JSON.parse(serialized)));
}

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inter", "Menlo", "Consolas", monospace',
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
  { icon: <Functions />, style: "math" },
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
const referencePlugin = createReferencePlugin();
const plugins = [mathjaxPlugin, referencePlugin];

export default function Editor({
  onChange,
  editorState,
  placeholder = "",
  editing = false,
  ...props
}) {
  const toggleBlockType = (blockType) =>
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  const toggleInlineStyle = (inlineStyle) =>
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));

  const Controls = () => (
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
  );

  return (
    <div>
      {editing && <Controls />}
      <DraftEditor
        editorState={editorState}
        onChange={onChange}
        readOnly={!editing}
        plugins={plugins}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
