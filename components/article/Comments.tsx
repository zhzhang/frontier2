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
        profilePictureUrl
        bio
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
      console.log(getThreadsVariables);
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
