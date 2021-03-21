import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Markdown from "./Markdown";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { ChevronUp, ChevronDown, PersonCircle } from "react-bootstrap-icons";

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
  return (
    <Accordion activeKey={review.canAccess && open ? "0" : null}>
      <Card style={{ border: "none" }}>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          onClick={() => setOpen(!open)}
          style={{
            border: "1px solid rgba(0,0,0,.125)",
            borderRadius: ".25rem",
          }}
        >
          {`Reviewer ${review.reviewNumber} - ${review.organization.abbreviation}`}
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
            <div
              style={{
                border: "1px solid rgba(0,0,0,.125)",
                borderBottomLeftRadius: ".25rem",
                borderBottomRightRadius: ".25rem",
              }}
            >
              <Markdown>{body}</Markdown>
            </div>
            {threadMessages
              ? threadMessages.map((message) => (
                  <div style={{ display: "flex", marginTop: "10px" }}>
                    <div
                      style={{
                        width: "10px",
                        borderLeft: "1px solid rgba(0,0,0,.125)",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "1px solid rgba(0,0,0,.125)",
                        borderRadius: ".25rem",
                      }}
                    >
                      <div>{message.author.name}</div>
                      <Markdown>{message.body}</Markdown>
                    </div>
                  </div>
                ))
              : null}
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
