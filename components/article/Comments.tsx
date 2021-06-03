import Markdown from "@/components/Markdown";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const Reviews = ({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) => {
  const [body, setBody] = useState("Try me!");
  const [previewOpen, setPreviewOpen] = useState(true);
  return (
    <>
      <Form.Control
        as="textarea"
        rows={4}
        value={body}
        onChange={({ target: { value } }) => {
          setBody(value);
        }}
      />
      {highlights.map((highlight) => (
        <div>{highlight.id}</div>
      ))}
      <Accordion className="mb-2" activeKey={previewOpen ? "0" : null}>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            Preview
            <span className="float-right">
              {previewOpen ? <ChevronUp /> : <ChevronDown />}
            </span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <div className="p-2">
              <Markdown
                highlights={highlights}
                updateArticleAndScroll={updateArticleAndScroll}
                articleMode
              >
                {body}
              </Markdown>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
};

export default Reviews;
