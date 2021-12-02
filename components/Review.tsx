import AuthorPopover from "@/components/AuthorPopover";
import Thread from "@/components/Thread";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
      ...UserCardFields
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
  const { highlights, body } = review;
  return (
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ marginRight: 1 }}>
          <ProfilePicturePopover user={review.author} />
        </Box>
        <Box>
          <AuthorPopover user={review.author} />
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
                threadReplies.set(review.id, {
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
      {renderThread && <Thread headId={review.id} />}
    </Box>
  );
}
