import Markdown from "@/components/Markdown";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { RoleEnum } from "../../lib/types";

const UpdateOrganizationMutation = gql`
  mutation UpdateOrganization($id: String!, $description: String!) {
    updateOrganization(id: $id, description: $description) {
      id
      name
      description
    }
  }
`;

const InfoPane = ({ id, description, role }) => {
  const [editing, setEditing] = useState(false);
  const [updateOrganization, { loading, error, data }] = useMutation(
    UpdateOrganizationMutation
  );
  return (
    <div className="mt-2">
      <Markdown>{description}</Markdown>
      {role === RoleEnum.ADMIN ? (
        editing ? (
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
        )
      ) : null}
    </div>
  );
};

export default InfoPane;
