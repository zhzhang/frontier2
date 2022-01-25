import CenteredSpinner from "@/components/CenteredSpinner";
import DeclineRequest from "@/components/DeclineRequest";
import Error from "@/components/Error";
import OrDivider from "@/components/OrDivider";
import ReviewerSearch from "@/components/ReviewerSearch";
import ReviewRequestActionsPane from "@/components/ReviewRequestActionsPane";
import ReviewRequestCard, {
  REVIEW_REQUEST_CARD_FIELDS,
} from "@/components/ReviewRequestCard";
import { CreateThreadMessage } from "@/components/Thread";
import UserDetailsCard from "@/components/UserDetailsCard";
import { ReviewRequestTypeEnum, ThreadMessageTypeEnum } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import { useState } from "react";

const RequestsQuery = gql`
  ${REVIEW_REQUEST_CARD_FIELDS}
  query RequestsQuery($userId: String!) {
    userRequests(userId: $userId) {
      ...ReviewRequestCardFields
    }
  }
`;

const ChairRequestReviewMutation = gql`
  ${REVIEW_REQUEST_CARD_FIELDS}
  mutation AssignOwnerMutation($input: ChairRequestReviewInput!) {
    chairRequestReview(input: $input) {
      ...ReviewRequestCardFields
    }
  }
`;

function ChairActionPane({ articleId, request }) {
  const [options, setOptions] = useState([]);
  const [requestReview, _] = useMutation(ChairRequestReviewMutation);
  const [createThreadMessage, { loading, error, data }] =
    useMutation(CreateThreadMessage);
  const onRequest = (id) => {
    requestReview({
      variables: {
        input: {
          userId: id,
          parentRequestId: request.id,
        },
      },
    });
  };
  return (
    <>
      <Typography variant="h6">Request Reviews</Typography>
      <ReviewerSearch
        articleId={articleId}
        setOptions={setOptions}
        sx={{ mt: 1 }}
      />
      <Box sx={{ mt: 1 }}>
        {options.map((user) => (
          <UserDetailsCard user={user} onRequest={onRequest} />
        ))}
      </Box>
      <OrDivider sx={{ mt: 1, mb: 0.5 }} />
      <Box sx={{ display: "flex" }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Write Decision
        </Typography>
        <Button
          color="primary"
          onClick={async () => {
            await createThreadMessage({
              variables: {
                input: {
                  type: ThreadMessageTypeEnum.DECISION,
                  articleId,
                  venueId: request.venue.id,
                },
              },
            });
            window.location.href = `/article/${articleId}`;
          }}
        >
          Begin
        </Button>
      </Box>
      <OrDivider sx={{ mt: 1, mb: 0.5 }} />
      <DeclineRequest request={request} />
    </>
  );
}

function ReviewActionPane({ articleId, request }) {
  const [createThreadMessage, { loading, error, data }] =
    useMutation(CreateThreadMessage);

  return (
    <>
      <Box sx={{ display: "flex", mt: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Write Review
        </Typography>
        <Button
          color="primary"
          onClick={async () => {
            await createThreadMessage({
              variables: {
                input: {
                  type: ThreadMessageTypeEnum.REVIEW,
                  articleId,
                  venueId: request.venue.id,
                },
              },
            });
            window.location.href = `/article/${articleId}`;
          }}
        >
          Begin
        </Button>
      </Box>
      <OrDivider sx={{ mt: 1, mb: 0.5 }} />
      <DeclineRequest request={request} />
    </>
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
  if (requests.length === 0) {
    return <Typography>No pending requests!</Typography>;
  }
  const selected = selectedRequest || requests[0];
  return (
    <Grid item container spacing={3}>
      <Grid item sm={6}>
        {requests.map((request) => (
          <ReviewRequestCard
            reviewRequest={request}
            selectedRequest={selected}
            setSelectedRequest={setSelectedRequest}
          />
        ))}
      </Grid>
      <Grid item sm={6}>
        <ReviewRequestActionsPane article={selected?.article}>
          {selected.type === ReviewRequestTypeEnum.CHAIR && (
            <ChairActionPane
              articleId={selected?.article.id}
              request={selected}
            />
          )}
          {selected.type === ReviewRequestTypeEnum.REVIEW && (
            <ReviewActionPane
              articleId={selected?.article.id}
              request={selected}
            />
          )}
        </ReviewRequestActionsPane>
      </Grid>
    </Grid>
  );
}
