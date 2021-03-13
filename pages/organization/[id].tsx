import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Quill } from "../../components/Quill";
import { useAuth } from "../../lib/firebase";
import { useRef } from "../../lib/firebase";
import Spinner from "../../components/CenteredSpinner";
import ArticlesPane from "../../components/organization/ArticlesPane";
import VenuesPane from "../../components/organization/VenuesPane";
import { RoleEnum } from "../../lib/types";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrganizationQuery = gql`
  query OrganizationQuery($id: String!) {
    organization(id: $id) {
      id
      name
      description
      role
      logoRef
    }
  }
`;

function Header({ name, logoRef }) {
  const url = useRef(logoRef);
  return (
    <>
      <Image src={url} className="organization-logo" thumbnail />
      <h2>{name}</h2>
    </>
  );
}

function Organization() {
  const id = useRouter().query.id;
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });
  const [tabKey, setTabKey] = useState("info");

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    console.log("error");
    return <div>Error: {error.message}</div>;
  }

  const { name, description, role, logoRef } = data.organization;

  return (
    <>
      <Layout>
        <Container className="mt-4" fluid>
          <Row className="mb-3">
            <Col>
              <Header name={name} logoRef={logoRef} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Tabs
                activeKey={tabKey}
                onSelect={(newTabKey) => {
                  setTabKey(newTabKey);
                }}
              >
                <Tab eventKey="info" title="Info">
                  <Container fluid className="mt-2">
                    <Quill
                      value={description}
                      modules={{ toolbar: false }}
                      readOnly
                    />
                  </Container>
                </Tab>
                <Tab eventKey="accepted" title="Accepted Articles">
                  <ArticlesPane id={id} />
                </Tab>
                {role === RoleEnum.ADMIN ? (
                  <Tab eventKey="createVenue" title="Create Venue">
                    <ArticlesPane id={id} />
                  </Tab>
                ) : null}
              </Tabs>
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  );
}

export default withApollo(Organization);
