import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@mui/material/Button";
import gql from "graphql-tag";
import { useState } from "react";
import { USER_CARD_FIELDS } from "../UserCard";
import Comment from "./Comment";

const CommentsQuery = gql`
  ${USER_CARD_FIELDS}
  query CommentsQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      id
      author {
        ...UserCardFields
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
  const getThreadsVariables = {
    where: {
      // authorId: { equals: userId },
      AND: [
        { articleId: { equals: articleId } },
        { published: { equals: true } },
        { headId: { equals: null } },
      ],
    },
  };
  const [createComment, result] = useMutation(CreateCommentMutation, {
    update(cache, { data: { createOneThreadMessage } }) {
      const { threadMessages } = cache.readQuery({
        query: CommentsQuery,
        variables: {
          ...getThreadsVariables,
        },
      });
      cache.writeQuery({
        query: CommentsQuery,
        variables: {
          ...getThreadsVariables,
        },
        data: {
          threadMessages: [createOneThreadMessage, ...threadMessages],
        },
      });
    },
  });
  const [body, setBody] = useState("");

  const handleCreate = () => {
    createComment({
      variables: {
        data: {
          body,
          articleId,
          highlights,
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

  return (
    <>
      <MarkdownEditor
        articleMode
        body={body}
        highlights={highlights}
        onChange={(body) => setBody(body)}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a comment!"
        sx={{ mt: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Comment
      </Button>
    </>
  );
}

export default function Comments({
  articleId,
  highlights,
  updateArticleAndScroll,
}) {
  const auth = useAuth();
  const getThreadsVariables = {
    where: {
      // authorId: { equals: userId },
      AND: [
        { articleId: { equals: articleId } },
        { published: { equals: true } },
        { headId: { equals: null } },
      ],
    },
  };
  const { loading, error, data } = useQuery(CommentsQuery, {
    variables: getThreadsVariables,
  });
  if (auth.loading || loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return (
      <Error sx={{ m: 1 }}>
        There was a problem loading the comments for this article.
      </Error>
    );
  }

  return (
    <>
      <NewComment
        userId={auth.user.uid}
        articleId={articleId}
        highlights={highlights}
        updateArticleAndScroll={updateArticleAndScroll}
      />
      {data.threadMessages.map((message) => (
        <Comment
          key={message.id}
          comment={message}
          updateArticleAndScroll={updateArticleAndScroll}
        />
      ))}
    </>
  );
}
