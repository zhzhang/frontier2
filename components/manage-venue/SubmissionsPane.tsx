import ArticleCard, { ARTICLE_CARD_FIELDS } from "@/components/ArticleCard";
import Spinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import { USER_CARD_FIELDS } from "@/components/UserCard";
import { useQuery } from "@apollo/react-hooks";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";
import UserDetailsCard from "../UserDetailsCard";

const SubmissionsQuery = gql`
  ${ARTICLE_CARD_FIELDS}
  ${USER_CARD_FIELDS}
  query SubmissionsQuery($where: SubmissionWhereInput!) {
    submissions(where: $where) {
      id
      createdAt
      owner {
        id
        name
      }
      article {
        ...ArticleCardFields
      }
      reviewRequests {
        user {
          ...UserCardFields
        }
        submission {
          venue {
            id
            name
          }
        }
      }
    }
  }
`;

function SubmissionCard({
  submission,
  selectedSubmission,
  setSelectedSubmission,
}) {
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
      <ArticleCard key={submission.id} article={submission.article} />
      <Typography>Assigned chair: {submission.owner}</Typography>
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

function AssignOwner({ submission, venueId }) {
  const { loading, error, data } = useQuery(ActionEditorsQuery, {
    variables: { venueId },
  });
  if (loading) {
    return <Skeleton variant="text" />;
  }
  return (
    <Box>
      {data.submissionOwnerCandidates.map((user) => (
        <UserDetailsCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

function ActionPane({ submission, venueId }) {
  if (!submission) {
    return <Typography>Select a submission to proceed.</Typography>;
  }
  if (!submission.owner) {
    return (
      <Box>
        <Typography variant="h5">Assign an owner</Typography>
        <AssignOwner submission={submission} venueId={venueId} />
      </Box>
    );
  }
}

export default function SubmissionsPane({ id }) {
  const { loading, error, data } = useQuery(SubmissionsQuery, {
    variables: { where: { venueId: { equals: id } } },
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
  const submissions = data.submissions;
  if (submissions.length === 0) {
    return <Grid item>There are currently no submissions.</Grid>;
  }
  return (
    <Grid item container spacing={3}>
      <Grid item sm={6}>
        <Typography>
          Show owner assigned, in review, completed, unreleased.
        </Typography>
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
          />
        ))}
      </Grid>
      <Grid item sm={6}>
        <ActionPane venueId={id} submission={selectedSubmission} />
      </Grid>
    </Grid>
  );
}
