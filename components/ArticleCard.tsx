import Markdown from "@/components/Markdown";
import OrganizationBadge from "@/components/OrganizationBadge";
import UserBadge from "@/components/UserBadge";
import { withApollo } from "@/lib/apollo";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useState } from "react";

const ArticleCard = ({ article }) => {
  const { id, title, versions, authors, acceptedOrganizations } = article;
  const abstract = versions[0].abstract;
  const [hover, setHover] = useState(false);
  return (
    <Card>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default withApollo(ArticleCard);
