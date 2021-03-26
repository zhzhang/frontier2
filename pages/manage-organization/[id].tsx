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
import VenuesPane from "../../components/manage-organization/VenuesPane";
import SubmissionsPane from "../../components/manage-organization/SubmissionsPane";
import AdminsPane from "../../components/manage-organization/AdminsPane";
import EditorsPane from "../../components/manage-organization/EditorsPane";
import InfoPane from "../../components/manage-organization/InfoPane";
import { RoleEnum } from "../../lib/types";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Tabs from "react-bootstrap/Tabs";
import Nav from "react-bootstrap/Nav";
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
      <Container fluid className="mt-3">
        <Header name={name} logoRef={logoRef} />
      </Container>
      <Container fluid className="mt-3">
        <Tab.Container
          id="left-tabs-example"
          activeKey={view}
          onSelect={(newTabKey) => {
            router.query.view = newTabKey;
            router.push(router, undefined, { shallow: true });
          }}
        >
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="info">Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="submissions">Submissions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="editors">Action Editors</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="admins">Admins</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="info">
                  <InfoPane id={id} description={description} />
                </Tab.Pane>
                <Tab.Pane eventKey="admins">
                  <AdminsPane id={id} />
                </Tab.Pane>
                <Tab.Pane eventKey="editors">
                  <EditorsPane id={id} />
                </Tab.Pane>
                <Tab.Pane eventKey="submissions">
                  <SubmissionsPane id={id} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
}

export default withApollo(Organization);
