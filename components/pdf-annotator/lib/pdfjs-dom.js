export const getPageFromElement = (target) => {
  const node = target.closest(".page");

  if (!(node instanceof HTMLElement)) {
    return null;
  }

  const number = Number(node.dataset.pageNumber);

  return { node, number };
};

export const getDocument = (elm) => (elm || {}).ownerDocument || document;
export const getWindow = (elm) =>
  (getDocument(elm) || {}).defaultView || window;

export const getPageFromRange = (range) => {
  const parentElement = range.startContainer.parentElement;

  if (!isHTMLElement(parentElement)) {
    return;
  }

  return getPageFromElement(parentElement);
};

export const isHTMLElement = (elm) =>
  elm instanceof HTMLElement || elm instanceof getWindow(elm).HTMLElement;

export const findOrCreateContainerLayer = (container, className) => {
  const doc = getDocument(container);
  let layer = container.querySelector(`.${className}`);

  if (!layer) {
    layer = doc.createElement("div");
    layer.className = className;
    container.appendChild(layer);
  }

  return layer;
};
