import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";
import PdfViewer from "../../components/PDFViewer";
import Review from "../../components/Review";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { ChevronUp, ChevronDown, PersonCircle } from "react-bootstrap-icons";

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
        submission {
          id
          venue {
            name
          }
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
    return <Spinner />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { title, versions, reviews } = data.article;
  const { abstract, ref } = versions[0];

  return (
    <Layout>
      <div style={{ display: "flex", height: "100%" }}>
        <div className="flex-grow-1">
          <Container fluid>
            <h1>{title}</h1>
            <Quill value={abstract} modules={{ toolbar: false }} readOnly />
            <h1>Reviews</h1>
            <Accordion>
              {reviews.map((review) => (
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    {review.author ? (
                      <>
                        <PersonCircle /> {review.author.name}
                      </>
                    ) : (
                      `Reviewer ${review.reviewNumber}`
                    )}{" "}
                    {review.submission.venue.name}
                    <ChevronDown />
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Review review={review} editing={false} />
                  </Accordion.Collapse>
                </Card>
              ))}
            </Accordion>
          </Container>
        </div>
        <div
          style={{
            width: 820,
            height: "calc(100vh - 55px)",
            overflowY: "scroll",
          }}
        >
          <PdfViewer fileRef={ref} width={800} />
        </div>
      </div>
    </Layout>
  );
}

export default withApollo(Article);
