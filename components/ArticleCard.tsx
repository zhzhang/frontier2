import Jumbotron from "react-bootstrap/Jumbotron";
import Router from "next/router";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import UserBadge from "../components/UserBadge";

const ArticleCard = ({ article }) => {
  const { id, title, versions, authors } = article;
  const abstract = versions[0].abstract;
  return (
    <Jumbotron onClick={() => Router.push(`/article/${id}`)}>
      <h4>{title}</h4>
      <span>
        Authors:{" "}
        {authors !== null ? (
          authors.map((author) => <UserBadge user={author} />)
        ) : (
          <em>anonymized</em>
        )}
      </span>
      <Quill value={abstract} modules={{ toolbar: false }} readOnly />
    </Jumbotron>
  );
};

export default withApollo(ArticleCard);
