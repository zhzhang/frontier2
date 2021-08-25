import MarkdownEditor from "@/components/MarkdownEditor";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import { useState } from "react";
import CenteredSpinner from "../CenteredSpinner";
import Comment from "./Comment";

const CommentsQuery = gql`
  query CommentsQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      id
      author {
        id
        name
      }
      body
      highlights
    }
  }
`;

const CreateCommentMutation = gql`
  mutation CreateCommentMutation($data: ThreadMessageCreateInput!) {
    createOneThreadMessage(data: $data) {
      id
      body
      highlights
    }
  }
`;

function NewComment({ userId, articleId, highlights, updateArticleAndScroll }) {
  const { loading, error, data } = useQuery(CommentsQuery, {
    variables: {
      where: {
        // authorId: { equals: userId },
        AND: [
          { articleId: { equals: articleId } },
          { published: { equals: true } },
          { headId: { equals: null } },
        ],
      },
    },
  });
  const [createComment, result] = useMutation(CreateCommentMutation);
  const [body, setBody] = useState("");

  const handleCreate = () => {
    createComment({
      variables: {
        data: {
          body,
          articleId,
          highlights: JSON.stringify(highlights),
          published: true,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
    });
  };

  if (loading) {
    return <CenteredSpinner />;
  }
  return (
    <>
      <MarkdownEditor
        articleMode
        body={body}
        highlights={highlights}
        onChange={(body) => setBody(body)}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a comment!"
      />
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Comment
      </Button>
      {data.threadMessages.map((message) => (
        <Comment
          comment={message}
          updateArticleAndScroll={updateArticleAndScroll}
        />
      ))}
    </>
  );
}

export default function Comments({
  articleId,
  highlights,
  updateArticleAndScroll,
}) {
  const { user, loading } = useAuth();
  if (loading) {
    return null;
  }

  return (
    <NewComment
      userId={user.uid}
      articleId={articleId}
      highlights={highlights}
      updateArticleAndScroll={updateArticleAndScroll}
    />
  );
}
