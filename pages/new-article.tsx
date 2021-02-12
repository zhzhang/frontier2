import Layout from "../components/Layout";
import Link from "next/link";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

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
  const [createArticle, { loading, error, data }] = useMutation(
    CreateArticleMutation
  );
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <Layout>Test</Layout>;
};

export default withApollo(NewArticle);
