import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import Box from "@mui/material/Box";
import { updateArticleAndScroll } from "./vars";

export default function Comment({ comment }) {
  const { highlights } = comment;
  const { body } = comment;
  return (
    <Box
      sx={{
        display: "flex",
        mt: 2,
      }}
    >
      <Box
        sx={{
          mr: 1,
        }}
      >
        <ProfilePicturePopover identity={comment.author} />
      </Box>
      <Box>
        <AuthorPopover identity={comment.author} />
        <Markdown
          highlights={highlights}
          updateArticleAndScroll={updateArticleAndScroll}
        >
          {body}
        </Markdown>
      </Box>
    </Box>
  );
}
