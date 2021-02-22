import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import UserTypeaheadSingle from "../components/UserTypeaheadSingle";
import UserTypeahead from "../components/UserTypeahead";
import { useState } from "react";
import gql from "graphql-tag";

const AcceptedArticleCard = ({ metaReview }) => {
  const { article } = metaReview;
  const { title, authors } = article;
  return (
    <Card>
      <h5>{title}</h5>
      {authors.map((author) => author.name)}
    </Card>
  );
};

export default withApollo(AcceptedArticleCard);
