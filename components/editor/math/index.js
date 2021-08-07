import { Map } from "immutable";
import InlineTeX from "./components/InlineTeX";
import TeXBlock from "./components/TeXBlock";
import TeXBlockEditor from "./components/TeXBlockEditor";
import initCompletion from "./mathjax/completion";
import insertTeX from "./modifiers/insertTeX";
import { findInlineTeXEntities } from "./utils";

export function insertTeXBlock(editorState) {
  return insertTeX(editorState, true);
}

const defaultConfig = {
  macros: {},
  completion: "auto",
};

const createMathPlugin = (config = {}) => {
  const { macros, completion, script, mathjaxConfig } = Object.assign(
    defaultConfig,
    config
  );

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getReadOnly: undefined,
    setReadOnly: undefined,
    getEditorRef: undefined,
    completion: initCompletion(completion, macros),
    teXToUpdate: {},
  };

  const blockRendererFn = (block) => {
    if (
      block.getType() === "math"
    ) {
      if (store.getReadOnly()) {
        return {
          component: TeXBlock,
          props: { getStore: () => store },
        };
      }
      return {
        component: TeXBlockEditor,
        props: { getStore: () => store },
      };
    }
    return null;
  };

  return {
    initialize: ({
      getEditorState,
      setEditorState,
      getReadOnly,
      setReadOnly,
      getEditorRef,
    }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
      store.getReadOnly = getReadOnly;
      store.setReadOnly = setReadOnly;
      store.getEditorRef = getEditorRef;
      // store.completion = store.completion(getEditorState());
      // store.completion.mostUsedTeXCommands =
      //   getInitialMostUsedTeXCmds(getEditorState())
    },
    decorators: [
      {
        strategy: findInlineTeXEntities,
        component: InlineTeX,
        props: {
          getStore: () => store,
        },
      },
    ],
    blockRendererFn,
  };
};

export default createMathPlugin;
