import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Markdown from "../Markdown";
import { withApollo } from "../../lib/apollo";
import EditorTypeahead from "./EditorTypeahead";
import { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const AssignOwnerMutation = gql`
  mutation AssignOwner($submissionId: String!, $userId: String!) {
    assignSubmissionOwner(submissionId: $submissionId, userId: $userId) {
      id
      owner {
        id
        name
        email
      }
    }
  }
`;

const SubmissionCard = ({ submission, organizationId }) => {
  const { id } = submission;
  const { title, versions } = submission.article;
  const abstract = versions[0].abstract;
  const [owner, setOwner] = useState();
  const [assignOwner, { loading, error, data }] = useMutation(
    AssignOwnerMutation
  );
  return (
    <Card className="p-2">
      <p>{title}</p>
      <Markdown>{abstract}</Markdown>
      {submission.owner ? (
        submission.owner.name
      ) : (
        <div>
          <EditorTypeahead
            id="select-editor"
            organizationId={organizationId}
            selected={owner}
            onChangeSelection={setOwner}
          />
          <Button
            onClick={() =>
              assignOwner({
                variables: { submissionId: id, userId: owner[0].id },
              })
            }
          >
            Assign Action Editor
          </Button>
        </div>
      )}
    </Card>
  );
};

export default withApollo(SubmissionCard);
