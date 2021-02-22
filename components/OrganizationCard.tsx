import Link from "next/link";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";
import { useRef } from "../lib/firebase";

const OrganizationCard = ({ organization }) => {
  const { id, name, description, logoRef } = organization;
  const url =
    logoRef !== null && logoRef !== undefined ? useRef(logoRef) : null;
  return (
    <Jumbotron>
      <Row>
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
      <Quill value={description} modules={{ toolbar: false }} readOnly />
    </Jumbotron>
  );
};

export default withApollo(OrganizationCard);
