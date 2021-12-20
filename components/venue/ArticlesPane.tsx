import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";

const AcceptedArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query AcceptedArticlesQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      id
      body
      article {
        ...ArticleCardFields
      }
      authorIdentity {
        user {
          id
          name
        }
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
          {
            released: {
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
  const decisions = data.threadMessages;
  let interiorComponent;
  if (decisions.length === 0) {
    interiorComponent = (
      <Typography>This venue has not accepted any articles.</Typography>
    );
  } else {
    interiorComponent = decisions.map((decision) => (
      <ArticleCard key={decision.id} article={decision.article} />
    ));
  }

  return <Box sx={{ mt: 1 }}>{interiorComponent}</Box>;
}

export default ArticlesPane;
