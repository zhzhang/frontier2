import DiscussionSidebar from "@/components/article/DiscussionSidebar";
import {
  addHighlightVar,
  articleVar,
  focusedEditorVar,
  highlightsVar,
  onRenderedCallbackVar,
  selectedVersionVar,
  selectVersion,
  threadRepliesVar,
  viewerVar,
} from "@/components/article/vars";
import Authors from "@/components/Authors";
import Error from "@/components/Error";
import Spinner from "@/components/FixedSpinner";
import Layout from "@/components/Layout";
import Markdown from "@/components/Markdown";
import PdfViewer from "@/components/PDFViewer";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { withApollo } from "@/lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import gql from "graphql-tag";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "4px",
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowDropDown />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  borderRadius: "2px",
}));

const ArticleQuery = gql`
  ${USER_CARD_FIELDS}
  query ArticleQuery($id: String!) {
    article(where: { id: $id }) {
      id
      title
      authors {
        ...UserCardFields
      }
      versions {
        id
        abstract
        ref
        versionNumber
        createdAt
      }
    }
  }
`;

function Index() {
  const { id, reviewId, version } = useRouter().query;
  const { loading, error, data } = useQuery(ArticleQuery, {
    variables: { id },
  });
  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  } else if (error) {
    return (
      <Layout>
        <Error>Error fetching article.</Error>
      </Layout>
    );
  }
  console.log(data.article);
  const { versions } = data.article;
  const selectedVersion = !version
    ? _.maxBy(versions, "createdAt")
    : _.find(versions, function (o) {
        return o.versionNumber === version;
      });
  articleVar(data.article);
  selectedVersionVar(selectedVersion);
  return <ArticleView />;
}

function ArticleView() {
  const [paneSize, setPaneSize] = useState(50);

  return (
    <Layout padded={false}>
      <Box sx={{ height: "calc(100vh - 48px)" }}>
        <SplitPane
          split="vertical"
          defaultSize={50}
          onChange={(size) => setPaneSize(size)}
        >
          <Pane
            initialSize="40%"
            minSize="20%"
            maxSize="80%"
            size={paneSize[0]}
          >
            <LeftPane />
          </Pane>
          <PdfViewerWrapper />
        </SplitPane>
      </Box>
    </Layout>
  );
}

const LocalVarsQuery = gql`
  query LocalVarsQuery {
    highlights @client
    addHighlight @client
    selectedVersion @client
    article @client
    onRenderedCallback @client
  }
`;

function LeftPane() {
  const { data, error } = useQuery(LocalVarsQuery);
  if (!data) {
    return null;
  }
  const { title, authors, versions } = data.article;
  const { selectedVersion } = data;
  return (
    <Box sx={{ margin: 1, height: "calc(100vh - 56px)", overflowY: "scroll" }}>
      <Typography variant="h6">{title}</Typography>
      <Authors authors={authors} />
      <FormControl fullWidth sx={{ mt: 1 }}>
        <Select
          value={selectedVersion.versionNumber}
          onChange={({ target }) => selectVersion(target.value)}
        >
          {versions.map((version) => (
            <MenuItem
              key={version.versionNumber}
              value={version.versionNumber}
            >{`Version ${version.versionNumber} - ${dateFormat(
              new Date(version.createdAt),
              "mmm d, yyyy"
            )}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Accordion sx={{ marginTop: 1 }}>
        <AccordionSummary aria-controls="panel1a-content">
          <Typography>Abstract</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Markdown>{selectedVersion.abstract}</Markdown>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ mt: 1, mb: 1 }}>
        <DiscussionSidebar />
      </Box>
    </Box>
  );
}

function PdfViewerWrapper() {
  const { loading, data } = useQuery(LocalVarsQuery);
  if (loading) {
    return null;
  }
  const { highlights, addHighlight, selectedVersion, onRenderedCallback } =
    data;
  return (
    <PdfViewer
      fileRef={selectedVersion.ref}
      highlights={highlights}
      addHighlight={addHighlight}
      articleVersion={selectedVersion.versionNumber}
      onRenderedCallback={onRenderedCallback}
      setViewer={viewerVar}
    />
  );
}

export default withApollo(Index, {
  Query: {
    fields: {
      highlights: {
        read() {
          return highlightsVar();
        },
      },
      addHighlight: {
        read() {
          return addHighlightVar();
        },
      },
      selectedVersion: {
        read() {
          return selectedVersionVar();
        },
      },
      onRenderedCallback: {
        read() {
          return onRenderedCallbackVar();
        },
      },
      article: {
        read() {
          return articleVar();
        },
      },
      threadReplies: {
        read() {
          return threadRepliesVar();
        },
      },
      focusedEditor: {
        read() {
          return focusedEditorVar();
        },
      },
    },
  },
});
