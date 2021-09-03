import ArticleCard from "@/components/ArticleCard";
import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import React from "react";

const GetArticlesQuery = gql`
  query GetArticlesQuery {
    articles {
      id
      title
      authors {
        id
        name
      }
      versions {
        abstract
        ref
        createdAt
      }
      acceptedVenues {
        id
        name
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    article: {
      marginBottom: theme.spacing(1),
    },
  })
);

function Articles() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GetArticlesQuery, {});
  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  if (error) {
    return <ErrorPage> {"Error loading articles."}</ErrorPage>;
  }
  return (
    <Layout>
      {data.articles.map((article) => (
        <ArticleCard article={article} className={classes.article} />
      ))}
    </Layout>
  );
}

export default withApollo(Articles);
