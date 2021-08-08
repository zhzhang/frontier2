import AuthorPopover from "@/components/AuthorPopover";
import Thread from "@/components/Thread";
import { useMutation } from "@apollo/react-hooks";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { useState } from "react";
import Editor, { deserialize } from "./editor/Editor";
import ProfilePicturePopover from "./ProfilePicturePopover";

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
    },
    picture: {
      margin: theme.spacing(1),
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

const Review = ({
  review,
  editing,
  startOpen,
  updateArticleAndScroll,
  articleMode,
}) => {
  const classes = useStyles();
  const { highlights } = review;
  const [body, setBody] = useState(review.body);
  const [updateReview, { loading, error, data }] =
    useMutation(UpdateReviewMutation);
  return (
    <>
      <div className={classes.review}>
        <div className={classes.picture}>
          <ProfilePicturePopover user={review.author} />
        </div>
        <div>
          <AuthorPopover user={review.author} />
          <Editor editorState={deserialize(body)} />
        </div>
      </div>
      <Thread headId={review.id} />
    </>
  );
};

export default Review;
