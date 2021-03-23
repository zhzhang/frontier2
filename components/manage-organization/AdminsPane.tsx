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
      admins {
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
      admins {
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
  const [newAdmins, setNewAdmins] = useState([]);
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
  const { admins } = data.organization;
  return (
    <Container fluid className="mt-2">
      <h4>Admins</h4>
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
              {admins.map((admin) => (
                <tr>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        updateOrganizationMembership({
                          variables: {
                            organizationId: id,
                            userId: admin.id,
                            action: "REMOVE",
                            role: RoleEnum.ADMIN,
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
      <Row className="d-flex">
        <Col className="flex-grow-1">
          <UserTypeahead
            selected={newAdmins}
            onChangeSelection={setNewAdmins}
          />
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={() => {
              newAdmins.map((user) =>
                updateOrganizationMembership({
                  variables: {
                    organizationId: id,
                    userId: user.id,
                    action: "ADD",
                    role: RoleEnum.ADMIN,
                  },
                })
              );
              setNewAdmins([]);
            }}
          >
            Add
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
