import AuthorPopover from "@/components/AuthorPopover";
import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Markdown from "@/components/Markdown";
import MarkdownEditor from "@/components/MarkdownEditor";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import TimeAgo from "@/components/TimeAgo";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";
import ReplyButton from "./article/ReplyButton";
import {
  addHighlightVar,
  focusedEditorVar,
  highlightsVar,
  threadRepliesVar,
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

const CreateThreadMessageMutation = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation CreateThreadMessageMutation($data: ThreadMessageCreateInput!) {
    createOneThreadMessage(data: $data) {
      ...ThreadMessageFields
    }
  }
`;

const OpenReplyQuery = gql`
  query OpenReplyQuery {
    threadReplies @client
    focusedEditor @client
    article @client
  }
`;

function OpenReply({ headId, userId }) {
  const { loading, error, data } = useQuery(OpenReplyQuery);
  const [createThreadMessage, updateResp] = useMutation(
    CreateThreadMessageMutation,
    {
      update(cache, { data: { createOneThreadMessage } }) {
        const replies = threadRepliesVar();
        threadRepliesVar(replies.set(headId, null));
        const { threadMessages } = cache.readQuery({
          query: ThreadMessagesQuery,
          variables: { where: { headId: { equals: headId } } },
        });
        cache.writeQuery({
          query: ThreadMessagesQuery,
          variables: { where: { headId: { equals: headId } } },
          data: {
            threadMessages: [...threadMessages, createOneThreadMessage],
          },
        });
      },
    }
  );
  if (loading || error) {
    return null;
  }
  if (error) {
    return null;
  }
  const comment = data.threadReplies.get(headId);
  if (!comment) {
    return null;
  }

  const update = (comment) => {
    const data = apolloClient.readQuery({
      query: OpenReplyQuery,
    });
    const newThreadReplies = data.threadReplies.set(headId, comment);
    threadRepliesVar(newThreadReplies);
  };

  const addHighlight = (highlight) => {
    const data = apolloClient.readQuery({
      query: OpenReplyQuery,
    });
    const comment = data.threadReplies.get(headId);
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
            createThreadMessage({
              variables: {
                data: {
                  author: {
                    connect: {
                      id: userId,
                    },
                  },
                  headId,
                  articleId: data.article.id,
                  body: comment.body,
                  highlights: comment.highlights,
                  published: true,
                },
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
            highlightsVar([]);
            threadRepliesVar(data.threadReplies.set(headId, null));
          }}
        >
          Cancel
        </Button>
      </div>
    </Box>
  );
}

export default function Thread({ headId }) {
  const auth = useAuth();
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: { where: { headId: { equals: headId } } },
  });
  const [loginOpen, toggleLoginOpen] = useState(false);
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
  const typographyProps = {
    component: "span",
    sx: {
      fontSize: "0.8rem",
      color: "gray",
    },
  };
  return (
    <>
      {threadMessages.map((message) => (
        <Box
          sx={{
            mt: 2,
            ml: 4, // Centers to the profile picture.
          }}
          key={message.id}
        >
          {
            <Box
              key={message.id}
              sx={{
                display: "flex",
                pl: 2,
              }}
            >
              <ProfilePicturePopover
                identity={message.authorIdentity}
                sx={{ mr: 1 }}
              />
              <Box>
                <AuthorPopover identity={message.authorIdentity} />
                <Typography {...typographyProps}>{" • "}</Typography>
                <TimeAgo {...typographyProps} time={message.publishTimestamp} />
                <Markdown
                  highlights={message.highlights}
                  updateArticleAndScroll={updateArticleAndScroll}
                >
                  {message.body}
                </Markdown>
                <ReplyButton headId={message.headId} />
              </Box>
            </Box>
          }
        </Box>
      ))}
      {auth.user && <OpenReply headId={headId} userId={auth.user.uid} />}
    </>
  );
}
