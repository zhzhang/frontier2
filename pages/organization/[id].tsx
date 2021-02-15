import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "../../components/Quill";
import { RoleEnum } from "../../lib/types";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      name
      description
      role
      venues {
        id
      }
    }
  }
`;

const CreateVenueQuery = gql`
  mutation CreateVenueQuery(
    $name: String!
    $description: String!
    $organizationId: String!
  ) {
    createVenue(
      name: $name
      description: $description
      organizationId: $organizationId
    ) {
      id
      name
      description
    }
  }
`;

function Organization() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, description, role, venues } = data.organization;
  console.log(venues);

  return (
    <>
      <Modal show={showModal}>
        <Modal.Header>Lol</Modal.Header>
      </Modal>
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
        <Container fluid>
          <Row>
            <Col>
              <h2>Venues</h2>
            </Col>
            {role == RoleEnum.ADMIN ? (
              <Col>
                <Button onClick={() => setShowModal(true)}>Create</Button>
              </Col>
            ) : null}
          </Row>
          <Row>
            <Col>{venues.length == 0 ? "No venues." : "venues"}</Col>
          </Row>
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(Organization);
