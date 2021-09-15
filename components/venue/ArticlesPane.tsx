import AcceptedArticleCard from "@/components/AcceptedArticleCard";
import { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { useQuery } from "@apollo/react-hooks";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      marginTop: theme.spacing(1),
    },
  })
);

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
  const classes = useStyles();
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
      <div className={classes.body}>
        <Error>
          There was a problem loading this venue's accepted articles.
        </Error>
      </div>
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
