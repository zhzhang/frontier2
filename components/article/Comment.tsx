import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import Thread from "@/components/Thread";
import { useMutation } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";
import { useState } from "react";

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

export default function Comment({
  comment,
  editing,
  startOpen,
  updateArticleAndScroll,
  articleMode,
}) {
  const { highlights } = comment;
  const [body, setBody] = useState(comment.body);
  const [updateReview, { loading, error, data }] =
    useMutation(UpdateReviewMutation);
  return (
    <>
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
          <ProfilePicturePopover user={comment.author} />
        </Box>
        <Box>
          <AuthorPopover user={comment.author} />
          <Markdown
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {body}
          </Markdown>
        </Box>
      </Box>
      <Thread headId={comment.id} />
    </>
  );
}
