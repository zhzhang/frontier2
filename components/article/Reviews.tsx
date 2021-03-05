import gql from "graphql-tag";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Review from "../Review";

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

export default ({ articleId }) => {
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: { articleId },
  });
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
    </>
  );
};
