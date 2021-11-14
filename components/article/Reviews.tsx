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

function NewReview({ userId, articleId }) {
  const variables = { userId, articleId };
  const { loading, error, data } = useQuery(UserReviewQuery, {
    variables,
  });
  const [createReview, resp] = useMutation(CreateReviewMutation, {
    refetchQueries: [UserReviewQuery, "UserReviewQuery"],
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
  console.log(data);
  return (
    <>
      <MarkdownEditor
        articleMode
        body={data.userReview.body}
        highlights={data.userReview.highlights}
        onChange={(body) => {
          apolloClient.writeQuery({
            query: UserReviewQuery,
            variables,
            data: {
              userReview: {
                ...data.userReview,
                body,
              },
            },
          });
          // console.log(
          //   apolloClient.readQuery({
          //     query: UserReviewQuery,
          //     variables,
          //   })
          // );
        }}
        updateArticleAndScroll={null}
        placeholder="Write a comment!"
      />
    </>
  );
}

export default function Reviews({
  articleId,
  updateArticleAndScroll,
  articleVersion,
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
      {auth.user && <NewReview userId={auth.user.uid} articleId={articleId} />}
      {reviews.map((review) => (
        <div className="pb-2" key={review.id}>
          <Review
            review={review}
            editing={false}
            startOpen={true}
            updateArticleAndScroll={updateArticleAndScroll}
            articleMode
          />
        </div>
      ))}
    </>
  );
}
