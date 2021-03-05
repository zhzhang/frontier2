import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { ChevronUp, ChevronDown, PersonCircle } from "react-bootstrap-icons";
import organizations from "../pages/organizations";

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

function getBadge(rating) {
  switch (rating) {
    case 0:
      return <Badge variant="danger">Strong Reject</Badge>;
    case 1:
      return <Badge variant="danger">Reject</Badge>;
    case 2:
      return <Badge variant="success">Accept</Badge>;
    case 3:
      return <Badge variant="success">Strong Accept</Badge>;
  }
}

const Review = ({ review, editing, startOpen }) => {
  const [body, setBody] = useState(review.body);
  const [updateReview, { loading, error, data }] = useMutation(
    UpdateReviewMutation
  );
  const [open, setOpen] = useState(startOpen);
  const { threadMessages } = review;
  console.log(threadMessages);
  return (
    <Accordion activeKey={review.canAccess && open ? "0" : null}>
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          onClick={() => setOpen(!open)}
        >
          <>
            {`Reviewer ${review.reviewNumber} - ${review.organization.abbreviation}`}
          </>
          <span style={{ float: "right" }}>
            {review.canAccess ? (
              <>
                {getBadge(review.rating)}{" "}
                {open ? <ChevronUp /> : <ChevronDown />}
              </>
            ) : (
              <Badge variant="secondary">Private</Badge>
            )}
          </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <>
            <Quill
              value={body}
              modules={{
                toolbar: false,
              }}
              readOnly={!editing}
              onChange={setBody}
            />
            {threadMessages.map((message) => (
              <div>
                <Quill
                  value={message.body}
                  modules={{
                    toolbar: false,
                  }}
                  readOnly={!editing}
                  onChange={setBody}
                />
              </div>
            ))}
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
          </>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default withApollo(Review);
