import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import UserTypeaheadSingle from "../components/UserTypeaheadSingle";
import UserTypeahead from "../components/UserTypeahead";
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

const AssignReviewersMutation = gql`
  mutation AssignChair($submissionId: String!, $reviewerIds: [String!]!) {
    assignReviewers(submissionId: $submissionId, reviewerIds: $reviewerIds) {
      id
    }
  }
`;

const SubmissionCard = ({ submission }) => {
  const { id } = submission;
  const { title, versions } = submission.article;
  const abstract = versions[0].abstract;
  const [chair, setChair] = useState();
  const [assignChair, { loading, error, data }] = useMutation(
    AssignChairMutation
  );
  const [assignReviewers, result] = useMutation(AssignReviewersMutation);
  const [reviewers, setReviewers] = useState(submission.requestedReviewers);
  console.log(submission);
  return (
    <Jumbotron>
      <h3>{title}</h3>
      <Quill value={abstract} modules={{ toolbar: false }} readOnly />
      Area Chair:{" "}
      {submission.chair === null || submission.chair === undefined ? (
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
      Reviewers
      <UserTypeahead
        id="select-reviewers"
        selected={reviewers}
        onChangeSelection={setReviewers}
      />
      <Button
        onClick={() =>
          assignReviewers({
            variables: {
              submissionId: id,
              reviewerIds: reviewers.map((reviewer) => reviewer.id),
            },
          })
        }
      >
        Assign Reviewers
      </Button>
    </Jumbotron>
  );
};

export default withApollo(SubmissionCard);
