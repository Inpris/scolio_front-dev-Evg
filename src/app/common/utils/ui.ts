let scrollPadding;
const scrollablePane = {
  width: '30px',
  height: '30px',
  overflow: 'scroll',
  borderWidth: '0',
};

const innerContainer = {
  width: '30px',
  height: '60px',
};

export const getScrollbarPadding = (force = false) => {
  if (force || scrollPadding === undefined) {
    const scrollableElem = document.createElement('div');
    Object.assign(scrollableElem.style, scrollablePane);

    const innerElem = document.createElement('div');
    Object.assign(innerElem.style, innerContainer);

    scrollableElem.appendChild(innerElem);
    document.body.appendChild(scrollableElem);

    scrollPadding = scrollableElem.offsetWidth - scrollableElem.clientWidth;
    document.body.removeChild(scrollableElem);
  }
  return scrollPadding;
};

export const hasScrollbar = () => {
  if (window.navigator.userAgent.search(/Firefox/) > -1 && window.navigator.userAgent.search(/Windows/) > -1) {
    return true;
  }
  return getScrollbarPadding() > 0;
};
