const context = document.createElement('canvas').getContext('2d');

function getSliceLength(text, maxWidth) {
  let width = context.measureText(text).width;
  if (width <= maxWidth) {
    return { text, width };
  }
  // 基本可能的分割长度
  let len = Math.floor((maxWidth / width) * text.length);
  let result = text.slice(0, len);
  width = context.measureText(result).width;
  while (width <= maxWidth && len < text.length) {
    result = text.slice(0, ++len);
    width = context.measureText(result).width;
  }
  while (width > maxWidth && len > 0) {
    result = text.slice(0, --len);
    width = context.measureText(result).width;
  }
  return { text: text.slice(0, len), width };
}

export function sliceText({ text, maxWidth = 240, font = '12px sans-serif' }) {
  if (!text) {
    return [];
  }
  context.font = font;
  return text.split('\n').reduce((acc, cur) => {
    const lines = [];
    let str = cur;
    do {
      const obj = getSliceLength(str, maxWidth, context);
      lines.push(obj);
      str = str.slice(obj.text.length);
    } while (str.length);
    return acc.concat(lines);
  }, []);
}
