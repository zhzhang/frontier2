import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default (props) => {
  const { children } = props;
  const { text } = children.props.block;

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
      {children}
      {rendered}
    </div>
  );
};
