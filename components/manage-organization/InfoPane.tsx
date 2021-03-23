import gql from "graphql-tag";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import Error from "../Error";
import Markdown from "../Markdown";
import { RoleEnum } from "../../lib/types";
import Spinner from "react-bootstrap/Spinner";
import { useMutation } from "@apollo/react-hooks";
import { useState } from "react";

const UpdateOrganizationMutation = gql`
  mutation UpdateOrganization($id: String!, $description: String!) {
    updateOrganization(id: $id, description: $description) {
      id
      name
      description
    }
  }
`;

const EditView = ({ description, setDescription }) => {
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
};

const InfoPane = ({ id, description }) => {
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
};

export default InfoPane;
