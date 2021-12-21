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
    authorIdentity {
      context
      number
      user {
        ...UserCardFields
      }
      venue {
        ...VenueCardFields
      }
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
  query ThreadMessagesQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      ...ThreadMessageFields
    }
    threadReplies @client
  }
`;

const CreateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation createOneThreadMessage($data: ThreadMessageCreateInput!) {
    createOneThreadMessage(data: $data) {
      ...ThreadMessageFields
    }
  }
`;

export const UpdateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation UpdateOneThreadMessage(
    $where: ThreadMessageWhereUniqueInput!
    $data: ThreadMessageUpdateInput!
  ) {
    updateOneThreadMessage(where: $where, data: $data) {
      ...ThreadMessageFields
    }
  }
`;

export const DeleteOneThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation DeleteThreadMessage($where: ThreadMessageWhereUniqueInput!) {
    deleteOneThreadMessage(where: $where) {
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
  query DraftMessageQuery(
    $userId: String!
    $articleId: String!
    $headId: String!
  ) {
    draftMessage(userId: $userId, articleId: $articleId, headId: $headId) {
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
    update(cache, { data: { createOneThreadMessage } }) {
      cache.writeQuery({
        query: OpenReplyQuery,
        variables: {
          articleId,
          userId: auth.user.uid,
          headId,
        },
        data: {
          draftMessage: createOneThreadMessage,
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
                data: {
                  type: "COMMENT",
                  body: "",
                  highlights: [],
                  headId,
                  article: {
                    connect: {
                      id: articleId,
                    },
                  },
                  author: {
                    connect: {
                      id: auth.user.uid,
                    },
                  },
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
  const [deleteThread, deleteResp] = useMutation(DeleteOneThreadMessage);
  const [createThreadMessage, createResp] = useMutation(PublishThreadMessage, {
    update(cache, { data: { publishMessage } }) {
      const variables = {
        where: {
          AND: [
            { headId: { equals: headId } },
            { published: { equals: true } },
          ],
        },
        orderBy: [
          {
            publishTimestamp: "asc",
          },
        ],
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
          userId,
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
        where: {
          id: message.id,
        },
        data: {
          type: {
            set: message.type,
          },
          body: {
            set: message.body,
          },
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
    console.log(highlights);
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
            createThreadMessage({
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
                where: {
                  id: comment.id,
                },
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
      where: {
        AND: [{ headId: { equals: headId } }, { published: { equals: true } }],
      },
      orderBy: [
        {
          publishTimestamp: "asc",
        },
      ],
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
