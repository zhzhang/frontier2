import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import Spinner from "../components/CenteredSpinner";
import OrganizationCard from "../components/OrganizationCard";
import { useRouter } from "next/router";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const OrganizationQuery = gql`
  query OrganizationQuery {
    browseOrganizations {
      id
      name
      description
      logoRef
    }
  }
`;

function Organizations() {
  const { loading, error, data } = useQuery(OrganizationQuery);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      <Container fluid style={{ paddingTop: 20 }}>
        {data.browseOrganizations.map((organization) => (
          <OrganizationCard organization={organization} />
        ))}
      </Container>
    </Layout>
  );
}

export default withApollo(Organizations);
