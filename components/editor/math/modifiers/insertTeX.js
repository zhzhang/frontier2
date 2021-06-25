import { Map } from 'immutable';
import customInsertAtomicBlock from './customInsertAtomicBlock';

export default function insertTeX(editorState) {
  return customInsertAtomicBlock(editorState, Map({ math: true, teX: '' }));
}
