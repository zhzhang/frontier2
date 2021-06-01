import Card from "react-bootstrap/Card";
import Router from "next/router";
import Markdown from "./Markdown";
import { withApollo } from "@/lib/apollo";
import OrganizationBadge from "@/components/OrganizationBadge";
import UserBadge from "@/components/UserBadge";
import { useState } from "react";

const ArticleCard = ({ article }) => {
  const { id, title, versions, authors, acceptedOrganizations } = article;
  const abstract = versions[0].abstract;
  const [hover, setHover] = useState(false);
  return (
    <Card>
      <Card.Body>
        <h5
          onClick={() => Router.push(`/article/${id}`)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ color: hover ? "blue" : "black" }}
        >
          {title}
        </h5>
        <div>
          Authors:{" "}
          {authors !== null ? (
            authors.map((author) => <UserBadge user={author} />)
          ) : (
            <em>anonymized</em>
          )}
        </div>
        <div>
          {acceptedOrganizations.length === 0 ? null : "Accepted by: "}
          {acceptedOrganizations.map((org) => (
            <OrganizationBadge organization={org} />
          ))}
        </div>
        <Markdown>{abstract}</Markdown>
      </Card.Body>
    </Card>
  );
};

export default withApollo(ArticleCard);
