import { makeVar } from "@apollo/client";
import { Map } from "immutable";

export const highlightsVar = makeVar([]);
export const addHighlightVar = makeVar(null);
export const focusedEditorVar = makeVar(null);
export const articleVar = makeVar({});
export const selectedVersionVar = makeVar({});
export const viewerVar = makeVar(null);
export const onRenderedCallbackVar = makeVar(null);
export const threadRepliesVar = makeVar(Map());

export function selectVersion(versionNumber) {
  const versions = articleVar().versions;
  return selectedVersionVar(
    _.find(versions, (o) => o.versionNumber === versionNumber)
  );
}

export function updateArticleAndScroll({ highlight, highlights }) {
  if (selectedVersionVar().versionNumber === highlight.articleVersion) {
    highlightsVar(highlights);
    viewerVar().scrollTo(highlight);
  } else {
    highlightsVar(highlights);
    const onRenderedCallback = (viewer) => {
      console.log("hit");
      viewer.scrollTo(highlight);
      onRenderedCallbackVar(null);
    };
    onRenderedCallbackVar(onRenderedCallback);
    selectVersion(highlight.articleVersion);
  }
}
