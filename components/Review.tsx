import AuthorPopover from "@/components/AuthorPopover";
import Thread from "@/components/Thread";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import { updateArticleAndScroll } from "./article/vars";
import Markdown from "./Markdown";
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

const Review = ({ review }) => {
  const classes = useStyles();
  const { highlights, body } = review;
  return (
    <>
      <div className={classes.review}>
        <div className={classes.picture}>
          <ProfilePicturePopover user={review.author} />
        </div>
        <div>
          <AuthorPopover user={review.author} />
          <Markdown
            highlights={highlights}
            updateArticleAndScroll={updateArticleAndScroll}
          >
            {body}
          </Markdown>
        </div>
      </div>
      <Thread headId={review.id} />
    </>
  );
};

export default Review;
