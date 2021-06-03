import Markdown from "@/components/Markdown";
import OrganizationBadge from "@/components/OrganizationBadge";
import UserBadge from "@/components/UserBadge";
import { withApollo } from "@/lib/apollo";
import { useState } from "react";
import Card from "react-bootstrap/Card";

const ArticleCard = ({ article }) => {
  const { id, title, versions, authors, acceptedOrganizations } = article;
  const abstract = versions[0].abstract;
  const [hover, setHover] = useState(false);
  return (
    <Card>
      <Card.Body>
        <a href={`/article/${id}`}>{title}</a>
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
