import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function TeXBlockEditor({block}) {
  const text = block.getText() 
  const rendered = <BlockMath>{text}</BlockMath>;

  return (
    <div
      style={{
        color: 'blue',
        borderRadius: '5px 5px 5px',
        border: '1px solid blue',
        padding: '5px',
        margin: '10px',
        minHeight: '1.2em',
      }}
    >
      {text}
      {rendered}
    </div>
  );
};
