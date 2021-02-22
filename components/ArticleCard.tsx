import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Router from "next/router";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";

const ArticleCard = ({ article }) => {
  const { id, title, versions, authors } = article;
  const abstract = versions[0].abstract;
  return (
    <Jumbotron onClick={() => Router.push(`/article/${id}`)}>
      <h3>{title}</h3>
      <Quill value={abstract} modules={{ toolbar: false }} readOnly />
      {authors.map((a) => a.name)}
    </Jumbotron>
  );
};

export default withApollo(ArticleCard);
