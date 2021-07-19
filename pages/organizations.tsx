import ErrorPage from "@/components/ErrorPage";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import OrganizationCard from "@/components/OrganizationCard";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

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
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  if (error) {
    return (
      <ErrorPage>
        Unable to load organizations, please try again later.
      </ErrorPage>
    );
  }

  return (
    <Layout>
      {data.browseOrganizations.map((organization) => (
        <div className="mt-3">
          <OrganizationCard organization={organization} />
        </div>
      ))}
    </Layout>
  );
}

export default withApollo(Organizations);
