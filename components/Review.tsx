import AuthorPopover from "@/components/AuthorPopover";
import Thread from "@/components/Thread";
import Box from "@mui/material/Box";
import gql from "graphql-tag";
import { updateArticleAndScroll } from "./article/vars";
import Markdown from "./Markdown";
import ProfilePicturePopover from "./ProfilePicturePopover";

export const REVIEW_CARD_FIELDS = gql`
  fragment ReviewCardFields on Review {
    id
    author {
      id
      name
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
        </Box>
      </Box>
      {renderThread && <Thread headId={review.id} />}
    </Box>
  );
}
