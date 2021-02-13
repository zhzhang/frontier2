import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import create from "./create";

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
    </Layout>
  );
};

export default withApollo(NewArticle);
