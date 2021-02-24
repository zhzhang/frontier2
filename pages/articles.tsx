import React from "react";
import Layout from "../components/Layout";
import ArticleCard from "../components/ArticleCard";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Container from "react-bootstrap/Container";

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
    }
  }
`;

function Articles(props) {
  const { loading, error, data } = useQuery(GetArticlesQuery, {});
  console.log(data);
  if (loading) {
    return "Loading...";
  }
  return (
    <Layout>
      <Container fluid style={{ paddingTop: 20 }}>
        {data.articles.map((article) => (
          <ArticleCard article={article} />
        ))}
      </Container>
    </Layout>
  );
}

export default withApollo(Articles);
