import Thread from "@/components/Thread";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Editor, { deserialize } from "./editor/Editor";

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

const Review = ({
  review,
  editing,
  startOpen,
  updateArticleAndScroll,
  articleMode,
}) => {
  const { highlights } = review;
  const [body, setBody] = useState(review.body);
  const [updateReview, { loading, error, data }] =
    useMutation(UpdateReviewMutation);
  const [open, setOpen] = useState(startOpen && review.canAccess);
  return (
    <div>
      {`Reviewer ${review.reviewNumber} - ${review.organization.abbreviation}`}
      {body && <Editor editorState={deserialize(body)} />}
      <Rating rating={review.rating} />
      <Thread headId={review.id} />
    </div>
  );
};

export default Review;
