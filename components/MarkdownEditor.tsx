import Markdown from "@/components/Markdown";
import CloseRounded from "@mui/icons-material/CloseRounded";
import Code from "@mui/icons-material/Code";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import FormatQuote from "@mui/icons-material/FormatQuote";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import Functions from "@mui/icons-material/Functions";
import RateReview from "@mui/icons-material/RateReview";
import Title from "@mui/icons-material/Title";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Popover from "@mui/material/Popover";
import { makeStyles, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
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
  showPreviewButton: {
    marginLeft: "auto",
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

function Highlight({
  highlight,
  highlights,
  deleteHighlight,
  updateArticleAndScroll,
}) {
  return (
    <Box
      onClick={() =>
        updateArticleAndScroll({
          highlights,
          highlight,
        })
      }
      sx={{
        borderTop: "1px solid rgba(0, 0, 0, 0.23)",
        padding: 1,
        display: "flex",
        fontSize: 14,
      }}
    >
      <Box>{highlight.id}</Box>
      <Box
        sx={{
          flex: 1,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {highlight.text}
      </Box>
      <CloseRounded
        sx={{ height: 21, width: 21 }}
        onClick={() => deleteHighlight(highlight.id)}
      />
    </Box>
  );
}

export default function MarkdownEditor({
  body,
  onChange,
  articleMode = false,
  key = null,
  label = null,
  placeholder = null,
  onFocus = null,
  onBlur = null,
  highlights = [],
  deleteHighlight = (id: number) => {},
  updateArticleAndScroll = () => {},
}) {
  const classes = useStyles();
  const [previewOpen, toggleShowPreview] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      key={key}
      sx={
        focused
          ? {
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: "4px",
            }
          : {
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: "4px",
            }
      }
    >
      <FormControl
        fullWidth
        onFocus={() => {
          setFocused(true);
          onFocus && onFocus();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur && onBlur();
        }}
      >
        <Input
          multiline
          required
          placeholder={placeholder}
          value={body}
          maxRows={20}
          sx={{ padding: 2 }}
          onChange={({ target }) => onChange(target.value)}
        />
      </FormControl>
      <Box sx={{ display: "flex", padding: 0.5 }}>
        {STYLES.map((style) => (
          <StyleButton {...style} key={style.style} />
        ))}
        {articleMode && <StyleButton {...HIGHLIGHT_STYLE} />}
        <Button
          className={classes.showPreviewButton}
          onClick={() => toggleShowPreview(!previewOpen)}
          size="small"
          fullWidth={false}
          sx={{ flex: 1 }}
        >
          {previewOpen ? "Hide Preview" : "Show Preview"}
        </Button>
      </Box>
      {highlights.map((highlight) => (
        <Highlight
          key={highlight.id}
          highlight={highlight}
          highlights={highlights}
          updateArticleAndScroll={updateArticleAndScroll}
          deleteHighlight={deleteHighlight}
        />
      ))}
      {previewOpen && (
        <Box
          sx={{
            borderTop: "1px solid rgba(0, 0, 0, 0.23)",
            padding: 2,
          }}
        >
          <Markdown
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {body}
          </Markdown>
        </Box>
      )}
    </Box>
  );
}
