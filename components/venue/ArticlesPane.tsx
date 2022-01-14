import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";

const AcceptedArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query AcceptedArticlesQuery($input: VenueArticlesInput!) {
    venueArticles(input: $input) {
      ...ArticleCardFields
    }
  }
`;

function ArticlesPane({ id }) {
  const { loading, error, data } = useQuery(AcceptedArticlesQuery, {
    variables: {
      input: {
        venueId: id,
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
  const articles = data.venueArticles;
  let interiorComponent;
  if (articles.length === 0) {
    interiorComponent = (
      <Typography>This venue has not accepted any articles.</Typography>
    );
  } else {
    interiorComponent = articles.map((article) => (
      <ArticleCard key={article.id} article={article} />
    ));
  }

  return <Box sx={{ mt: 1 }}>{interiorComponent}</Box>;
}

export default ArticlesPane;
