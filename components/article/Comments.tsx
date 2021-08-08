import Editor, { newEditorState } from "@/components/editor/Editor";
import { useState } from "react";

export default function Comments({
  articleId,
  highlights,
  updateArticleAndScroll,
  articleVersion,
}) {
  const [body, setBody] = useState(newEditorState());
  return (
    <>
      <Editor
        editing
        placeholder={"Write a comment!"}
        editorState={body}
        onChange={(newEditorState) => setBody(newEditorState)}
      />
    </>
  );
}
