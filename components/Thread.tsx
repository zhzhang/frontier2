import { Auth } from "@/components/Auth";
import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import MarkdownEditor from "@/components/MarkdownEditor";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";
import Comment from "./article/Comment";
import {
  addHighlightVar,
  focusedEditorVar,
  highlightsVar,
  updateArticleAndScroll,
} from "./article/vars";
import { USER_CARD_FIELDS } from "./UserCard";
import { VENUE_CARD_FIELDS } from "./VenueCard";

export const THREAD_MESSAGE_FIELDS = gql`
  ${USER_CARD_FIELDS}
  ${VENUE_CARD_FIELDS}
  fragment ThreadMessageFields on ThreadMessage {
    id
    type
    author {
      ...UserCardFields
    }
    venue {
      ...VenueCardFields
    }
    headId
    body
    highlights
    rating
    decision
    publishTimestamp
    released
  }
`;

const ThreadMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query ThreadMessagesQuery($input: ThreadMessagesInput!) {
    threadMessages(input: $input) {
      ...ThreadMessageFields
    }
    threadReplies @client
  }
`;

const CreateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation createThreadMessage($input: ThreadMessageCreateInput!) {
    createThreadMessage(input: $input) {
      ...ThreadMessageFields
    }
  }
`;

export const UpdateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation UpdateThreadMessage($input: ThreadMessageUpdateInput!) {
    updateThreadMessage(input: $input) {
      ...ThreadMessageFields
    }
  }
`;

export const DeleteThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation DeleteThreadMessage($id: String!) {
    deleteThreadMessage(id: $id) {
      ...ThreadMessageFields
    }
  }
`;

export const PublishThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation PublishThreadMessage(
    $id: String!
    $body: String!
    $highlights: JSON!
  ) {
    publishMessage(id: $id, body: $body, highlights: $highlights) {
      ...ThreadMessageFields
    }
  }
`;

const OpenReplyQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query DraftMessageQuery($articleId: String!, $headId: String!) {
    draftMessage(articleId: $articleId, headId: $headId) {
      ...ThreadMessageFields
    }
    focusedEditor @client
    article @client
  }
`;

export function ReplyButton({ headId, articleId }) {
  const auth = useAuth();
  const [loginOpen, toggleLoginOpen] = useState(false);
  const [createThreadMessage, updateResp] = useMutation(CreateThreadMessage, {
    update(cache, { data: { createThreadMessage } }) {
      cache.writeQuery({
        query: OpenReplyQuery,
        variables: {
          articleId,
          headId,
        },
        data: {
          draftMessage: createThreadMessage,
        },
      });
    },
  });
  return (
    <>
      <Button
        size="small"
        sx={{ p: 0, minWidth: 0 }}
        onClick={() => {
          if (auth.user) {
            createThreadMessage({
              variables: {
                input: {
                  type: "COMMENT",
                  headId,
                  articleId,
                },
              },
            });
          } else {
            toggleLoginOpen(true);
          }
        }}
      >
        Reply
      </Button>
      <Dialog
        open={loginOpen && !auth.user}
        onClose={() => toggleLoginOpen(false)}
      >
        <Auth />
      </Dialog>
    </>
  );
}

function OpenReply({ articleId, headId, userId }) {
  const { loading, error, data } = useQuery(OpenReplyQuery, {
    variables: {
      articleId,
      userId,
      headId,
    },
  });
  const [updateThreadMessage, updateResp] = useMutation(UpdateThreadMessage);
  const [deleteThread, deleteResp] = useMutation(DeleteThreadMessage);
  const [publishThreadMessage, createResp] = useMutation(PublishThreadMessage, {
    update(cache, { data: { publishMessage } }) {
      const variables = {
        input: {
          headId,
          articleId,
        },
      };
      const { threadMessages } = cache.readQuery({
        query: ThreadMessagesQuery,
        variables,
      });
      cache.writeQuery({
        query: ThreadMessagesQuery,
        variables,
        data: {
          threadMessages: [...threadMessages, publishMessage],
        },
      });
      cache.writeQuery({
        query: OpenReplyQuery,
        variables: {
          articleId,
          headId,
        },
        data: {
          draftMessage: null,
        },
      });
    },
  });
  if (loading || error || !data.draftMessage) {
    return null;
  }
  const comment = data.draftMessage;
  if (!comment) {
    return null;
  }

  const update = (message) => {
    updateThreadMessage({
      variables: {
        input: {
          id: message.id,
          body: message.body,
          highlights: message.highlights,
        },
      },
      context: {
        debounceTimeout: 1000,
        debounceKey: message.id,
      },
    });
    apolloClient.writeQuery({
      query: OpenReplyQuery,
      variables: {
        userId,
        headId,
      },
      data: {
        draftMessage: message,
      },
    });
  };

  const addHighlight = (highlight) => {
    const data = apolloClient.readQuery({
      query: OpenReplyQuery,
      variables: {
        articleId,
        userId,
        headId,
      },
    });
    const comment = data.draftMessage;
    const highlights = [...comment.highlights, highlight];
    const updatedComment = { ...comment, highlights };
    highlightsVar(highlights);
    update(updatedComment);
  };
  const deleteHighlight = (id: number) => {
    const newHighlights = _.reject(comment.highlights, { id });
    highlightsVar(newHighlights);
    update({
      ...comment,
      highlights: newHighlights,
    });
  };

  return (
    <Box
      sx={{
        mt: 1,
        ml: 6, // Centers to the profile picture.
      }}
    >
      <MarkdownEditor
        articleMode
        body={comment.body}
        highlights={comment.highlights}
        deleteHighlight={deleteHighlight}
        focused={data.focusedEditor === headId}
        onFocus={() => {
          focusedEditorVar(headId);
          addHighlightVar(addHighlight);
          highlightsVar(comment.highlights);
        }}
        onChange={(body) => {
          update({ ...comment, body });
        }}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a reply."
        sx={{ mt: 1 }}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          size="small"
          onClick={() =>
            publishThreadMessage({
              variables: {
                id: comment.id,
                body: comment.body,
                highlights: comment.highlights,
              },
              context: {
                debounceTimeout: 0,
                debounceKey: comment.id,
              },
            })
          }
        >
          Publish
        </Button>
        <Button
          size="small"
          color="error"
          onClick={async () => {
            await deleteThread({
              variables: {
                id: comment.id,
              },
            });
            apolloClient.writeQuery({
              query: OpenReplyQuery,
              variables: {
                headId,
                articleId,
                userId,
              },
              data: {
                draftMessage: null,
              },
            });
          }}
        >
          Cancel
        </Button>
      </div>
    </Box>
  );
}

export default function Thread({ headId, articleId }) {
  const auth = useAuth();
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: {
      input: {
        headId,
        articleId,
      },
    },
  });
  if (loading || auth.loading) {
    return <CenteredSpinner />;
  }
  if (error) {
    return (
      <Box
        sx={{
          mt: 2,
          ml: 5, // Centers to the profile picture.
        }}
      >
        <Error>There was a problem loading replies to this thread.</Error>
      </Box>
    );
  }
  const { threadMessages } = data;
  return (
    <>
      {threadMessages.map((message) => (
        <Comment
          message={message}
          headId={headId}
          key={message.id}
          sx={{ ml: 6 }}
          articleId={articleId}
        />
      ))}
      {auth.user && (
        <OpenReply
          articleId={articleId}
          headId={headId}
          userId={auth.user.uid}
        />
      )}
    </>
  );
}
