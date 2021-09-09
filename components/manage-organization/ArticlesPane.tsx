import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import AcceptedArticleCard from "../AcceptedArticleCard";
import Error from "../Error";

const AcceptedArticlesQuery = gql`
  query AcceptedArticlesQuery($where: DecisionsWhereInput!) {
    decisions(where: $where) {
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
    }
  }
`;

const ArticlesPane = ({ id }) => {
  const { loading, error, data } = useQuery(AcceptedArticlesQuery, {
    variables: {
      where: {
        articleId: {
          equals: id,
        },
      },
    },
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
