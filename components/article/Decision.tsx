import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { ReplyButton } from "../Thread";
import TimeAgo from "../TimeAgo";
import { updateArticleAndScroll } from "./vars";

export default function Decision({ decision, articleId }) {
  const { id, body, highlights, authorIdentity, publishTimestamp } = decision;
  const accept = decision.decision;
  const typographyProps = {
    component: "span",
    sx: {
      fontSize: "0.8rem",
      color: "gray",
    },
  };
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
        <ProfilePicturePopover identity={authorIdentity} />
      </Box>
      <Box>
        <AuthorPopover identity={authorIdentity} />
        <Typography {...typographyProps}>{" • "}</Typography>
        <Chip
          variant="outlined"
          label={accept ? "Accept" : "Reject"}
          color={accept ? "success" : "error"}
          size="small"
          sx={{ height: 20 }}
        />
        <Typography {...typographyProps}>{" • "}</Typography>
        <TimeAgo {...typographyProps} time={publishTimestamp} />
        <Markdown
          highlights={highlights}
          updateArticleAndScroll={updateArticleAndScroll}
        >
          {body}
        </Markdown>
        <ReplyButton headId={id} articleId={articleId} />
      </Box>
    </Box>
  );
}
