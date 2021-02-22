import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";

const CreateReviewMutation = gql`
  mutation CreateReviewMutation($articleId: String!, $submissionId: String) {
    createReview(articleId: $articleId, submissionId: $submissionId) {
      id
    }
  }
`;

const ReviewRequestCard = ({ submission }) => {
  const { id } = submission;
  const { title, versions } = submission.article;
  const abstract = versions[0].abstract;
  const [createReview, { loading, error, data }] = useMutation(
    CreateReviewMutation
  );
  return (
    <Jumbotron>
      <h3>{title}</h3>
      <Quill value={abstract} modules={{ toolbar: false }} readOnly />
      <Button
        onClick={() =>
          createReview({
            variables: { articleId: submission.article.id, submissionId: id },
          })
        }
      >
        Write Review
      </Button>
    </Jumbotron>
  );
};

export default withApollo(ReviewRequestCard);
