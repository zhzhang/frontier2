import _ from "lodash";

export function findInlineTeXEntities(contentBlock, callback) {
  const contentBlockText = contentBlock.getText();

  contentBlock.findEntityRanges(
    (character) => !character.getEntity(),
    (nonEntityStart, nonEntityEnd) => {
      const REGEX = new RegExp(
        `${_.escapeRegExp("\\(")}.*?${_.escapeRegExp("\\)")}`,
        "g"
      );
      const text = contentBlockText.slice(nonEntityStart, nonEntityEnd);
      let matchArr;
      let start;
      let prevLastIndex = null;

      while ((matchArr = REGEX.exec(text)) !== null) {
        if (REGEX.lastIndex === prevLastIndex) {
          break;
        }
        prevLastIndex = REGEX.lastIndex;
        start = nonEntityStart + matchArr.index;
        callback(start, start + matchArr[0].length);
      }
    }
  );
}
