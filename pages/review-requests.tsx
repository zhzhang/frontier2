import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Quill } from "../components/Quill";
import SubmissionCard from "../components/SubmissionCard";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const SubmissionsQuery = gql`
  query SubmissionsQuery {
    reviewerAssignedSubmissions {
      id
      article {
        id
        title
        versions {
          abstract
        }
      }
      requestedReviewers {
        id
        name
      }
    }
  }
`;

function ReviewRequests() {
  const { loading, error, data } = useQuery(SubmissionsQuery, {});

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }
  console.log(data);

  const submissions = data.reviewerAssignedSubmissions;

  return (
    <>
      <Layout>
        <h2>Submissions</h2>
        <Container fluid>
          {submissions.map((s) => (
            <SubmissionCard submission={s} />
          ))}
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(ReviewRequests);
