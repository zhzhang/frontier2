import AuthorPopover from "@/components/AuthorPopover";
import TimeAgo from "@/components/TimeAgo";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import ReplyButton from "./article/ReplyButton";
import { updateArticleAndScroll } from "./article/vars";
import Markdown from "./Markdown";
import ProfilePicturePopover from "./ProfilePicturePopover";
import { USER_CARD_FIELDS } from "./UserCard";

export const REVIEW_CARD_FIELDS = gql`
  ${USER_CARD_FIELDS}
  fragment ReviewCardFields on Review {
    id
    author {
      context
      number
      user {
        ...UserCardFields
      }
    }
    body
    highlights
    rating
    published
    publishTimestamp
  }
`;

function Rating({ rating }) {
  switch (rating) {
    case 0:
      return <span>Strong Reject</span>;
    case 1:
      return <span>Reject</span>;
    case 2:
      return <span>Accept</span>;
    case 3:
      return <span>Strong Accept</span>;
  }
}

export default function Review({ review }) {
  const { id, author, highlights, body, publishTimestamp } = review;
  const typographyProps = {
    component: "span",
    sx: {
      fontSize: "0.8rem",
      color: "gray",
    },
  };
  return (
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ marginRight: 1 }}>
          <ProfilePicturePopover identity={author} />
        </Box>
        <Box>
          <AuthorPopover identity={author} />
          <Typography {...typographyProps}>{" • "}</Typography>
          <TimeAgo {...typographyProps} time={publishTimestamp} />
          <Markdown
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {body}
          </Markdown>
          <ReplyButton headId={id} />
        </Box>
      </Box>
    </Box>
  );
}
