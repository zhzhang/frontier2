import { useState } from "react";
import Layout from "../components/Layout";
import { withApollo } from "../lib/apollo";
import Markdown from "../components/Markdown";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { uploadFile } from "../lib/firebase";
import { UploadTypeEnum } from "../lib/types";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import dynamic from "next/dynamic";
import UserTypeahead from "../components/UserTypeahead";

const PDFViewer = dynamic(() => import("../components/PDFViewer"), {
  ssr: false,
});

const CreateArticleMutation = gql`
  mutation CreateArticleQuery(
    $title: String!
    $abstract: String!
    $authorIds: [String!]!
    $ref: String!
  ) {
    createArticle(
      title: $title
      abstract: $abstract
      authorIds: $authorIds
      ref: $ref
    ) {
      id
    }
  }
`;

const GetOrganizationQuery = gql`
  query GetVenueQuery($id: String!) {
    organization(id: $id) {
      name
    }
  }
`;

const NewArticle = () => {
  const router = useRouter();
  const { organizationId } = router.query;
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [createArticle, { loading, error, data }] = useMutation(
    CreateArticleMutation
  );

  return (
    <Layout>
      <div style={{ display: "flex", height: "100%" }}>
        <div
          className="flex-grow-1"
          style={{
            minWidth: 300,
            width: "auto",
            height: "calc(100vh - 55px)",
            overflowY: "scroll",
          }}
        >
          <Container className="m-2">
            <Form>
              <Form.Group controlId="formBasicName">
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBasicDescrption">
                <Form.Label>Abstract</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={abstract}
                  onChange={({ target: { value } }) => {
                    setAbstract(value);
                  }}
                />
                <Accordion activeKey={previewOpen ? "0" : null}>
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="0"
                      onClick={() => setPreviewOpen(!previewOpen)}
                    >
                      Preview
                      <span className="float-right">
                        {previewOpen ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <div className="p-2">
                        <Markdown>{abstract}</Markdown>
                      </div>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Form.Group>
              <Form.Group controlId="formBasicDescrption">
                <Form.Label>Authors</Form.Label>
                <UserTypeahead
                  id="user-typeahead"
                  selected={authors}
                  onChangeSelection={setAuthors}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={() => {
                  const { uploadTask, refPath } = uploadFile(
                    file,
                    UploadTypeEnum.ARTICLE
                  );
                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {},
                    (error) => {},
                    () => {
                      createArticle({
                        variables: {
                          title,
                          abstract,
                          ref: refPath,
                          authorIds: authors.map((a) => a.id),
                        },
                      });
                    }
                  );
                }}
              >
                Submit
              </Button>
            </Form>
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
          {file !== null ? (
            <PDFViewer file={file} width={700} />
          ) : (
            <Form.File
              id="custom-file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withApollo(NewArticle);
