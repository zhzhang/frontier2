import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "../components/Quill";

const OrganizationQuery = gql`
  query OrganizationQuery {
    browseOrganizations {
      id
      name
      description
      admins {
        id
      }
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
      {data.browseOrganizations.map(({ id, name, description }) => (
        <Link href="/organization/[id]" as={`/organization/${id}`}>
          <Jumbotron>
            <h1>{name}</h1>
            <Quill value={description} />
          </Jumbotron>
        </Link>
      ))}
    </Layout>
  );
}

export default withApollo(Organizations);
