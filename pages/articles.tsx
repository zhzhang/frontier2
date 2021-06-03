import ArticleCard from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Layout from "@/components/Layout";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
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
        id
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
  if (error) {
    return (
      <Layout>
        <Container fluid className="mt-3">
          <Error header={"Error loading articles."} />
        </Container>
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
