import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { withApollo } from "../lib/apollo";
import { Quill } from "../components/Quill";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import dynamic from "next/dynamic";
import UserTypeahead from "../components/UserTypeahead";

const PDFViewer = dynamic(() => import("../components/PDFViewer"), {
  ssr: false,
});

const CreateArticleMutation = gql`
  mutation CreateArticleQuery(
    $abstract: String!
    $authorIds: [String!]!
    $fileData: Upload!
  ) {
    createArticle(
      abstract: $abstract
      authorIds: $authorIds
      fileData: $fileData
    ) {
      id
    }
  }
`;

const NewArticle = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState([]);
  const [venue, setVenue] = useState("id");
  const [createArticle, { loading, error, data }] = useMutation(
    CreateArticleMutation
  );
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log(authors);

  return (
    <Layout>
      <input
        id="upload"
        type="file"
        onChange={({
          target: {
            files: [file],
          },
        }) => {
          setFile(file);
        }}
      />
      <button
        onClick={() => {
          console.log(file);
          createArticle({
            variables: {
              abstract: "abstract!",
              authorIds: ["a1!"],
              fileData: file,
            },
          });
        }}
      >
        Create
      </button>
      {file !== null ? (
        <PDFViewer file={file} width={700} pageNumber={10} />
      ) : (
        "PDF goes here"
      )}
      <Form>
        <Form.Group controlId="formBasicName">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicDescrption">
          <Form.Label>Abstract</Form.Label>
          <Quill
            value={abstract}
            onChange={setAbstract}
            modules={{
              toolbar: [["bold", "italic", "underline", "strike"], ["formula"]],
            }}
          />
        </Form.Group>

        <Button
          variant="primary"
          onClick={() =>
            createOrganization({
              variables: { name, description },
            })
          }
        >
          Submit
        </Button>
        <UserTypeahead
          id="user-typeahead"
          selected={authors}
          onChangeSelection={setAuthors}
        />
      </Form>
    </Layout>
  );
};

export default withApollo(NewArticle);
