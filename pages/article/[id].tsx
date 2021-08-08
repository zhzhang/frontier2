import DiscussionSidebar from "@/components/article/DiscussionSidebar";
import Authors from "@/components/Authors";
import Editor, { deserialize } from "@/components/editor/Editor";
import Error from "@/components/Error";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import PdfViewer from "@/components/PDFViewer";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import MuiAccordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import dateFormat from "dateformat";
import gql from "graphql-tag";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
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

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    height: 38,
    "&$expanded": {
      height: 38,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginTop: theme.spacing(1),
    },
    discussionPane: {
      height: "calc(100vh - 50px)",
      overflowY: "scroll",
      padding: theme.spacing(2),
    },
    articlePane: {
      height: "calc(100vh - 50px)",
      overflowY: "scroll",
    },
  })
);

function Article() {
  const classes = useStyles();
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
        <Error>Error fetching article.</Error>
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
    <Layout padded={false}>
      <SplitPane split="vertical" defaultSize={50}>
        <Pane initialSize="40%" minSize="20%" className={classes.sidebar}>
          <div className={classes.discussionPane}>
            <Typography variant="h6">{title}</Typography>
            <Authors authors={authors} className={classes.margin} />
            <Select
              variant="outlined"
              fullWidth
              value={selectedVersion.versionNumber}
              onChange={({ target }) => setVersionNumber(target.value)}
              className={classes.margin}
            >
              {versions.map((version) => (
                <MenuItem value={version.versionNumber}>{`Version ${
                  version.versionNumber
                } - ${dateFormat(
                  new Date(parseInt(version.createdAt)),
                  "mmm d, yyyy"
                )}`}</MenuItem>
              ))}
            </Select>
            <Accordion className={classes.margin}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Abstract</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Editor editorState={deserialize(abstract)} />
              </AccordionDetails>
            </Accordion>
            <DiscussionSidebar
              articleId={id}
              articleVersion={selectedVersion.versionNumber}
              highlights={highlights}
              updateArticleAndScroll={updateArticleAndScroll}
            />
          </div>
        </Pane>
        <div className={classes.articlePane}>
          <PdfViewer
            fileRef={ref}
            highlights={highlights}
            setHighlights={setHighlights}
            articleVersion={selectedVersion.versionNumber}
            onRenderedCallback={onRenderedCallback}
            setScrollTo={setScrollTo}
            editing={editing}
          />
        </div>
      </SplitPane>
    </Layout>
  );
}

export default withApollo(Article);
