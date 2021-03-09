import gql from "graphql-tag";
import Container from "react-bootstrap/Container";
import AcceptedArticleCard from "../AcceptedArticleCard";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@apollo/react-hooks";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      accepted {
        id
        body
        article {
          id
          title
          authors {
            id
            name
          }
          versions {
            id
            abstract
            versionNumber
          }
        }
        author {
          id
          name
        }
        citedReviews {
          author {
            name
          }
          body
          reviewNumber
          rating
          canAccess
          organization {
            logoRef
            abbreviation
          }
        }
      }
    }
  }
`;

const ArticlesPane = ({ id }) => {
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });
  if (loading) {
    return <Spinner animation="border" style={{ top: "50%", left: "50%" }} />;
  }
  const { accepted } = data.organization;
  return (
    <Container fluid style={{ paddingTop: 10 }}>
      {accepted.map((decision) => (
        <AcceptedArticleCard decision={decision} />
      ))}
    </Container>
  );
};

export default ArticlesPane;
