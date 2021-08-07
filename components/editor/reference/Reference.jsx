import React from 'react';

const mapDispatchToProps = dispatch => ({
  sendHighlights: (highlights, articleVersionId) => dispatch(actions.receiveHighlights(highlights, articleVersionId)),
});

const component = (props) => {
  const {
    contentState, entityKey, sendHighlights, children,
  } = props;
  const data = contentState
    .getEntity(entityKey)
    .getData();
  return (
    <span
      onClick={() => {
        sendHighlights([data.reference], data.articleVersionNumber);
      }}
      style={{ color: 'blue' }}
    >
      {children}
    </span>
  );
};

export default component