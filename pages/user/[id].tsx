import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Spinner from "../../components/CenteredSpinner";
import ArticleCard from "../../components/ArticleCard";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import "react-datepicker/dist/react-datepicker.css";

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

function User() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, email, articles } = data.user;
  const tabKey = "articles";

  return (
    <Layout>
      <Container style={{ paddingTop: 20 }} fluid>
        <Row style={{ paddingBottom: 20 }}>
          <Col>
            <h1>{name}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs>
              <Tab eventKey="articles" title="Articles">
                <Container fluid style={{ margin: 10 }}>
                  {articles.map((article) => (
                    <ArticleCard article={article} />
                  ))}
                </Container>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default withApollo(User);
