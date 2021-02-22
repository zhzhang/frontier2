import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";
import PdfViewer from "../../components/PDFViewer";
import Review from "../../components/Review";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const ArticleQuery = gql`
  query ArticleQuery($id: String!) {
    article(id: $id) {
      id
      title
      authors {
        id
        name
      }
      versions {
        id
        abstract
        ref
      }
      reviews {
        id
        body
        rating
        reviewNumber
        published
        author {
          id
          name
        }
      }
    }
  }
`;

function Article() {
  const { id, reviewId } = useRouter().query;
  const { loading, error, data } = useQuery(ArticleQuery, {
    variables: { id },
  });
  if (loading) {
    return "Loading...";
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { title, versions, reviews } = data.article;
  const { abstract, ref } = versions[0];

  return (
    <>
      <Layout>
        <Container fluid>
          <Row>
            <Col>
              <Row>
                <h1>{title}</h1>
              </Row>
              <Row>
                <Quill value={abstract} modules={{ toolbar: false }} readOnly />
              </Row>
              <Row>
                <h1>Reviews</h1>
              </Row>
              {reviews.map((review) => (
                <Row>
                  <Review review={review} editing />
                </Row>
              ))}
            </Col>
            <Col>
              <PdfViewer fileRef={ref} width={600} pageNumber={1} />
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(Article);
