import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

const GetArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query GetArticlesQuery {
    articles {
      ...ArticleCardFields
    }
  }
`;

function Articles() {
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
        <ArticleCard article={article} sx={{ marginBottom: 2 }} />
      ))}
    </Layout>
  );
}

export default withApollo(Articles);
