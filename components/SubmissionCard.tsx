import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import UserTypeaheadSingle from "../components/UserTypeaheadSingle";
import { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const AssignChairMutation = gql`
  mutation AssignChair($submissionId: String!, $chairId: String!) {
    assignChair(submissionId: $submissionId, chairId: $chairId) {
      id
    }
  }
`;

const SubmissionCard = ({ submission }) => {
  const { id, title, versions } = submission.article;
  const abstract = versions[0].abstract;
  const [chair, setChair] = useState();
  const [assignChair, { loading, error, data }] = useMutation(
    AssignChairMutation
  );
  console.log(chair);
  return (
    <Jumbotron>
      <h3>{title}</h3>
      <Quill value={abstract} modules={{ toolbar: false }} readOnly />
      {submission.chair === null ? (
        <div>
          "No area chair assigned."
          <Button
            onClick={() =>
              assignChair({
                variables: { submissionId: id, chairId: chair[0].id },
              })
            }
          >
            Assign Chair
          </Button>
          <UserTypeaheadSingle
            id="select-chair"
            selected={chair}
            onChangeSelection={setChair}
          />
        </div>
      ) : (
        submission.chair.name
      )}
    </Jumbotron>
  );
};

export default withApollo(SubmissionCard);
