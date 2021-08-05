import AuthorPopover from "@/components/AuthorPopover";
import CenteredSpinner from "@/components/CenteredSpinner";
import Editor, { deserialize } from "@/components/editor/Editor";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";

const ThreadMessagesQuery = gql`
  query ThreadMessagesQuery($headId: String!, $cursor: String) {
    threadMessages(headId: $headId, cursor: $cursor) {
      id
      author {
        name
      }
      body
      highlights
    }
  }
`;

export default function Thread({ headId }) {
  const [cursor, setCursor] = useState(null);
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: { headId, cursor },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  console.log(data);
  const { threadMessages } = data;
  return (
    <div>
      {threadMessages.map((message) => (
        <div style={{ display: "flex", marginTop: "10px" }} key={message.id}>
          <div
            style={{
              width: "10px",
              borderLeft: "1px solid rgba(0,0,0,.125)",
            }}
          />
          <div
            style={{
              flex: 1,
              border: "1px solid rgba(0,0,0,.125)",
              borderRadius: ".25rem",
            }}
            className="p-2"
          >
            <div>
              <AuthorPopover user={message.author} />
            </div>
            {message.body && <Editor editorState={deserialize(message.body)} />}
          </div>
        </div>
      ))}
    </div>
  );
}
