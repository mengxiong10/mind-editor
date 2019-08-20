/* eslint-disable no-bitwise */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function traverseTree(fn, data, parent, i) {
  if (fn(data, parent, i) === false) {
    return;
  }
  if (Array.isArray(data.children)) {
    data.children.forEach((child, index) => {
      traverseTree(fn, child, data, index);
    });
  }
}
