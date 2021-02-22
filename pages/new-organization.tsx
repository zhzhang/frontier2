import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Router from "next/router";

import { useState } from "react";
import Layout from "../components/Layout";
import { withApollo } from "../lib/apollo";
import { uploadFile } from "../lib/firebase";
import { UploadTypeEnum } from "../lib/types";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { Quill } from "../components/Quill";

const CreateOrganizationMutation = gql`
  mutation CreateOrganizationQuery(
    $name: String!
    $description: String!
    $logoRef: String
  ) {
    createOrganization(
      name: $name
      description: $description
      logoRef: $logoRef
    ) {
      id
    }
  }
`;

const NewOrganization = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
      <Form>
        <Form.Group controlId="formBasicName">
          <Form.Label>Organization Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Organization Name"
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
        {logoFile !== null && logoFile !== undefined ? (
          <Image src={URL.createObjectURL(logoFile)} />
        ) : null}

        <Button
          variant="primary"
          onClick={() => {
            if (logoFile === null || logoFile === undefined) {
              createOrganization({
                variables: { name, description },
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
                  variables: { name, description, logoRef: refPath },
                });
              }
            );
          }}
        >
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default withApollo(NewOrganization);
