import { EditorState, Modifier } from 'draft-js';
import Reference from './Reference';

const REFERENCE_ENTITY_TYPE = 'PDF_REFERENCE';

function findReferenceEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null
      && contentState.getEntity(entityKey).getType() === REFERENCE_ENTITY_TYPE
    );
  }, callback);
}

export const getPreviousReferences = (content) => {
  const entities = [];
  content.getBlocksAsArray().forEach((block) => {
    let selectedEntity = null;
    block.findEntityRanges(
      (character) => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (entity.getType() === REFERENCE_ENTITY_TYPE) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: content.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      },
    );
  });
  return entities;
};

// Utility function to be used from the app to update state.
export function insertReferenceEntity(
  editorState,
  reference,
  articleVersionNumber,
) {
  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  contentState = contentState.createEntity(REFERENCE_ENTITY_TYPE, 'IMMUTABLE', {
    reference,
    articleVersionNumber,
  });
  const entityKey = contentState.getLastCreatedEntityKey();
  contentState = Modifier.insertText(
    contentState,
    selection,
    '※',
    undefined,
    entityKey,
  );
  return EditorState.push(editorState, contentState, 'apply-entity');
}

const createReferencesPlugin = goToReference => ({
  decorators: [
    {
      strategy: findReferenceEntities,
      component: Reference,
      props: {
        goToReference,
      },
    },
  ],
});

export default createReferencesPlugin;
