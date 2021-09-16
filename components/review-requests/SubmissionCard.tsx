import ArticleCard from "@/components/ArticleCard";
import UserChip from "@/components/UserChip";
import UserTypeahead from "@/components/UserTypeahead";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

const RequestReviewersMutation = gql`
  mutation AssignOwner($data: ReviewRequestCreateInput!) {
    createOneReviewRequest(data: $data) {
      id
      user {
        id
        name
      }
    }
  }
`;

export default function SubmissionCard({ submission, venueId }) {
  const classes = useStyles();
  const { id, owner, article, reviewRequests } = submission;
  const [reviewers, setReviewers] = useState([]);
  const [requestReviewers, { loading, error, data }] = useMutation(
    RequestReviewersMutation
  );

  const Assign = () => {
    if (owner) {
      return (
        <Grid item>
          <UserChip user={owner} />
        </Grid>
      );
    }
    const handleRequest = () => {
      reviewers.map((reviewer) =>
        requestReviewers({
          variables: {
            data: {
              user: {
                connect: {
                  id: reviewer.id,
                },
              },
              article: {
                connect: {
                  id: article.id,
                },
              },
              submission: {
                connect: {
                  id,
                },
              },
              status: "REQUESTED",
            },
          },
        })
      );
    };
    return (
      <>
        <Grid item xs={10}>
          <UserTypeahead
            multiple
            id="select-editor"
            label="Request reviewers..."
            venueId={venueId}
            selected={reviewers}
            onChange={(_, selected) => {
              setReviewers(selected);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button color="primary" variant="contained" onClick={handleRequest}>
            Request
          </Button>
        </Grid>
        <Grid item xs={12}>
          {reviewRequests.map((request) => request.user.name)}
        </Grid>
      </>
    );
  };
  return (
    <Card className={classes.card}>
      <Grid container spacing={2}>
        <Grid item>
          <ArticleCard article={article} />
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Assign />
      </Grid>
    </Card>
  );
}
