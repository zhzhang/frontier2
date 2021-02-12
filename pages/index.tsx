import Layout from "../components/Layout";
import Link from "next/link";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const ArticleQuery = gql`
  query ArticleQuery {
    articles {
      id
    }
  }
`;

const Blog = () => {
  const { loading, error, data } = useQuery(ArticleQuery);
  if (typeof window === "undefined") {
    return <div>Loading ...</div>;
  }
  if (loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Blog</h1>
        <main>
          {data.articles.map((post) => (
            <div key={post.id} className="post"></div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default withApollo(Blog);
