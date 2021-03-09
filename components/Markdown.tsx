import React from "react";
import ReactMarkdown from "react-markdown";
import { InlineMath, BlockMath } from "react-katex";
import math from "remark-math";
import "katex/dist/katex.min.css"; // `react-katex` does not import the CSS for you

const renderers = {
  inlineMath: ({ value }) => <InlineMath math={value} />,
  math: ({ value }) => <BlockMath math={value} />,
};

const Markdown = ({ children }) => (
  <ReactMarkdown plugins={[math]} renderers={renderers} children={children} />
);

export default Markdown;
