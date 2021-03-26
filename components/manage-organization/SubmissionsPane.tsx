import gql from "graphql-tag";
import Container from "react-bootstrap/Container";
import Error from "../Error";
import SubmissionCard from "./SubmissionCard";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@apollo/react-hooks";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      submissions {
        id
        owner {
          id
          name
          email
        }
        article {
          id
          title
          versions {
            abstract
          }
        }
      }
    }
  }
`;

const SubmissionsPane = ({ id }) => {
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  if (error) {
    return (
      <Container fluid style={{ paddingTop: 10 }}>
        <Error header="There was a problem retrieving this organization's submissions." />
      </Container>
    );
  }
  const { submissions } = data.organization;
  return (
    <Container fluid style={{ paddingTop: 10 }}>
      <h4>Submissions</h4>
      {submissions.length === 0
        ? "There are currently no submissions."
        : submissions.map((submission) => (
            <SubmissionCard submission={submission} organizationId={id} />
          ))}
    </Container>
  );
};

export default SubmissionsPane;
