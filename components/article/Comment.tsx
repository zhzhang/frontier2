import AuthorPopover from "@/components/AuthorPopover";
import Markdown from "@/components/Markdown";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import Thread from "@/components/Thread";
import { useMutation } from "@apollo/react-hooks";
import { createStyles, makeStyles, Theme } from "@mui/material/styles";
import gql from "graphql-tag";
import { useState } from "react";

const UpdateReviewMutation = gql`
  mutation UpdateReviewMutation(
    $id: String!
    $body: String!
    $rating: Int!
    $published: Boolean!
  ) {
    updateReview(id: $id, body: $body, rating: $rating, published: $published) {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    review: {
      display: "flex",
      marginTop: theme.spacing(2),
    },
    picture: {
      marginRight: theme.spacing(1),
    },
  })
);

function Rating({ rating }) {
  switch (rating) {
    case 0:
      return <span>Strong Reject</span>;
    case 1:
      return <span>Reject</span>;
    case 2:
      return <span>Accept</span>;
    case 3:
      return <span>Strong Accept</span>;
  }
}

export default function Comment({
  comment,
  editing,
  startOpen,
  updateArticleAndScroll,
  articleMode,
}) {
  const classes = useStyles();
  const { highlights } = comment;
  const [body, setBody] = useState(comment.body);
  const [updateReview, { loading, error, data }] =
    useMutation(UpdateReviewMutation);
  return (
    <>
      <div className={classes.review}>
        <div className={classes.picture}>
          <ProfilePicturePopover user={comment.author} />
        </div>
        <div>
          <AuthorPopover user={comment.author} />
          <Markdown
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {body}
          </Markdown>
        </div>
      </div>
      <Thread headId={comment.id} />
    </>
  );
}
