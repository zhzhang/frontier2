import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import Review from "../components/Review";
import { useState } from "react";
import { ChevronUp, ChevronDown, PersonCircle } from "react-bootstrap-icons";
import gql from "graphql-tag";

const AcceptedArticleCard = ({ metaReview }) => {
  const { article } = metaReview;
  const { title, authors } = article;
  const [open, setOpen] = useState(true);
  return (
    <Accordion activeKey={open ? "0" : null}>
      <Card style={{ padding: 10 }}>
        <h5>{title}</h5>
        {authors.map((author) => author.name)}
      </Card>
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          onClick={() => setOpen(!open)}
        >
          {`Meta-Review by ${metaReview.author.name}`}
          <span style={{ float: "right" }}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Quill
              value={metaReview.body}
              modules={{ toolbar: false }}
              readOnly
            />
            {metaReview.citedReviews.map((review) => (
              <Review review={review} editing={false} />
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default withApollo(AcceptedArticleCard);
