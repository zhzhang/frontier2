import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Markdown from "../Markdown";

const UpdateOrganizationMutation = gql`
  mutation UpdateOrganization($id: String!, $description: String!) {
    updateOrganization(id: $id, description: $description) {
      id
      name
      description
    }
  }
`;

function EditView({ description, setDescription }) {
  const [previewOpen, setPreviewOpen] = useState(true);
  return (
    <>
      <Form>
        <Form.Group controlId="name">
          <Form.Control
            as="textarea"
            rows={5}
            value={description}
            onChange={({ target: { value } }) => {
              setDescription(value);
            }}
          />
        </Form.Group>
      </Form>
      <Accordion activeKey={previewOpen ? "0" : null}>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            Preview
            <span className="float-right">
              {previewOpen ? <ChevronUp /> : <ChevronDown />}
            </span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <div className="p-2">
              <Markdown>{description}</Markdown>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}

export default function InfoPane({ id, description }) {
  const [editingDescription, setEditingDescription] = useState(false);
  const [updateOrganization, { loading, error, data }] = useMutation(
    UpdateOrganizationMutation
  );
  const [desc, setDescription] = useState(description);
  return (
    <Container fluid className="mt-2">
      <Row>
        <Col>
          {editingDescription ? (
            <EditView description={desc} setDescription={setDescription} />
          ) : (
            <Markdown>{description}</Markdown>
          )}
        </Col>
        <Col md={2}>
          <div className="mt-2">
            {editingDescription ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    updateOrganization({
                      variables: {
                        id,
                        description: desc,
                      },
                    });
                    setEditing(false);
                  }}
                >
                  Save
                </Button>{" "}
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
