import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Markdown from "../../components/Markdown";
import PdfViewer from "../../components/PDFViewer";
import Spinner from "../../components/CenteredSpinner";
import UserBadge from "../../components/UserBadge";
import Reviews from "../../components/article/Reviews";

import Accordion from "react-bootstrap/Accordion";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import OrganizationBadge from "../../components/OrganizationBadge";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import dateFormat from "dateformat";
import _ from "lodash";

const ArticleQuery = gql`
  query ArticleQuery($id: String!) {
    article(id: $id) {
      id
      title
      authors {
        id
        name
      }
      versions {
        id
        abstract
        ref
        versionNumber
        createdAt
      }
      acceptedOrganizations {
        id
        name
      }
    }
  }
`;

function Article() {
  const { id, reviewId, version } = useRouter().query;
  const { loading, error, data } = useQuery(ArticleQuery, {
    variables: { id },
  });
  const [selectedVersionNumber, setVersionNumber] = useState(-1);
  const [abstractOpen, setAbstractOpen] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [onRenderedCallback, setRenderedCallback] = useState();
  const [scrollTo, setScrollTo] = useState();

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { title, authors, versions, acceptedOrganizations } = data.article;
  const selectedVersion =
    selectedVersionNumber === -1
      ? versions[0]
      : _.find(versions, function (o) {
          return o.versionNumber == selectedVersionNumber;
        });
  const { abstract, ref } = selectedVersion;

  const updateArticleAndScroll = (versionNumber, highlights, highlight) => {
    if (selectedVersion.versionNumber === versionNumber) {
      setHighlights(highlights);
      scrollTo(highlight);
    } else {
      setVersionNumber(versionNumber);
      setHighlights(highlights);
      const onRenderedCallback = (viewer) => {
        console.log("hit");
        viewer.scrollTo(highlight);
        setRenderedCallback(null);
      };
      setRenderedCallback(() => onRenderedCallback);
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex" }}>
        <div
          style={{
            minWidth: 400,
            flex: 4,
            width: "auto",
            overflowY: "scroll",
            height: "calc(100vh - 55px)",
          }}
        >
          <Container fluid style={{ paddingTop: 10 }}>
            <h5>{title}</h5>
            <span>
              Authors:{" "}
              {authors !== null ? (
                authors.map((author) => (
                  <UserBadge user={author} key={author.id} />
                ))
              ) : (
                <em>anonymized</em>
              )}
            </span>
            <div className="mt-2 mb-2">
              <DropdownButton
                title={`Version ${selectedVersion.versionNumber} - ${dateFormat(
                  new Date(parseInt(selectedVersion.createdAt)),
                  "mmm d, yyyy"
                )}`}
                as={ButtonGroup}
                variant="secondary"
                size="sm"
                style={{ width: "100%" }}
                onSelect={(versionNumber) => setVersionNumber(versionNumber)}
              >
                {versions.map((version) => (
                  <Dropdown.Item
                    eventKey={version.versionNumber}
                    key={version.id}
                  >{`Version ${version.versionNumber} - ${dateFormat(
                    new Date(parseInt(version.createdAt)),
                    "mmm d, yyyy"
                  )}`}</Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            <Accordion activeKey={abstractOpen ? "0" : null}>
              <Card>
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey="0"
                  onClick={() => setAbstractOpen(!abstractOpen)}
                >
                  Abstract
                  <span style={{ float: "right" }}>
                    {abstractOpen ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0" className="m-2">
                  <Markdown>{abstract}</Markdown>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            {acceptedOrganizations ? (
              <span>
                Accepted by:{" "}
                {acceptedOrganizations.map((organization) => (
                  <OrganizationBadge
                    organization={organization}
                    key={organization.id}
                  />
                ))}
              </span>
            ) : null}
            <br />
            <br />
            <h5>Reviews</h5>
            <Reviews
              articleId={id}
              articleVersion={selectedVersion.versionNumber}
              highlights={highlights}
              updateArticleAndScroll={updateArticleAndScroll}
            />
          </Container>
        </div>
        <PdfViewer
          fileRef={ref}
          highlights={highlights}
          setHighlights={setHighlights}
          articleVersion={selectedVersion.versionNumber}
          onRenderedCallback={onRenderedCallback}
          setScrollTo={setScrollTo}
        />
      </div>
    </Layout>
  );
}

export default withApollo(Article);
