import Spinner from "@/components/CenteredSpinner";
import Review from "@/components/Review";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";

const ReviewsQuery = gql`
  query ReviewsQuery($articleId: String!) {
    reviews(articleId: $articleId) {
      id
      author {
        name
      }
      body
      highlights
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
        highlights
        createdAt
      }
    }
  }
`;

const Reviews = ({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) => {
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: { articleId },
  });
  const [body, setBody] = useState("Try me!");
  const [previewOpen, setPreviewOpen] = useState(true);
  if (loading) {
    return (
      <div className="mt-3">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const { reviews } = data;
  return (
    <>
      {reviews.map((review) => (
        <div style={{ paddingBottom: 10 }} key={review.id}>
          <Review
            review={review}
            editing={false}
            startOpen={true}
            updateArticleAndScroll={updateArticleAndScroll}
            articleMode
          />
        </div>
      ))}
      {/* <Form.Control
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
              <Markdown
                highlights={highlights}
                updateArticleAndScroll={updateArticleAndScroll}
                articleVersion={articleVersion}
              >
                {body}
              </Markdown>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion> */}
    </>
  );
};

export default Reviews;
