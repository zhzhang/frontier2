import Spinner from "@/components/CenteredSpinner";
import MarkdownEditor from "@/components/MarkdownEditor";
import Review from "@/components/Review";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import {
  addHighlightVar,
  articleVar,
  highlightsVar,
  updateArticleAndScroll,
} from "./vars";

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
    article @client
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
  mutation CreateReviewMutation($data: ReviewCreateInput!) {
    createOneReview(data: $data) {
      id
      body
      highlights
      rating
    }
  }
`;

const UpdateReviewMutation = gql`
  mutation UpdateReviewMutation(
    $where: ReviewWhereUniqueInput!
    $data: ReviewUpdateInput!
  ) {
    updateOneReview(where: $where, data: $data) {
      id
      body
      highlights
      rating
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
  const [updateReview, resp] = useMutation(UpdateReviewMutation);
  if (loading) {
    return <></>;
  }

  if (!data.userReview) {
    return <NewReviewButton articleId={articleId} userId={userId} />;
  }

  const review = data.userReview;
  console.log(review);

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
    <MarkdownEditor
      articleMode
      body={review.body}
      highlights={review.highlights}
      deleteHighlight={deleteHighlight}
      onFocus={() => {
        highlightsVar(review.highlights);
        addHighlightVar(addHighlight);
      }}
      onChange={(body) => {
        update({ ...review, body });
      }}
      updateArticleAndScroll={updateArticleAndScroll}
      placeholder="Write a review!"
    />
  );
}

export default function Reviews({ articleId }) {
  const auth = useAuth();
  const article = articleVar();
  const { loading, error, data } = useQuery(ReviewsQuery, {
    variables: { where: { articleId: { equals: article.id } } },
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
        <div className="pb-2" key={review.id}>
          <Review review={review} startOpen={true} articleMode />
        </div>
      ))}
    </>
  );
}
