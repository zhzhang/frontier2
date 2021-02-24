import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";
import AcceptedArticleCard from "../../components/AcceptedArticleCard";
import { useAuth } from "../../lib/firebase";
import { useRef } from "../../lib/firebase";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      name
      description
      role
      logoRef
      accepted {
        id
        body
        article {
          id
          title
          authors {
            id
            name
          }
          versions {
            id
            abstract
            versionNumber
          }
        }
        author {
          id
          name
        }
        citedReviews {
          author {
            name
          }
          body
          reviewNumber
          rating
          canAccess
          organization {
            logoRef
            abbreviation
          }
        }
      }
    }
  }
`;

function Header({ name, logoRef }) {
  const url = useRef(logoRef);
  return (
    <>
      <Image src={url} className="organization-logo" thumbnail />
      <h2>{name}</h2>
    </>
  );
}

function Organization() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, description, role, logoRef, accepted } = data.organization;
  const tabKey = "accepted";

  return (
    <>
      <Layout>
        <Container style={{ paddingTop: 20 }} fluid>
          <Row style={{ paddingBottom: 20 }}>
            <Col>
              <Header name={name} logoRef={logoRef} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Tabs defaultActiveKey={tabKey}>
                <Tab eventKey="info" title="Info">
                  <Container fluid style={{ paddingTop: 10 }}>
                    <Quill
                      value={description}
                      modules={{ toolbar: false }}
                      readOnly
                    />
                  </Container>
                </Tab>
                <Tab eventKey="accepted" title="Accepted Articles">
                  <Container fluid style={{ paddingTop: 10 }}>
                    {accepted.map((metaReview) => (
                      <AcceptedArticleCard metaReview={metaReview} />
                    ))}
                  </Container>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(Organization);
