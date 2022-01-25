import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import AuthorPopover from "@/components/AuthorPopover";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import ReviewRequestActionsPane from "@/components/ReviewRequestActionsPane";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import UserDetailsCard from "@/components/UserDetailsCard";
import { ThreadMessageTypeEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import { REVIEW_REQUEST_CARD_FIELDS } from "../ReviewRequestCard";
import { CreateThreadMessage } from "../Thread";

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
        <Typography>
          Assigned to: <AuthorPopover author={chairRequest.user} />
        </Typography>
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
  const onRequest = (id) => {
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
        <UserDetailsCard key={user.id} user={user} onRequest={onRequest} />
      ))}
    </Box>
  );
}

function Actions({ submission, venueId }) {
  const [createThreadMessage, { loading, error, data }] =
    useMutation(CreateThreadMessage);
  if (!submission) {
    return <Typography>Select a submission to proceed.</Typography>;
  }
  // if (!submission.owner) {
  return (
    <Box>
      <Typography variant="h6">Select Chair</Typography>
      <AssignOwner submission={submission} venueId={venueId} />
      <Divider sx={{ mt: 1, mb: 0.5 }} />
      <Typography variant="h6">Write Decision</Typography>
      <Button
        color="primary"
        onClick={async () => {
          const articleId = submission.article.id;
          await createThreadMessage({
            variables: {
              input: {
                type: ThreadMessageTypeEnum.DECISION,
                articleId,
                venueId,
              },
            },
          });
          window.location.href = `/article/${articleId}`;
        }}
      >
        Begin
      </Button>
    </Box>
  );
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
        <ReviewRequestActionsPane article={selected?.article}>
          <Actions venueId={id} submission={selected} />
        </ReviewRequestActionsPane>
      </Grid>
    </Grid>
  );
}
