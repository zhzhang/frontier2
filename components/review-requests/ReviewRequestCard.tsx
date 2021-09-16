import ArticleCard from "@/components/ArticleCard";
import { useMutation } from "@apollo/react-hooks";
import Card from "@material-ui/core/Card";
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

export default function ReviewRequestCard({ request }) {
  const classes = useStyles();
  const { id, article } = request;
  const [reviewers, setReviewers] = useState([]);
  const [requestReviewers, { loading, error, data }] = useMutation(
    RequestReviewersMutation
  );

  return (
    <Card className={classes.card}>
      <Grid container spacing={2}>
        <Grid item>
          <ArticleCard article={article} />
        </Grid>
      </Grid>
    </Card>
  );
}
