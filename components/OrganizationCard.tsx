import Markdown from "@/components/Markdown";
import { withApollo } from "@/lib/apollo";
import { useRef } from "@/lib/firebase";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

const OrganizationCard = ({ organization }) => {
  const { id, name, description, logoRef } = organization;
  console.log(organization);
  const url =
    logoRef !== null && logoRef !== undefined ? useRef(logoRef) : null;
  return (
    <Card>
      <Card.Body>
        <Row style={{ marginBottom: 10 }}>
          <Col>
            {url === null ? (
              <Image
                src="holder.js/171x180"
                className="organization-logo"
                rounded
              />
            ) : (
              <Image src={url} className="organization-logo" thumbnail />
            )}
            <Link href="/organization/[id]" as={`/organization/${id}`}>
              <h2>{name}</h2>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Markdown>{description}</Markdown>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default withApollo(OrganizationCard);
