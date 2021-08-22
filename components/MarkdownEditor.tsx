import Markdown from "@/components/Markdown";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Code from "@material-ui/icons/Code";
import FormatBold from "@material-ui/icons/FormatBold";
import FormatItalic from "@material-ui/icons/FormatItalic";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import FormatQuote from "@material-ui/icons/FormatQuote";
import FormatUnderlined from "@material-ui/icons/FormatUnderlined";
import Functions from "@material-ui/icons/Functions";
import Title from "@material-ui/icons/Title";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  formField: {
    marginTop: theme.spacing(2),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  preview: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    padding: theme.spacing(1),
    minHeight: theme.spacing(8),
  },
}));

const BLOCK_TYPES = [
  { icon: <Title />, style: "header-one" },
  { icon: <FormatQuote />, style: "blockquote" },
  { icon: <FormatListBulleted />, style: "unordered-list-item" },
  { icon: <FormatListNumbered />, style: "ordered-list-item" },
  { icon: <Code />, style: "code-block" },
  { icon: <Functions />, style: "math" },
];

const INLINE_STYLES = [
  { icon: <FormatBold />, style: "BOLD" },
  { icon: <FormatItalic />, style: "ITALIC" },
  { icon: <FormatUnderlined />, style: "UNDERLINE" },
];

export default function MarkdownEditor({
  body,
  onChange,
  label = null,
  placeholder = null,
}) {
  const classes = useStyles();
  const [previewOpen, toggleShowPreview] = useState(false);
  return (
    <>
      {BLOCK_TYPES.map((o) => o.icon)}
      <TextField
        multiline
        required
        fullWidth
        variant="outlined"
        label={label}
        placeholder={placeholder}
        value={body}
        onChange={({ target }) => onChange(target.value)}
        rows={4}
      />
      <Button onClick={() => toggleShowPreview(!previewOpen)}>
        {previewOpen ? "Hide Preview" : "Show Preview"}
      </Button>
      {previewOpen && (
        <Paper className={classes.preview} elevation={0}>
          <Markdown>{body}</Markdown>
        </Paper>
      )}
    </>
  );
}
