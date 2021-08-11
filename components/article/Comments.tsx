import ArticleMarkdownEditor from "@/components/ArticleMarkdownEditor";
import { useState } from "react";

export default function Comments({
  articleId,
  highlights,
  updateArticleAndScroll,
}) {
  const [body, setBody] = useState("");
  const [editing, toggleEditing] = useState(true);

  return (
    <>
      <ArticleMarkdownEditor
        body={body}
        highlights={highlights}
        onChange={(body) => setBody(body)}
        updateArticleAndScroll={updateArticleAndScroll}
        placeholder="Write a comment!"
      />
    </>
  );
}
