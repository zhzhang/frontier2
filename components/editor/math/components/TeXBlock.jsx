import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default class TeXBlock extends React.Component {
  state = {
    showTeX: false,
  };

  render() {
    const {
      block: { text },
    } = this.props;
    const { showTeX } = this.state;

    const rendered = <BlockMath>{text}</BlockMath>;

    return (
      <div>
        {rendered}
        <div
          style={{ textAlign: 'right', fontSize: '0.8em', color: 'blue' }}
          onClick={() => this.setState({ showTeX: !showTeX })}
        >
          {showTeX ? 'Hide TeX' : 'Show TeX'}
        </div>
        {showTeX ? text : null}
      </div>
    );
  }
}
