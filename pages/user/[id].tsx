import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "react-datepicker/dist/react-datepicker.css";
import ArticleCard from "../../components/ArticleCard";
import Spinner from "../../components/CenteredSpinner";
import Layout from "../../components/Layout";
import { withApollo } from "../../lib/apollo";

const UserQuery = gql`
  query UserQuery($id: String!) {
    user(id: $id) {
      id
      name
      email
      articles {
        id
        authors {
          id
          name
        }
        title
        versions {
          id
          versionNumber
          abstract
        }
        acceptedOrganizations {
          id
          name
        }
      }
    }
  }
`;

const UserArticlesQuery = gql`
  query UserArticlesQuery($id: String!) {
    userArticles(id: $id) {
      id
      authors {
        id
        name
      }
      title
      versions {
        id
        versionNumber
        abstract
      }
      acceptedOrganizations {
        id
        name
      }
    }
  }
`;

function User() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id },
  });
  const articlesResult = useQuery(UserArticlesQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { name, email, articles } = data.user;
  const tabKey = "articles";

  return (
    <Layout>
      <h1>{name}</h1>
      <Tabs>
        <Tab eventKey="articles" title="Articles">
          <Container fluid style={{ margin: 10 }}>
            {articlesResult.loading ? (
              <Spinner />
            ) : (
              articlesResult.data.userArticles.map((article) => (
                <ArticleCard article={article} />
              ))
            )}
          </Container>
        </Tab>
      </Tabs>
    </Layout>
  );
}

export default withApollo(User);
