import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Router from "next/router";

import { useState } from "react";
import Layout from "../components/Layout";
import { withApollo } from "../lib/apollo";
import { uploadFile } from "../lib/firebase";
import { UploadTypeEnum } from "../lib/types";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import Markdown from "../components/Markdown";
import Error from "../components/Error";

const CreateOrganizationMutation = gql`
  mutation CreateOrganizationQuery(
    $name: String!
    $description: String!
    $abbreviation: String
    $logoRef: String
  ) {
    createOrganization(
      name: $name
      description: $description
      abbreviation: $abbreviation
      logoRef: $logoRef
    ) {
      id
    }
  }
`;

const NewOrganization = () => {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState(null);
  const [description, setDescription] = useState(
    "Write a description of your organization!"
  );
  const [previewOpen, setPreviewOpen] = useState(true);
  const [logoFile, setLogoFile] = useState();
  const [createOrganization, { loading, error, data }] = useMutation(
    CreateOrganizationMutation
  );
  if (!loading && data && data.createOrganization) {
    Router.push(`/organization/${data.createOrganization.id}`);
  }

  return (
    <Layout>
      <Container fluid="lg" className="mt-4">
        <h3>Create Organization</h3>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="name">
                <Form.Control
                  type="text"
                  placeholder="Organization Name"
                  value={name}
                  onChange={({ target: { value } }) => setName(value)}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="abbreviation">
                <Form.Control
                  type="text"
                  placeholder="Abbreviation"
                  value={abbreviation}
                  onChange={({ target: { value } }) => setAbbreviation(value)}
                />
                <Form.Text className="text-muted">
                  Optional. Ten Character Maximum.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="description">
            <Row>
              <Col>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={({ target: { value } }) => {
                    setDescription(value);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
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
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="logo">
            <Row>
              <Col>
                <Form.File
                  id="custom-file"
                  label="Logo (Optional)"
                  onChange={(e) => {
                    setLogoFile(e.target.files[0]);
                  }}
                />
              </Col>
              <Col>
                {logoFile !== null && logoFile !== undefined ? (
                  <Image src={URL.createObjectURL(logoFile)} />
                ) : null}
              </Col>
            </Row>
          </Form.Group>

          <Button
            variant="primary"
            onClick={() => {
              if (!logoFile) {
                createOrganization({
                  variables: {
                    name,
                    description,
                    abbreviation,
                  },
                });
                return;
              }
              const { uploadTask, refPath } = uploadFile(
                logoFile,
                UploadTypeEnum.LOGO
              );
              uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {},
                () => {
                  createOrganization({
                    variables: {
                      name,
                      description,
                      abbreviation,
                      logoRef: refPath,
                    },
                  });
                }
              );
            }}
          >
            Create
          </Button>
        </Form>
        {error ? (
          <Error header="There was a problem creating your organization." />
        ) : null}
      </Container>
    </Layout>
  );
};

export default withApollo(NewOrganization);
