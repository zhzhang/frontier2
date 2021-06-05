import DecisionCard from "@/components/DecisionCard";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const DecisionsQuery = gql`
  query DecisionsQuery($articleId: String!) {
    decisions(articleId: $articleId) {
      id
      author {
        name
      }
      body
      decision
      organization {
        id
        logoRef
        abbreviation
      }
      citedReviews {
        author {
          name
        }
        reviewNumber
        rating
        canAccess
        organization {
          logoRef
          abbreviation
        }
      }
    }
  }
`;

const Decisions = ({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) => {
  const { loading, error, data } = useQuery(DecisionsQuery, {
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
  const { decisions } = data;
  return (
    <>
      {decisions.map((decision) => (
        <div style={{ paddingBottom: 10 }} key={decision.id}>
          <DecisionCard
            decision={decision}
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

export default Decisions;
