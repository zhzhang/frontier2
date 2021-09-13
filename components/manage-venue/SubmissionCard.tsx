import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { useState } from "react";
import { withApollo } from "../../lib/apollo";
import Markdown from "../Markdown";
import EditorTypeahead from "./EditorTypeahead";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
    },
  })
);

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
  const classes = useStyles();
  const { id } = submission;
  const { title, versions } = submission.article;
  const abstract = versions[0].abstract;
  const [owner, setOwner] = useState();
  const [assignOwner, { loading, error, data }] =
    useMutation(AssignOwnerMutation);
  return (
    <Card className={classes.card}>
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
