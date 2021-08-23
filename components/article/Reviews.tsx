import Spinner from "@/components/CenteredSpinner";
import Review from "@/components/Review";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";

const ReviewsQuery = gql`
  query ReviewsQuery($where: ReviewWhereInput!) {
    reviews(where: $where) {
      id
      author {
        id
        name
      }
      body
      highlights
      reviewNumber
      rating
      venue {
        id
        logoRef
        abbreviation
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
    variables: { where: { articleId: { equals: articleId } } },
  });
  const [body, setBody] = useState("Try me!");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [value, setValue] = useState("");
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
        <div className="pb-2" key={review.id}>
          <Review
            review={review}
            editing={false}
            startOpen={true}
            updateArticleAndScroll={updateArticleAndScroll}
            articleMode
          />
        </div>
      ))}
    </>
  );
};

export default Reviews;
