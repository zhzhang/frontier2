import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import gql from "graphql-tag";

const AcceptedArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query AcceptedArticlesQuery($where: DecisionWhereInput!) {
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

function ArticlesPane({ id }) {
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
      <ArticleCard key={decision.id} article={decision.article} />
    ));
  }

  return <Box sx={{ mt: 1 }}>{interiorComponent}</Box>;
}

export default ArticlesPane;
