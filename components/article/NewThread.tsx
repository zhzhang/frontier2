import { apolloClient } from "@/lib/apollo";
import { useAuth } from "@/lib/firebase";
import { useMutation, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import gql from "graphql-tag";
import _ from "lodash";
import { useState } from "react";
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

const CreateThreadMessage = gql`
  ${THREAD_MESSAGE_FIELDS}
  mutation createOneThreadMessage($data: ThreadMessageCreateInput!) {
    createOneThreadMessage(data: $data) {
      ...ThreadMessageFields
    }
  }
`;

const UpdateThreadMessage = gql`
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

function NewThreadPrompt({ userId, articleId }) {
  const [type, setType] = useState("COMMENT");
  const [createThreadMessage, { loading, error, data }] =
    useMutation(CreateThreadMessage);
  return (
    <Card sx={{ p: 1 }}>
      <Typography component="span">Write a </Typography>
      <FormControl variant="standard">
        <Select
          value={type}
          size="small"
          onChange={({ target: { value } }) => setType(value)}
        >
          <MenuItem value={"COMMENT"}>Comment</MenuItem>
          <MenuItem value={"REVIEW"}>Review</MenuItem>
        </Select>
      </FormControl>
      <Button
        size="small"
        onClick={async () => {
          const resp = await createThreadMessage({
            variables: {
              data: {
                type,
                article: {
                  connect: {
                    id: articleId,
                  },
                },
                author: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
          });
          apolloClient.writeQuery({
            query: DraftMessagesQuery,
            variables: {
              userId,
              articleId,
            },
            data: {
              draftMessage: resp.data.createOneThreadMessage,
            },
          });
        }}
      >
        Begin
      </Button>
    </Card>
  );
}

function NewThread({ userId, articleId }) {
  const variables = {
    userId,
    articleId,
  };
  const { loading, error, data } = useQuery(DraftMessagesQuery, {
    variables,
  });
  const [updateThreadMessage, updateResp] = useMutation(UpdateThreadMessage);
  const [deleteThread, deleteResp] = useMutation(DeleteOneThreadMessage);
  const [publishMessage, publishResp] = useMutation(PublishThreadMessage);
  if (loading) {
    return <>Loading</>;
  }
  if (error) {
    return <>Error</>;
  }
  if (!data.draftMessage) {
    return <NewThreadPrompt userId={userId} articleId={articleId} />;
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
    <Box>
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
          onClick={() => {
            publishMessage({
              variables: {
                id: message.id,
              },
            });
          }}
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
    </Box>
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
