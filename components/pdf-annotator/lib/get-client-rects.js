//


import optimizeClientRects from './optimize-client-rects';

const getClientRects = (
  range,
  containerEl,
  shouldOptimize = true,
) => {
  const clientRects = Array.from(range.getClientRects());

  const offset = containerEl.getBoundingClientRect();

  const rects = clientRects.map(rect => ({
    top: rect.top + containerEl.scrollTop - offset.top,
    left: rect.left + containerEl.scrollLeft - offset.left,
    width: rect.width,
    height: rect.height,
  }));

  return shouldOptimize ? optimizeClientRects(rects) : rects;
};

export default getClientRects;
