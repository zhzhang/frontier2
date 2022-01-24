import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import { REVIEW_REQUEST_CARD_FIELDS } from "../ReviewRequestCard";
import UserDetailsCard from "../UserDetailsCard";

const SUBMISSION_FIELDS = gql`
  ${ARTICLE_CARD_FIELDS}
  ${USER_CARD_FIELDS}
  ${REVIEW_REQUEST_CARD_FIELDS}
  fragment SubmissionFields on ReviewRequest {
    id
    createdAt
    chairRequest {
      ...ReviewRequestCardFields
    }
    article {
      ...ArticleCardFields
    }
  }
`;

const SubmissionsQuery = gql`
  ${SUBMISSION_FIELDS}
  query SubmissionsQuery($input: VenueReviewRequestsInput!) {
    venueReviewRequests(input: $input) {
      ...SubmissionFields
    }
  }
`;

function SubmissionCard({
  submission,
  selectedSubmission,
  setSelectedSubmission,
}) {
  const { id, chairRequest, article } = submission;
  let style = {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    m: "1px",
    p: 1,
    mb: 1,
  };
  const [hover, setHover] = useState(false);
  const selected =
    selectedSubmission && selectedSubmission.id === submission.id;
  if (selected || hover) {
    style.border = "2px solid rgba(0, 0, 0, 0.23)";
    style.m = 0;
    style.borderColor = "primary.main";
  }
  if (selected) {
    style.borderColor = "primary.main";
  } else if (hover) {
    style.borderColor = "black";
  }
  return (
    <Box
      sx={style}
      onClick={() => setSelectedSubmission(submission)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ArticleCard key={id} article={article} />
      {chairRequest && (
        <Typography>Assigned to: {chairRequest.user.name}</Typography>
      )}
    </Box>
  );
}

const ActionEditorsQuery = gql`
  ${USER_CARD_FIELDS}
  query ActionEditorsQuery($venueId: String!) {
    submissionOwnerCandidates(venueId: $venueId) {
      ...UserCardFields
    }
  }
`;

const AssignOwnerMutation = gql`
  ${SUBMISSION_FIELDS}
  mutation AssignOwnerMutation($input: AssignSubmissionInput!) {
    assignSubmissionOwner(input: $input) {
      ...SubmissionFields
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
          rootId: submission.id,
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

function ActionPane({ submission, venueId }) {
  if (!submission) {
    return <Typography>Select a submission to proceed.</Typography>;
  }
  // if (!submission.owner) {
  if (true) {
    return (
      <Box>
        <Typography variant="h5">Assign an owner</Typography>
        <AssignOwner submission={submission} venueId={venueId} />
      </Box>
    );
  }
  return null;
}

export default function SubmissionsPane({ id }) {
  const { loading, error, data } = useQuery(SubmissionsQuery, {
    variables: { input: { venueId: id } },
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  if (loading) {
    return <Spinner />;
  } else if (error) {
    return (
      <Grid item>
        <Error>
          There was a problem retrieving this organization's submissions.
        </Error>
      </Grid>
    );
  }
  const submissions = data.venueReviewRequests;
  if (submissions.length === 0) {
    return <Typography>There are currently no submissions.</Typography>;
  }
  const selected = selectedSubmission || submissions[0];
  return (
    <Grid container spacing={3}>
      <Grid item sm={6}>
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            selectedSubmission={selected}
            setSelectedSubmission={setSelectedSubmission}
          />
        ))}
      </Grid>
      <Grid item sm={6}>
        <ActionPane venueId={id} submission={selected} />
      </Grid>
    </Grid>
  );
}
