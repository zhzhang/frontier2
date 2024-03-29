import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import TimeAgo from "@/components/TimeAgo";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReplyButton } from "../Thread";
import { updateArticleAndScroll } from "./vars";

export default function Comment({
  message,
  articleId,
  headId = null,
  sx = null,
}) {
  const typographyProps = {
    component: "span",
    sx: {
      fontSize: "0.8rem",
      color: "gray",
    },
  };
  return (
    <Box sx={{ ...sx, mt: 2 }}>
      <Box
        key={message.id}
        sx={{
          display: "flex",
        }}
      >
        <ProfilePicturePopover user={message.author} sx={{ mr: 1 }} />
        <Box>
          <AuthorPopover author={message.author} />
          <Typography {...typographyProps}>{" • "}</Typography>
          <TimeAgo {...typographyProps} time={message.publishTimestamp} />
          <Markdown
            highlights={message.highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {message.body}
          </Markdown>
          <ReplyButton headId={headId || message.id} articleId={articleId} />
        </Box>
      </Box>
    </Box>
  );
}
