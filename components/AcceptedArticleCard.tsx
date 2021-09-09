import AuthorPopover from "@/components/AuthorPopover";
import Authors from "@/components/Authors";
import Markdown from "@/components/Markdown";
import { useState } from "react";

export default function AcceptedArticleCard({ decision }) {
  const { article } = decision;
  const { id, title, authors, versions } = article;
  const [open, setOpen] = useState(true);
  return (
    <>
      <a href={`/article/${id}`}>{title}</a>
      <Authors authors={authors} />
      <Markdown>{versions[0].abstract}</Markdown>
      <span>
        Decision by: <AuthorPopover user={decision.author} />
      </span>
    </>
  );
}
