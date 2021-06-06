import React from 'react';
import PropTypes from 'prop-types';
import KaTeX from 'katex';

const createMathComponent = (Component, { displayMode }) => {
  class MathComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = MathComponent.createNewState(null, props);
    }

    static getDerivedStateFromProps(props, state) {
      return MathComponent.createNewState(state, props)
    }

    static createNewState(prevState, props) {
      try {
        const html = MathComponent.generateHtml(props);

        return { html, error: undefined };
      } catch (error) {
        if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
          return { error };
        }

        throw error;
      }
    }

    static generateHtml(props) {
      const { errorColor, renderError } = props;
      const input = props.math ? props.math : props.children;

      return KaTeX.renderToString(input, {
        displayMode,
        errorColor,
        throwOnError: !!renderError
      });
    }

    render() {
      const { error, html } = this.state;
      const { renderError } = this.props;

      if (error) {
        return renderError ? (
          renderError(error)
        ) : (
          <Component html={`${error.message}`} />
        );
      }

      return <Component html={html} />;
    }
  }

  MathComponent.propTypes = {
    children: PropTypes.string,
    errorColor: PropTypes.string,
    math: PropTypes.string,
    renderError: PropTypes.func
  };

  return MathComponent;
};

export default createMathComponent;
