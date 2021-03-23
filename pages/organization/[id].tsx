import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Error from "../../components/Error";
import { useAuth } from "../../lib/firebase";
import { useRef } from "../../lib/firebase";
import Spinner from "../../components/CenteredSpinner";
import ArticlesPane from "../../components/organization/ArticlesPane";
import VenuesPane from "../../components/organization/VenuesPane";
import InfoPane from "../../components/organization/InfoPane";
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
  const router = useRouter();
  const id = router.query.id;
  const view = router.query.view ? router.query.view : "info";
  const { loading, error, data } = useQuery(OrganizationQuery, {
    variables: { id },
  });

  if (loading) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return (
      <div className="m-4">
        <Error header={"Error loading this organization."} />
      </div>
    );
  }

  const { name, description, role, logoRef } = data.organization;

  return (
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
              activeKey={view}
              onSelect={(newTabKey) => {
                router.query.view = newTabKey;
                router.push(router, undefined, { shallow: true });
              }}
            >
              <Tab eventKey="info" title="Info">
                <InfoPane id={id} description={description} role={role} />
              </Tab>
              <Tab eventKey="venues" title="Venues">
                <VenuesPane id={id} />
              </Tab>
              <Tab eventKey="accepted" title="Accepted Articles">
                <ArticlesPane id={id} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default withApollo(Organization);
