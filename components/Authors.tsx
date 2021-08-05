import AuthorPopover from "@/components/AuthorPopover";

export default function Authors({ authors, className = null, ...props }) {
  if (authors === null) {
    return (
      <div className={className}>
        <em>Anonymized</em>
      </div>
    );
  }
  const children = [];
  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    children.push(<AuthorPopover user={author} key={author.id} {...props} />);
    if (i < authors.length - 1) {
      children.push(", ");
    }
  }

  return <div className={className}>{children}</div>;
}
