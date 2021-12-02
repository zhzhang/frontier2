import AuthorPopover from "@/components/AuthorPopover";
import CenteredSpinner from "@/components/CenteredSpinner";
import Error from "@/components/Error";
import Markdown from "@/components/Markdown";
import MarkdownEditor from "@/components/MarkdownEditor";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useQuery } from "@apollo/react-hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import gql from "graphql-tag";
import _ from "lodash";
import {
  addHighlightVar,
  focusedEditorVar,
  highlightsVar,
  threadRepliesVar,
  updateArticleAndScroll,
} from "./article/vars";
import { USER_CARD_FIELDS } from "./UserCard";

const ThreadMessagesQuery = gql`
  ${USER_CARD_FIELDS}
  query ThreadMessagesQuery($where: ThreadMessageWhereInput!) {
    threadMessages(where: $where) {
      id
      author {
        ...UserCardFields
      }
      body
      highlights
    }
    threadReplies @client
  }
`;

const OpenReplyQuery = gql`
  query OpenReplyQuery {
    threadReplies @client
    focusedEditor @client
  }
`;

function OpenReply({ headId }) {
  const { loading, error, data } = useQuery(OpenReplyQuery);
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
    console.log(highlights);
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
            updateReview({
              variables: {
                where: {
                  id: review.id,
                },
                data: {
                  published: {
                    set: true,
                  },
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
        <Box
          sx={{
            mt: 1,
            ml: 4, // Centers to the profile picture.
          }}
        >
          {
            <Box
              key={message.id}
              sx={{
                display: "flex",
                pl: 2,
              }}
            >
              <ProfilePicturePopover user={message.author} sx={{ mr: 1 }} />
              <Box>
                <AuthorPopover user={message.author} />
                <Markdown>{message.body}</Markdown>
                <Button
                  size="small"
                  sx={{ p: 0, minWidth: 0 }}
                  onClick={() => {
                    threadRepliesVar(
                      data.threadReplies.set(headId, {
                        body: "",
                        highlights: [],
                      })
                    );
                  }}
                >
                  Reply
                </Button>
              </Box>
            </Box>
          }
        </Box>
      ))}
      <OpenReply headId={headId} userId={auth.user.uid} />
    </>
  );
}
