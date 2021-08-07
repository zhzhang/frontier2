import Editor, { newEditorState } from "@/components/editor/Editor";
import { Button } from "@material-ui/core";
import { useState } from "react";

export default function Comments({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) {
  const [body, setBody] = useState(newEditorState());
  const [editing, toggleEditing] = useState(true);

  return (
    <>
      <Editor
        editing={editing}
        placeholder={"Write a comment!"}
        editorState={body}
        onChange={(newEditorState) => setBody(newEditorState)}
      />
      <Button onClick={() => toggleEditing(!editing)}>Toggle</Button>
    </>
  );
}
