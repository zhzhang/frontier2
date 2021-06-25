import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import Styles from './styles';

const styles = Styles.inline;

export default class InlineTeX extends React.Component {
  state = { preview: false };

  render() {
    const { decoratedText, children, getStore } = this.props;
    const { preview } = this.state;
    const readOnly = getStore().getReadOnly();

    if (readOnly) {
      return (
        <InlineMath>
          {decoratedText.substr(2, decoratedText.length - 4)}
        </InlineMath>
      );
    }
    return (
      <>
        <span
          style={{
            color: 'blue',
            fontFamily: 'monospace',
          }}
          onMouseOver={() => this.setState({ preview: true })}
          onMouseOut={() => this.setState({ preview: false })}
          onFocus={() => this.setState({ preview: true })}
          onBlur={() => this.setState({ preview: false })}
        >
          {children}
        </span>
        {preview ? (
          <span style={styles.preview} contentEditable={false}>
            <InlineMath>
              {decoratedText.substr(2, decoratedText.length - 4)}
            </InlineMath>
          </span>
        ) : null}
      </>
    );
  }
}
