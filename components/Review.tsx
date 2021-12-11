import AuthorPopover from "@/components/AuthorPopover";
import Thread from "@/components/Thread";
import TimeAgo from "@/components/TimeAgo";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { threadRepliesVar, updateArticleAndScroll } from "./article/vars";
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

const UpdateReviewMutation = gql`
  mutation UpdateReviewMutation(
    $id: String!
    $body: String!
    $rating: Int!
    $published: Boolean!
  ) {
    updateReview(id: $id, body: $body, rating: $rating, published: $published) {
      id
    }
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

export default function Review({ review, renderThread = true }) {
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
          <Button
            size="small"
            sx={{ p: 0, minWidth: 0 }}
            onClick={() => {
              const threadReplies = threadRepliesVar();
              threadRepliesVar(
                threadReplies.set(id, {
                  body: "",
                  highlights: [],
                })
              );
            }}
          >
            Reply
          </Button>
        </Box>
      </Box>
      {renderThread && <Thread headId={id} />}
    </Box>
  );
}
