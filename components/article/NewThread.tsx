import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@mui/material/Button";
import gql from "graphql-tag";
import _ from "lodash";
import MarkdownEditor from "../MarkdownEditor";
import { THREAD_MESSAGE_FIELDS } from "../Thread";
import {
  addHighlightVar,
  focusedEditorVar,
  highlightsVar,
  updateArticleAndScroll,
} from "./vars";

const DraftMessagesQuery = gql`
  ${THREAD_MESSAGE_FIELDS}
  query DraftMessageQuery($userId: String!, $articleId: String!) {
    draftMessage(userId: $userId, articleId: $articleId) {
      ...ThreadMessageFields
    }
  }
`;

const UpsertOneThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation UpsertThreadMessage(
    $where: ThreadMessageWhereUniqueInput!
    $create: ThreadMessageCreateInput!
    $update: ThreadMessageUpdateInput!
  ) {
    upsertOneThreadMessage(where: $where, create: $create, upsert: $upsert) {
      ...ThreadMessageFields
    }
  }
`;
const DeleteOneThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation DeleteThreadMessage($where: ThreadMessageWhereUniqueInput!) {
    deleteOneThreadMessage(where: $where) {
      ...ThreadMessageFields
    }
  }
`;

function NewThread({ userId, articleId }) {
  const variables = {
    userId,
    articleId,
  };
  const { loading, error, data } = useQuery(DraftMessagesQuery, {
    variables,
  });
  const [upsertThreadMessage, updateResp] = useMutation(UpsertOneThreadMessage);
  const [deleteThread, deleteResp] = useMutation(DeleteOneThreadMessage);
  if (loading) {
    return <></>;
  }
  if (error) {
    return <></>;
  }
  if (!data.draftMessage) {
    return (
      <>
        Write a<Button>Comment</Button>
      </>
    );
  }

  const message = data.draftMessage;

  const update = (message) => {
    upsertThreadMessage({
      variables: {
        where: {
          id: message.id,
        },
        data: {
          body: {
            set: message.body,
          },
          highlights: message.highlights,
        },
      },
      context: {
        debounceKey: message.id,
      },
    });
    apolloClient.writeQuery({
      query: DraftMessagesQuery,
      variables,
      data: {
        draftMessage: message,
      },
    });
  };
  const addHighlight = (highlight) => {
    const data = apolloClient.readQuery({
      query: DraftMessagesQuery,
      variables,
    });
    const message = data.draftMessage;
    const highlights = [...message.highlights, highlight];
    highlightsVar(highlights);
    update({ ...message, highlights });
  };
  const deleteHighlight = (id: number) => {
    update({
      ...message,
      highlights: _.reject(message.highlights, { id }),
    });
  };
  return (
    <>
      <MarkdownEditor
        articleMode
        body={message.body}
        highlights={message.highlights}
        deleteHighlight={deleteHighlight}
        focused={data.focusedEditor === message.id}
        onFocus={() => {
          focusedEditorVar(message.id);
          highlightsVar(message.highlights);
          addHighlightVar(addHighlight);
        }}
        onChange={(body) => {
          update({ ...message, body });
        }}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a review!"
        sx={{ mt: 1 }}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          onClick={() =>
            upsertThreadMessage({
              variables: {
                where: {
                  id: message.id,
                },
                data: {
                  published: {
                    set: true,
                  },
                  publishTimestamp: {
                    set: new Date(Date.now()),
                  },
                },
              },
            })
          }
        >
          Publish
        </Button>
        <Button
          color="error"
          onClick={async () => {
            await deleteMessage({
              variables: {
                where: {
                  id: message.id,
                },
              },
            });
            apolloClient.writeQuery({
              query: DraftMessagesQuery,
              variables,
              data: {
                userReview: null,
              },
            });
          }}
        >
          Delete
        </Button>
      </div>
    </>
  );
}

export default function AuthenticatedNewThread({ articleId }) {
  const { loading, user } = useAuth();
  if (loading || !user) {
    return null;
  }
  return <NewThread userId={user.uid} articleId={articleId} />;
}
