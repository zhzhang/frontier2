import Markdown from "@/components/Markdown";
import { useRouter } from "next/router";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";

const DecisionCard = ({ decision }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  console.log(router.pathname);
  console.log(router.query);

  return (
    <Accordion activeKey={open ? "0" : null}>
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          onClick={() => setOpen(!open)}
        >
          <span>
            {decision.author.name} - {decision.organization.abbreviation}
          </span>
          <span style={{ float: "right" }}>
            <Badge variant="success">Accept</Badge>{" "}
            {open ? <ChevronUp /> : <ChevronDown />}
          </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <div className="p-2">
            <Markdown>{decision.body}</Markdown>
            Cited Reviews
            {decision.citedReviews.map((review) => (
              <div>
                <a href="www.google.com">
                  Reviewer {review.reviewNumber} -{" "}
                  {review.organization.abbreviation}
                </a>
              </div>
            ))}
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default DecisionCard;
