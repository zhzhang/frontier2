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
import InputBase from "@mui/material/InputBase";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState } from "react";

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
        sx={{
          color: "gray",
          m: 0.5,
          height: 22,
          width: 22,
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
          p: 1,
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
      sx={{
        borderTop: "1px solid rgba(0, 0, 0, 0.23)",
        p: 0.5,
        display: "flex",
      }}
    >
      <Box
        sx={{
          borderRight: "1px solid rgba(0, 0, 0, 0.23)",
          mr: 0.5,
          width: 20,
        }}
        onClick={() =>
          updateArticleAndScroll({
            highlights,
            highlight,
          })
        }
      >
        <Typography sx={{ fontSize: 12 }}>{highlight.id} </Typography>
      </Box>
      <Typography
        onClick={() =>
          updateArticleAndScroll({
            highlights,
            highlight,
          })
        }
        sx={{
          flex: 1,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: 12,
        }}
      >
        {highlight.text}
      </Typography>
      <CloseRounded
        sx={{ height: 18, width: 18 }}
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
  placeholder = null,
  focused = false,
  onFocus = null,
  onBlur = null,
  sx = {},
  highlights = [],
  deleteHighlight = (id: number) => {},
  updateArticleAndScroll = () => {},
}) {
  const [previewOpen, toggleShowPreview] = useState(false);
  const [hover, setHover] = useState(false);
  let style = {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    m: "1px",
  };
  if (focused || hover) {
    style.border = "2px solid rgba(0, 0, 0, 0.23)";
    style.m = 0;
  }
  if (focused) {
    style.borderColor = "primary.main";
  } else if (hover) {
    style.borderColor = "black";
  }
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      key={key}
      sx={{
        ...sx,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FormControl
        fullWidth
        onFocus={() => {
          onFocus && onFocus();
        }}
        onBlur={() => {
          onBlur && onBlur();
        }}
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
        }}
        focused={false}
      >
        <InputBase
          multiline
          required
          placeholder={placeholder}
          value={body}
          onMouseEnter={null}
          onMouseLeave={null}
          maxRows={20}
          sx={{ p: 1.5 }}
          onChange={({ target }) => onChange(target.value)}
        />
      </FormControl>
      <Box sx={{ display: "flex", pr: 0.5 }}>
        {STYLES.map((style) => (
          <StyleButton {...style} key={style.style} />
        ))}
        {articleMode && <StyleButton {...HIGHLIGHT_STYLE} />}
        <Button
          sx={{
            marginLeft: "auto",
            p: 0,
          }}
          onClick={() => toggleShowPreview(!previewOpen)}
          size="small"
          fullWidth={false}
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
