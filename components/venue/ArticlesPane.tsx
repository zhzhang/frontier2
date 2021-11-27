import AcceptedArticleCard from "@/components/AcceptedArticleCard";
import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const AcceptedArticlesQuery = gql`
  query AcceptedArticlesQuery($where: DecisionWhereInput!) {
    ${ARTICLE_CARD_FIELDS}
    decisions(where: $where) {
      id
      body
      article {
        ...ArticleCardFields
      }
      author {
        id
        name
      }
    }
  }
`;

const ArticlesPane = ({ id }) => {
  const { loading, error, data } = useQuery(AcceptedArticlesQuery, {
    variables: {
      where: {
        AND: [
          {
            venueId: {
              equals: id,
            },
          },
          {
            decision: {
              equals: true,
            },
          },
        ],
      },
    },
  });
  if (loading) {
    return <Spinner />;
  } else if (error) {
    return (
      <Error sx={{ mt: 1 }}>
        There was a problem loading this venue's accepted articles.
      </Error>
    );
  }
  const { decisions } = data;
  let interiorComponent;
  if (decisions.length === 0) {
    interiorComponent = "No accepted articles yet.";
  } else {
    interiorComponent = decisions.map((decision) => (
      <AcceptedArticleCard key={decision.id} decision={decision} />
    ));
  }

  return <div className={classes.body}>{interiorComponent}</div>;
};

export default ArticlesPane;
