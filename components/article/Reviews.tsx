import gql from "graphql-tag";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useState } from "react";
import Review from "../Review";

// For demo only.
import Markdown from "../Markdown";

const ReviewsQuery = gql`
  query ReviewsQuery($articleId: String!) {
    reviews(articleId: $articleId) {
      id
      author {
        name
      }
      body
      reviewNumber
      rating
      canAccess
      organization {
        id
        logoRef
        abbreviation
      }
      threadMessages {
        id
        author {
          id
          name
        }
        body
        createdAt
      }
    }
  }
`;

const Reviews = ({ articleId, highlights }) => {
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: { articleId },
  });
  const [body, setBody] = useState("Try me!");
  const [previewOpen, setPreviewOpen] = useState(true);
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const { reviews } = data;
  return (
    <>
      {reviews.map((review) => (
        <div style={{ paddingBottom: 10 }} key={review.id}>
          <Review review={review} editing={false} startOpen={true} />
        </div>
      ))}
      <Form.Control
        as="textarea"
        rows={4}
        value={body}
        onChange={({ target: { value } }) => {
          setBody(value);
        }}
      />
      {highlights.map((highlight) => (
        <div>{highlight.id}</div>
      ))}
      <Accordion className="mb-2" activeKey={previewOpen ? "0" : null}>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            Preview
            <span className="float-right">
              {previewOpen ? <ChevronUp /> : <ChevronDown />}
            </span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <div className="p-2">
              <Markdown>{body}</Markdown>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
};

export default Reviews;
