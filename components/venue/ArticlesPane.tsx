import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import AcceptedArticleCard from "../AcceptedArticleCard";
import Error from "../Error";

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
          highlights
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
  let interiorComponent;
  if (error) {
    interiorComponent = (
      <Error
        header="There was a problem loading this organization's articles."
        dismissible={false}
      />
    );
  } else if (accepted.length === 0) {
    interiorComponent = "No accepted articles yet.";
  } else {
    interiorComponent = accepted.map((decision) => (
      <AcceptedArticleCard decision={decision} />
    ));
  }

  return (
    <Container fluid className="mt-2">
      {interiorComponent}
    </Container>
  );
};

export default ArticlesPane;
