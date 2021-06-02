import React from "react";
import Spinner from "../components/CenteredSpinner";
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
      acceptedOrganizations {
        name
      }
    }
  }
`;

function Articles(props) {
  const { loading, error, data } = useQuery(GetArticlesQuery, {});
  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  return (
    <Layout>
      <Container fluid>
        {data.articles.map((article) => (
          <div className="mt-3">
            <ArticleCard article={article} />
          </div>
        ))}
      </Container>
    </Layout>
  );
}

export default withApollo(Articles);
