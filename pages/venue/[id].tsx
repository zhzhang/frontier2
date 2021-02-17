import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const VenueQuery = gql`
  query VenueQuery($id: String!) {
    venue(id: $id) {
      id
      name
      description
      role
    }
  }
`;

const SubmissionsQuery = gql`
  query SubmissionsQuery($venueId: String!) {
    venueSubmissions(venueId: $venueId) {
      id
      article {
        id
        title
      }
    }
  }
`;

function Venue() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { id },
  });
  const result = useQuery(SubmissionsQuery, {
    variables: { venueId: id },
  });
  console.log(result);

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, description } = data.venue;

  return (
    <>
      <Layout>
        <Container fluid>
          <Row>
            <Col>
              <h1>{name}</h1>
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
      </Layout>
    </>
  );
}

export default withApollo(Venue);
