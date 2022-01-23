import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { PdfAnnotator } from "@/components/pdf-annotator";
import ReviewRequestCard, {
  REVIEW_REQUEST_CARD_FIELDS,
} from "@/components/ReviewRequestCard";
import { useRef } from "@/lib/firebase";
import * as pdfjs from "@/lib/pdfjs";
import { useQuery } from "@apollo/react-hooks";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import gql from "graphql-tag";
import { useEffect, useState } from "react";

const RequestsQuery = gql`
  ${REVIEW_REQUEST_CARD_FIELDS}
  query RequestsQuery($userId: String!) {
    userRequests(userId: $userId) {
      ...ReviewRequestCardFields
    }
  }
`;

function AssignOwner({ submission, venueId }) {
  const { loading, error, data } = useQuery(ActionEditorsQuery, {
    variables: { venueId },
  });
  const [assignOwner, _] = useMutation(AssignOwnerMutation);
  if (loading) {
    return <Skeleton variant="text" />;
  }
  const onAssign = (id) => {
    assignOwner({
      variables: {
        input: {
          ownerId: id,
          submissionId: submission.id,
        },
      },
    });
  };
  return (
    <Box>
      {data.submissionOwnerCandidates.map((user) => (
        <UserDetailsCard key={user.id} user={user} onAssign={onAssign} />
      ))}
    </Box>
  );
}

function ActionPane({ selectedRequest }) {
  const [tab, setTab] = useState("0");
  const [document, setDocument] = useState(null);
  const ref = selectedRequest.article.latestVersion.ref;
  const file = useRef(ref);
  useEffect(() => {
    if (file) {
      const loadingTask = pdfjs.getDocument(file);
      loadingTask.promise.then((pdfDocument) => {
        setDocument(pdfDocument);
      });
    }
  }, [file]);

  const handleChange = (_event, newValue) => {
    setTab(newValue);
  };
  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Article" value="0" />
          <Tab label="Request Reviews" value="1" />
          <Tab label="Decline" value="2" />
        </TabList>
      </Box>
      <TabPanel value="0">
        {document ? (
          <PdfAnnotator
            document={document}
            sx={{
              height: "calc(100vh - 180px)",
              position: "relative",
              overflow: "auto",
            }}
          />
        ) : (
          <CenteredSpinner />
        )}
      </TabPanel>
      <TabPanel value="1">Item One</TabPanel>
      <TabPanel value="2">Item Two</TabPanel>
    </TabContext>
  );
}

export default function Requests({ userId }) {
  const { loading, error, data } = useQuery(RequestsQuery, {
    variables: {
      userId,
    },
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  if (loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return <Error>{error.message}</Error>;
  }
  const requests = data.userRequests;
  return (
    <Grid item container spacing={3}>
      <Grid item sm={6}>
        {requests.map((request) => (
          <ReviewRequestCard
            reviewRequest={request}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
          />
        ))}
      </Grid>
      <Grid item sm={6}>
        {selectedRequest && <ActionPane selectedRequest={selectedRequest} />}
      </Grid>
    </Grid>
  );
}
