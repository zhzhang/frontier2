import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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
  const { threadMessages } = review;
  return (
    <Accordion
      activeKey={review.canAccess && open ? "0" : null}
      className={open ? "review-accordion-open" : "review-accordion-closed"}
    >
      <Card style={{ border: "none" }}>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          onClick={() => setOpen(!open)}
        >
          {`Reviewer ${review.reviewNumber} - ${review.organization.abbreviation}`}
          <span style={{ float: "right" }}>
            {review.canAccess ? (
              <>{open ? <ChevronUp /> : <ChevronDown />}</>
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
              className="p-2"
            >
              <Markdown
                highlights={JSON.parse(highlights)}
                updateArticleAndScroll={updateArticleAndScroll}
                articleMode={articleMode}
              >
                {body}
              </Markdown>
            </div>
            {threadMessages
              ? threadMessages.map((message) => (
                  <div
                    style={{ display: "flex", marginTop: "10px" }}
                    key={message.id}
                  >
                    <div
                      style={{
                        width: "10px",
                        borderLeft: "1px solid rgba(0,0,0,.125)",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        border: "1px solid rgba(0,0,0,.125)",
                        borderRadius: ".25rem",
                      }}
                      className="p-2"
                    >
                      <div>
                        <AuthorPopover user={message.author} />
                      </div>
                      <Markdown
                        highlights={JSON.parse(message.highlights)}
                        updateArticleAndScroll={updateArticleAndScroll}
                        articleMode={articleMode}
                      >
                        {message.body}
                      </Markdown>
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

export default Review;
