import DiscussionSidebar from "@/components/article/DiscussionSidebar";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Layout from "@/components/Layout";
import Markdown from "@/components/Markdown";
import PdfViewer from "@/components/PDFViewer";
import UserBadge from "@/components/UserBadge";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import dateFormat from "dateformat";
import gql from "graphql-tag";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

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
  const [editing, setEditing] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [onRenderedCallback, setRenderedCallback] = useState();
  const [scrollTo, setScrollTo] = useState();

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <Error header="Error fetching article." />
      </Layout>
    );
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
        viewer.scrollTo(highlight);
        setRenderedCallback(null);
      };
      setRenderedCallback(() => onRenderedCallback);
    }
  };

  return (
    <Layout>
      <SplitPane split="vertical" defaultSize={50}>
        <Pane initialSize="40%" minSize="20%">
          <Container
            className="pt-3"
            style={{
              height: "calc(100vh - 55px)",
              overflowY: "scroll",
            }}
          >
            <h5>{title}</h5>
            <span>
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
            <div className="mt-2">
              <DiscussionSidebar
                articleId={id}
                articleVersion={selectedVersion.versionNumber}
                highlights={highlights}
                updateArticleAndScroll={updateArticleAndScroll}
              />
            </div>
          </Container>
        </Pane>
        <PdfViewer
          fileRef={ref}
          highlights={highlights}
          setHighlights={setHighlights}
          articleVersion={selectedVersion.versionNumber}
          onRenderedCallback={onRenderedCallback}
          setScrollTo={setScrollTo}
          editing={editing}
        />
      </SplitPane>
    </Layout>
  );
}

export default withApollo(Article);
