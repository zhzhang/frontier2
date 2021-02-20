import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";
import SubmissionCard from "../../components/SubmissionCard";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const VenueQuery = gql`
  query VenueQuery($id: String!) {
    venue(id: $id) {
      id
      name
      description
      role
    }
  }
`;

const SubmissionsQuery = gql`
  query SubmissionsQuery($venueId: String!) {
    venueSubmissions(venueId: $venueId) {
      id
      article {
        id
        title
        versions {
          abstract
        }
      }
      chair {
        id
        name
      }
      requestedReviewers {
        id
        name
      }
    }
  }
`;

function Venue() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(VenueQuery, {
    variables: { id },
  });
  const submissionsResult = useQuery(SubmissionsQuery, {
    variables: { venueId: id },
  });

  if (loading || submissionsResult.loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, description } = data.venue;
  const submissions = submissionsResult.data.venueSubmissions;

  return (
    <>
      <Layout>
        <Container fluid>
          <Row>
            <Col>
              <h1>{name}</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Quill
                value={description}
                modules={{ toolbar: false }}
                readOnly
              />
            </Col>
          </Row>
        </Container>
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

export default withApollo(Venue);
