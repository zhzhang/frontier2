import AuthorPopover from "@/components/AuthorPopover";
import CenteredSpinner from "@/components/CenteredSpinner";
import Editor, { deserialize } from "@/components/editor/Editor";
import ProfilePicturePopover from "@/components/ProfilePicturePopover";
import { useQuery } from "@apollo/react-hooks";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    message: {
      display: "flex",
      marginTop: theme.spacing(2),
      marginLeft: 20, // Centers to the profile picture.
      paddingLeft: 20,
      borderLeft: "1px solid rgba(0,0,0,.125)",
    },
    picture: {
      marginRight: theme.spacing(1),
    },
  })
);

export default function Thread({ headId }) {
  const classes = useStyles();
  const [cursor, setCursor] = useState(null);
  const { loading, error, data } = useQuery(ThreadMessagesQuery, {
    variables: { headId, cursor },
  });
  if (loading) {
    return <CenteredSpinner />;
  }
  const { threadMessages } = data;
  return (
    <div>
      {threadMessages.map((message) => (
        <div className={classes.message}>
          <div className={classes.picture}>
            <ProfilePicturePopover user={message.author} />
          </div>
          <div>
            <AuthorPopover user={message.author} />
            <Editor editorState={deserialize(message.body)} />
          </div>
        </div>
      ))}
    </div>
  );
}
