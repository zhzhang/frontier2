import Review from "@/components/Review";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const ReviewQuery = gql`
  query ReviewQuery($reviewId: String!) {
    review(reviewId: $reviewId) {
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

const LinkedReview = ({
  highlights,
  updateArticleAndScroll,
  articleVersion,
  reviewId,
}) => {
  const { loading, error, data } = useQuery(ReviewQuery, {
    variables: { reviewId },
  });
  const router = useRouter();
  const [body, setBody] = useState("Try me!");
  const [previewOpen, setPreviewOpen] = useState(true);
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const { review } = data;
  return (
    <div style={{ paddingBottom: 10 }} key={review.id}>
      <a href={`/article/${router.query.id}`}>Show all reviews</a>
      <Review
        review={review}
        editing={false}
        startOpen={true}
        updateArticleAndScroll={updateArticleAndScroll}
        articleMode
      />
    </div>
  );
};

export default LinkedReview;
