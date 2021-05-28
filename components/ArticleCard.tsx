import Jumbotron from "react-bootstrap/Jumbotron";
import Router from "next/router";
import Markdown from "./Markdown";
import { withApollo } from "../lib/apollo";
import OrganizationBadge from "../components/OrganizationBadge";
import UserBadge from "../components/UserBadge";
import { useState } from "react";

const ArticleCard = ({ article }) => {
  const { id, title, versions, authors, acceptedOrganizations } = article;
  const abstract = versions[0].abstract;
  const [hover, setHover] = useState(false);
  return (
    <Jumbotron>
      <h4
        onClick={() => Router.push(`/article/${id}`)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ color: hover ? "blue" : "black" }}
      >
        {title}
      </h4>
      <span>
        Authors:{" "}
        {authors !== null ? (
          authors.map((author) => <UserBadge user={author} />)
        ) : (
          <em>anonymized</em>
        )}
      </span>
      <Markdown>{abstract}</Markdown>
      <span>
        {acceptedOrganizations.length === 0 ? null : "Accepted by: "}
        {acceptedOrganizations.map((org) => (
          <OrganizationBadge organization={org} />
        ))}
      </span>
    </Jumbotron>
  );
};

export default withApollo(ArticleCard);
