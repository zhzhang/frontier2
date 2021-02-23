import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
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

const Review = ({ review, editing }) => {
  const [body, setBody] = useState(review.body);
  const [updateReview, { loading, error, data }] = useMutation(
    UpdateReviewMutation
  );
  console.log(review);
  return (
    <>
      <Quill
        value={body}
        modules={{ toolbar: editing }}
        readOnly={!editing}
        onChange={setBody}
      />
      {editing ? (
        <>
          <Button
            onClick={() =>
              updateReview({
                variables: {
                  id: review.id,
                  body,
                  rating: review.rating,
                  published: review.published,
                },
              })
            }
          >
            Save
          </Button>
          <Button
            onClick={() =>
              updateReview({
                variables: {
                  id: review.id,
                  body,
                  rating: review.rating,
                  published: true,
                },
              })
            }
          >
            Publish
          </Button>
        </>
      ) : null}
      {`Rating: ${review.rating}`}
    </>
  );
};

export default withApollo(Review);
