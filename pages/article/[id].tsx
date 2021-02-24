import Layout from "../../components/Layout";
import { useState } from "react";
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
        canAccess
        published
        author {
          id
          name
        }
        organization {
          id
          name
          abbreviation
          logoRef
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
  const [abstractOpen, setAbstractOpen] = useState(false);
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { title, authors, versions, reviews } = data.article;
  const { abstract, ref } = versions[0];

  return (
    <Layout>
      <div style={{ display: "flex", height: "100%" }}>
        <div className="flex-grow-1">
          <Container fluid style={{ paddingTop: 10 }}>
            <h4>{title}</h4>
            {authors.map((author) => (
              <span>{author.name}</span>
            ))}
            <Accordion activeKey={abstractOpen ? "0" : null}>
              <Card>
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="0"
                  onClick={() => setAbstractOpen(!abstractOpen)}
                >
                  Abstract
                  <span style={{ float: "right" }}>
                    {abstractOpen ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Quill
                    value={abstract}
                    modules={{ toolbar: false }}
                    readOnly
                  />
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <br />
            <h4>Reviews</h4>
            {reviews.map((review) => (
              <div style={{ paddingBottom: 10 }}>
                <Review review={review} editing={false} startOpen={true} />
              </div>
            ))}
          </Container>
        </div>
        <div
          style={{
            minWidth: 730,
            width: "auto",
            height: "calc(100vh - 55px)",
            overflowY: "scroll",
          }}
        >
          <PdfViewer fileRef={ref} />
        </div>
      </div>
    </Layout>
  );
}

export default withApollo(Article);
