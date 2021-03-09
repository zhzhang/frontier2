import Button from "react-bootstrap/Button";
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

const CreateOrganizationMutation = gql`
  mutation CreateOrganizationQuery(
    $name: String!
    $description: String!
    $abbreviation: String
    $logoFile: Upload
  ) {
    createOrganization(
      name: $name
      description: $description
      abbreviation: $abbreviation
      logoFile: $logoFile
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
  const [logoFile, setLogoFile] = useState();
  const [createOrganization, { loading, error, data }] = useMutation(
    CreateOrganizationMutation
  );
  if (error) {
    return <div>Error: {error.message}</div>;
  }
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
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={({ target: { value } }) => setDescription(value)}
                />
              </Col>
              <Col>
                <div>Preview</div>
                <Markdown>{description}</Markdown>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="logo">
            <Row>
              <Col>
                <Form.File
                  id="custom-file"
                  label="Logo file"
                  onChange={({
                    target: {
                      files: [file],
                    },
                  }) => {
                    setLogoFile(file);
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
              createOrganization({
                variables: { name, description, abbreviation, logoFile },
              });
            }}
          >
            Create
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default withApollo(NewOrganization);
