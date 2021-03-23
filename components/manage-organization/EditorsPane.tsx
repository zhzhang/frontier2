import gql from "graphql-tag";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Error from "../Error";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { RoleEnum } from "../../lib/types";
import UserTypeahead from "../UserTypeahead";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      editors {
        id
        name
        email
      }
    }
  }
`;

const UpdateOrganizationMembershipMutation = gql`
  mutation UpdateOrganizationMembershipMutation(
    $organizationId: String!
    $userId: String!
    $action: String!
    $role: Role!
  ) {
    updateOrganizationMembership(
      organizationId: $organizationId
      userId: $userId
      action: $action
      role: $role
    ) {
      id
      editors {
        id
        name
        email
      }
    }
  }
`;

export default ({ id }) => {
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });
  const [updateOrganizationMembership, result] = useMutation(
    UpdateOrganizationMembershipMutation
  );
  const [newEditors, setNewEditors] = useState([]);
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return (
      <Container fluid style={{ paddingTop: 10 }}>
        <Error header="There was a problem retrieving this organization's venues." />
      </Container>
    );
  }
  const { editors } = data.organization;
  return (
    <Container fluid className="mt-2">
      <h4>Action Editors</h4>
      <Row className="d-flex mb-2">
        <Col className="flex-grow-1">
          <UserTypeahead
            selected={newEditors}
            onChangeSelection={setNewEditors}
          />
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={() => {
              newEditors.map((user) =>
                updateOrganizationMembership({
                  variables: {
                    organizationId: id,
                    userId: user.id,
                    action: "ADD",
                    role: RoleEnum.ACTION_EDITOR,
                  },
                })
              );
              setNewEditors([]);
            }}
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {editors.map((editor) => (
                <tr>
                  <td>{editor.name}</td>
                  <td>{editor.email}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        updateOrganizationMembership({
                          variables: {
                            organizationId: id,
                            userId: editor.id,
                            action: "REMOVE",
                            role: RoleEnum.ACTION_EDITOR,
                          },
                        })
                      }
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
