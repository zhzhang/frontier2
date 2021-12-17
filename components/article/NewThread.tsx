import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
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
    focusedEditor @client
  }
`;

const UpsertOneThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation UpsertThreadMessage(
    $where: ThreadMessageWhereUniqueInput!
    $create: ThreadMessageCreateInput!
    $update: ThreadMessageUpdateInput!
  ) {
    upsertOneThreadMessage(where: $where, create: $create, update: $update) {
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

const PublishThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation PublishThreadMessage($id: String!) {
    publishMessage(id: $id) {
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
  const [publishMessage, publishResp] = useMutation(PublishThreadMessage);
  if (loading) {
    return <>Loading</>;
  }
  if (error) {
    return <>Error</>;
  }

  const message = data.draftMessage
    ? data.draftMessage
    : {
        id: "new",
        type: "COMMENT",
        body: "",
        highlights: [],
        __typename: "ThreadMessage",
      };

  const update = (message) => {
    upsertThreadMessage({
      variables: {
        where: {
          id: message.id,
        },
        create: {
          type: message.type,
          body: message.body,
          highlights: message.highlights,
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
        },
        update: {
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
      query: DraftMessagesQuery,
      variables,
      data: {
        draftMessage: message,
      },
    });
    const data = apolloClient.readQuery({
      query: DraftMessagesQuery,
      variables,
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
      <Typography component="span">Writing a </Typography>
      <FormControl variant="standard">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={message.type}
          onChange={({ target: { value } }) =>
            update({ ...message, type: value })
          }
          sx={{ height: 25 }}
        >
          <MenuItem value={"COMMENT"}>Comment</MenuItem>
          <MenuItem value={"REVIEW"}>Review</MenuItem>
        </Select>
      </FormControl>
      <MarkdownEditor
        articleMode
        body={message.body}
        highlights={message.highlights}
        deleteHighlight={deleteHighlight}
        focused={
          data.focusedEditor === message.id || data.focusedEditor === "new"
        }
        onFocus={() => {
          focusedEditorVar(message.id);
          highlightsVar(message.highlights);
          addHighlightVar(addHighlight);
        }}
        onChange={(body) => {
          update({ ...message, body });
        }}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder={`Write a ${message.type.toLowerCase()}!`}
        sx={{ mt: 1 }}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          onClick={() =>
            publishMessage({
              variables: {
                id: message.id,
              },
            })
          }
        >
          Publish
        </Button>
        <Button
          color="error"
          onClick={async () => {
            await deleteThread({
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
                draftMessage: null,
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
  if (loading) {
    return null;
  }
  if (!user) {
    return <>Log in to comment</>;
  }
  return <NewThread userId={user.uid} articleId={articleId} />;
}
