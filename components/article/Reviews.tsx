import Spinner from "@/components/CenteredSpinner";
import MarkdownEditor from "@/components/MarkdownEditor";
import Review, { REVIEW_CARD_FIELDS } from "@/components/Review";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Button from "@mui/material/Button";
import gql from "graphql-tag";
import {
  addHighlightVar,
  articleVar,
  focusedEditorVar,
  highlightsVar,
  updateArticleAndScroll,
} from "./vars";

const ReviewsQuery = gql`
  ${REVIEW_CARD_FIELDS}
  query ReviewsQuery($where: ReviewWhereInput!) {
    reviews(where: $where) {
      ...ReviewCardFields
    }
    article @client
  }
`;

const UserReviewQuery = gql`
  ${REVIEW_CARD_FIELDS}
  query UserReviewQuery($userId: String!, $articleId: String!) {
    userReview(userId: $userId, articleId: $articleId) {
      ...ReviewCardFields
    }
    focusedEditor @client
  }
`;

const CreateReviewMutation = gql`
  ${REVIEW_CARD_FIELDS}
  mutation CreateReviewMutation($data: ReviewCreateInput!) {
    createOneReview(data: $data) {
      ...ReviewCardFields
    }
  }
`;

const DeleteReviewMutation = gql`
  mutation DeleteReviewMutation($where: ReviewWhereUniqueInput!) {
    deleteOneReview(where: $where) {
      id
    }
  }
`;

const UpdateReviewMutation = gql`
  ${REVIEW_CARD_FIELDS}
  mutation UpdateReviewMutation(
    $where: ReviewWhereUniqueInput!
    $data: ReviewUpdateInput!
  ) {
    updateOneReview(where: $where, data: $data) {
      ...ReviewCardFields
    }
  }
`;

function NewReviewButton({ userId, articleId }) {
  const [createReview, resp] = useMutation(CreateReviewMutation, {
    refetchQueries: ["UserReviewQuery"],
  });
  return (
    <Button
      variant="outlined"
      color="primary"
      sx={{
        mt: 1,
      }}
      onClick={async () => {
        createReview({
          variables: {
            data: {
              author: {
                connect: {
                  id: userId,
                },
              },
              article: {
                connect: {
                  id: articleId,
                },
              },
              body: "",
              highlights: [],
            },
          },
        });
      }}
    >
      Write Review
    </Button>
  );
}

function NewReview({ userId, articleId }) {
  const variables = { userId, articleId };
  const { loading, error, data } = useQuery(UserReviewQuery, {
    variables,
  });
  const [updateReview, updateResp] = useMutation(UpdateReviewMutation);
  const [deleteReview, deleteResp] = useMutation(DeleteReviewMutation);
  if (loading) {
    return <></>;
  }

  if (!data.userReview) {
    return <NewReviewButton articleId={articleId} userId={userId} />;
  }

  const review = data.userReview;

  if (review.published) {
    return null;
  }

  const update = (review) => {
    updateReview({
      variables: {
        where: {
          id: review.id,
        },
        data: {
          body: {
            set: review.body,
          },
          highlights: review.highlights,
        },
      },
      context: {
        debounceKey: review.id,
      },
    });
    apolloClient.writeQuery({
      query: UserReviewQuery,
      variables,
      data: {
        userReview: review,
      },
    });
  };
  const addHighlight = (highlight) => {
    const data = apolloClient.readQuery({
      query: UserReviewQuery,
      variables,
    });
    const review = data.userReview;
    const highlights = [...review.highlights, highlight];
    highlightsVar(highlights);
    update({ ...review, highlights });
  };
  const deleteHighlight = (id: number) => {
    update({
      ...review,
      highlights: _.reject(review.highlights, { id }),
    });
  };
  return (
    <>
      <MarkdownEditor
        articleMode
        body={review.body}
        highlights={review.highlights}
        deleteHighlight={deleteHighlight}
        focused={data.focusedEditor === review.id}
        onFocus={() => {
          focusedEditorVar(review.id);
          highlightsVar(review.highlights);
          addHighlightVar(addHighlight);
        }}
        onChange={(body) => {
          update({ ...review, body });
        }}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a review!"
        sx={{ mt: 1 }}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          onClick={() =>
            updateReview({
              variables: {
                where: {
                  id: review.id,
                },
                data: {
                  published: {
                    set: true,
                  },
                  publishTimestamp: {
                    set: new Date(Date.now()),
                  },
                },
              },
            })
          }
        >
          Publish
        </Button>
        <Button
          color="error"
          onClick={async () => {
            await deleteReview({
              variables: {
                where: {
                  id: review.id,
                },
              },
            });
            apolloClient.writeQuery({
              query: UserReviewQuery,
              variables,
              data: {
                userReview: null,
              },
            });
          }}
        >
          Delete
        </Button>
      </div>
    </>
  );
}

export default function Reviews() {
  const auth = useAuth();
  const article = articleVar();
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: {
      where: {
        articleId: { equals: article.id },
        published: {
          equals: true,
        },
      },
    },
  });
  if (loading) {
    return (
      <div className="mt-3">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const { reviews } = data;
  return (
    <>
      {auth.user && <NewReview userId={auth.user.uid} articleId={article.id} />}
      {reviews.map((review) => (
        <Review key={review.id} review={review} startOpen={true} articleMode />
      ))}
    </>
  );
}
