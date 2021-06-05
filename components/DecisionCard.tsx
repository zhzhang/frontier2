import Markdown from "@/components/Markdown";
import UserBadge from "@/components/UserBadge";
import { withApollo } from "@/lib/apollo";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

const AcceptedArticleCard = ({ decision }) => {
  const [open, setOpen] = useState(true);
  return (
    <Accordion activeKey={open ? "0" : null}>
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          onClick={() => setOpen(!open)}
        >
          <span>
            <UserBadge user={decision.author} />
          </span>
          <span style={{ float: "right" }}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Markdown>{decision.body}</Markdown>
            {decision.citedReviews.map((review) => review.author.name)}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default withApollo(AcceptedArticleCard);
