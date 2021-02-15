import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import dynamic from "next/dynamic";

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
    </Layout>
  );
};

export default withApollo(NewArticle);
