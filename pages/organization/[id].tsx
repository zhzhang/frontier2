import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Jumbotron from "react-bootstrap/Jumbotron";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      name
      description
    }
  }
`;

function Organization() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });

  if (loading) {
    console.log("loading");
    return <div>Loading ...</div>;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, description } = data.organization;

  return (
    <Layout>
      <Jumbotron>
        <h1>{name}</h1>
        <p>{description}</p>
      </Jumbotron>
    </Layout>
  );
}

export default withApollo(Organization);
