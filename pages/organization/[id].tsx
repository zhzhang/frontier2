import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";
import VenueCard from "../../components/VenueCard";
import { RoleEnum } from "../../lib/types";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
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
        name
        description
      }
    }
  }
`;

const CreateVenueMutation = gql`
  mutation CreateVenueMutation(
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

const CreateVenueBody = ({ organizationId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createVenue, { loading, error, data }] = useMutation(
    CreateVenueMutation
  );
  return (
    <Form>
      <Form.Group controlId="formBasicName">
        <Form.Label>Venue Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Venue Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicDescrption">
        <Form.Label>Description</Form.Label>
        <Quill
          value={description}
          onChange={setDescription}
          modules={{
            toolbar: [["bold", "italic", "underline", "strike"], ["formula"]],
          }}
        />
      </Form.Group>

      <Button
        variant="primary"
        onClick={() =>
          createVenue({
            variables: { name, description, organizationId },
          })
        }
      >
        Submit
      </Button>
    </Form>
  );
};

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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>New Venue</Modal.Header>
        <Modal.Body>
          <CreateVenueBody organizationId={id} />
        </Modal.Body>
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
            <Col>
              {venues.length == 0
                ? "No venues."
                : venues.map((venue) => <VenueCard venue={venue} />)}
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(Organization);
