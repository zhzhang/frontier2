import React from "react";
import ReactMarkdown from "react-markdown";
import { InlineMath, BlockMath } from "react-katex";
import math from "remark-math";
import gfm from "remark-gfm";
import visit from "unist-util-visit";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you

const Highlight = ({ value, id, scrollTo }) => (
  <div onClick={() => scrollTo(id)}>{value}</div>
);

const HIGHLIGHT_RE = /\[.*\]\{\d+\}/;

const extractText = (string, start, end) => {
  const startLine = string.slice(0, start).split("\n");
  const endLine = string.slice(0, end).split("\n");

  return {
    type: "text",
    value: string.slice(start, end),
    position: {
      start: {
        line: startLine.length,
        column: startLine[startLine.length - 1].length + 1,
      },
      end: {
        line: endLine.length,
        column: endLine[endLine.length - 1].length + 1,
      },
    },
  };
};

const highlightPlugin = () => {
  function transformer(tree) {
    visit(tree, "text", (node, position, parent) => {
      const definition = [];
      let lastIndex = 0;
      let match;

      while ((match = HIGHLIGHT_RE.exec(node.value)) !== null) {
        console.log(match);
        const value = match[0];
        console.log(value);
        const type = "highlight";

        if (match.index !== lastIndex) {
          definition.push(extractText(node.value, lastIndex, match.index));
        }

        definition.push({
          type,
          value,
        });

        lastIndex = match.index + value.length;
      }

      if (lastIndex !== node.value.length) {
        const text = extractText(node.value, lastIndex, node.value.length);
        definition.push(text);
      }

      const last = parent.children.slice(position + 1);
      parent.children = parent.children.slice(0, position);
      parent.children = parent.children.concat(definition);
      parent.children = parent.children.concat(last);
    });
  }

  return transformer;
};

const Markdown = ({ highlights, scrollTo, children }) => {
  const renderers = {
    inlineMath: ({ value }) => <InlineMath math={value} />,
    math: ({ value }) => <BlockMath math={value} />,
    highlight: ({ value, id }) => (
      <Highlight value={value} id={id} scrollTo={scrollTo} />
    ),
  };
  return (
    <ReactMarkdown
      plugins={[math, gfm, highlightPlugin]}
      renderers={renderers}
      children={children}
      className="markdown"
    />
  );
};

export default Markdown;
