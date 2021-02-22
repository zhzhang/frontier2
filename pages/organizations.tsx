import Layout from "../components/Layout";
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
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: {},
  });

  if (loading) {
    console.log("loading");
    return <div>Loading ...</div>;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      {data.browseOrganizations.map((organization) => (
        <OrganizationCard organization={organization} />
      ))}
    </Layout>
  );
}

export default withApollo(Organizations);
