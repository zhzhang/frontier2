import Markdown from "@/components/Markdown";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Code from "@material-ui/icons/Code";
import FormatBold from "@material-ui/icons/FormatBold";
import FormatItalic from "@material-ui/icons/FormatItalic";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import FormatQuote from "@material-ui/icons/FormatQuote";
import FormatUnderlined from "@material-ui/icons/FormatUnderlined";
import Functions from "@material-ui/icons/Functions";
import RateReview from "@material-ui/icons/RateReview";
import Title from "@material-ui/icons/Title";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  icon: {
    color: "gray",
    margin: theme.spacing(0.5),
  },
  formField: {
    marginTop: theme.spacing(2),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  utils: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
    borderLeft: "1px solid rgba(0, 0, 0, 0.23)",
    borderRight: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    display: "flex",
    padding: theme.spacing(0.5),
  },
  showPreviewButton: {
    marginLeft: "auto",
  },
  preview: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
    borderLeft: "1px solid rgba(0, 0, 0, 0.23)",
    borderRight: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    padding: theme.spacing(1),
    minHeight: theme.spacing(8),
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const STYLES = [
  { Icon: Title, style: "Headers", example: "### Header Level 3" },
  {
    Icon: FormatQuote,
    style: "Quotes",
    example: "`Inline quote` and\n```Block quote```",
  },
  {
    Icon: FormatListBulleted,
    style: "Bulleted List",
    example: "- List item one.\n- List item two.",
  },
  {
    Icon: FormatListNumbered,
    style: "Numbered List",
    example: "1. List item one.\n2. List item two.",
  },
  {
    Icon: Code,
    style: "Code",
    example: "`Inline code` and\n```Block code```",
  },
  {
    Icon: Functions,
    style: "Math",
    example: "$$x = y$$\nor block math\n$$\nx = y\n$$",
  },
  { Icon: FormatBold, style: "Bold", example: "**Bold**" },
  { Icon: FormatItalic, style: "Italic", example: "*Italic*" },
  { Icon: FormatUnderlined, style: "Underline", example: "Hello" },
];
const HIGHLIGHT_STYLE = {
  Icon: RateReview,
  style: "Highlight",
  example: "Hello",
};

function StyleButton({ Icon, style, example }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <>
      <Icon
        className={classes.icon}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="h6">{style}</Typography>
        {example}
        <Markdown>{example}</Markdown>
      </Popover>
    </>
  );
}

export default function MarkdownEditor({
  body,
  onChange,
  articleMode = false,
  label = null,
  placeholder = null,
  onFocus = null,
  highlights = [],
  updateArticleAndScroll = () => {},
}) {
  const classes = useStyles();
  const [previewOpen, toggleShowPreview] = useState(false);
  return (
    <div>
      <TextField
        multiline
        required
        fullWidth
        variant="outlined"
        label={label}
        placeholder={placeholder}
        value={body}
        onChange={({ target }) => onChange(target.value)}
        onFocus={onFocus}
        rowsMax={20}
      />
      <div className={classes.utils}>
        {STYLES.map((style) => (
          <StyleButton {...style} key={style.style} />
        ))}
        {articleMode && <StyleButton {...HIGHLIGHT_STYLE} />}
        <Button
          className={classes.showPreviewButton}
          onClick={() => toggleShowPreview(!previewOpen)}
          size="small"
        >
          {previewOpen ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          onClick={() =>
            updateArticleAndScroll(
              highlight.articleVersion,
              highlights,
              highlight
            )
          }
        >
          {`${highlight.id}) ${highlight.text.substring(0, 60)}...`}
        </div>
      ))}
      {previewOpen && (
        <Paper className={classes.preview} elevation={0}>
          <Markdown
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {body}
          </Markdown>
        </Paper>
      )}
    </div>
  );
}
