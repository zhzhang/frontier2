import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import gql from "graphql-tag";
import React from "react";

const GetArticlesQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  query GetArticlesQuery {
    feedArticles {
      ...ArticleCardFields
    }
  }
`;

function Articles() {
  const { loading, error, data } = useQuery(GetArticlesQuery, {});
  console.log(data);
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
    <Layout sx={{ maxWidth: 1000 }}>
      <Input
        fullWidth
        disabled
        sx={{ mb: 2 }}
        placeholder="Article search coming soon!"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      {data.feedArticles.map((article) => (
        <ArticleCard article={article} sx={{ mb: 2 }} />
      ))}
    </Layout>
  );
}

export default withApollo(Articles);
