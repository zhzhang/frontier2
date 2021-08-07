import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import Markdown from "./Markdown";

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
  },
}));

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
      <TextField
        multiline
        required
        fullWidth
        variant="outlined"
        label={label}
        placeholder={placeholder}
        value={body}
        onChange={({ target }) => onChange(target.value)}
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
