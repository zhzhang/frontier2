import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useState } from "react";
import Layout from "../components/Layout";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const CreateOrganizationMutation = gql`
  mutation CreateOrganizationQuery($name: String!, $description: String!) {
    createOrganization(name: $name, description: $description) {
      id
    }
  }
`;

const NewOrganization = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createOrganization, { loading, error, data }] = useMutation(
    CreateOrganizationMutation
  );
  if (error) {
    return <div>Error: {error.message}</div>;
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
          <Form.Control
            type="text"
            placeholder="Org description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() =>
            createOrganization({
              variables: { name, description },
            })
          }
        >
          Submit
        </Button>
      </Form>
    </Layout>
  );
};

export default withApollo(NewOrganization);
