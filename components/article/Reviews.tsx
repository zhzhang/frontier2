import Spinner from "@/components/CenteredSpinner";
import MarkdownEditor from "@/components/MarkdownEditor";
import Review from "@/components/Review";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import { useState } from "react";

const ReviewsQuery = gql`
  query ReviewsQuery($where: ReviewWhereInput!) {
    reviews(where: $where) {
      id
      author {
        id
        name
      }
      body
      highlights
      rating
    }
  }
`;

const UserReviewQuery = gql`
  query UserReviewQuery($userId: String!, $articleId: String!) {
    userReview(userId: $userId, articleId: $articleId) {
      id
      body
      highlights
      rating
    }
  }
`;

const CreateReviewMutation = gql`
  mutation UpsertReviewMutation($data: ReviewCreateInput!) {
    createOneReview(data: $data) {
      id
      body
      highlights
      rating
    }
  }
`;

function NewReview({
  userId,
  articleId,
  setAddHighlight,
  updateArticleAndScroll,
}) {
  const variables = { userId, articleId };
  const { loading, error, data } = useQuery(UserReviewQuery, {
    variables,
  });
  const [createReview, resp] = useMutation(CreateReviewMutation, {
    refetchQueries: ["UserReviewQuery"],
  });
  const [previewOpen, setPreviewOpen] = useState(true);
  if (!(data && data.userReview)) {
    return (
      <Button
        variant="outlined"
        color="primary"
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

  if (loading) {
    return <></>;
  }
  const review = data.userReview;
  console.log(review);

  const update = (review) =>
    apolloClient.writeQuery({
      query: UserReviewQuery,
      variables,
      data: {
        userReview: review,
      },
    });
  const addHighlight = (highlight) => {
    console.log(review.highlights);
    console.log(highlight);
    console.log([...review.highlights, highlight]);
    console.log("-----------");
    update({ ...review, highlights: [...review.highlights, highlight] });
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
        onFocus={() => {
          setAddHighlight(() => addHighlight);
        }}
        onChange={(body) => {
          update({ ...review, body });
        }}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a review!"
      />
    </>
  );
}

export default function Reviews({
  articleId,
  updateArticleAndScroll,
  articleVersion,
  setAddHighlight,
}) {
  const auth = useAuth();
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: { where: { articleId: { equals: articleId } } },
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
      {auth.user && (
        <NewReview
          userId={auth.user.uid}
          articleId={articleId}
          setAddHighlight={setAddHighlight}
          updateArticleAndScroll={updateArticleAndScroll}
        />
      )}
      {reviews.map((review) => (
        <div className="pb-2" key={review.id}>
          <Review
            review={review}
            startOpen={true}
            updateArticleAndScroll={updateArticleAndScroll}
            articleMode
          />
        </div>
      ))}
    </>
  );
}
