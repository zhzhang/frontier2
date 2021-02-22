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
import Modal from "react-bootstrap/Modal";
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

  return (
    <>
      <Layout>
        <Container fluid>
          <Row>
            <Col>
              <Header name={name} logoRef={logoRef} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Quill
                value={description}
                modules={{ toolbar: false }}
                readOnly
              />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          {accepted.map((metaReview) => (
            <AcceptedArticleCard metaReview={metaReview} />
          ))}
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(Organization);
