/* eslint-disable no-bitwise */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function traverseTree(data, fn) {
  if (fn(data) === false) {
    return;
  }
  if (Array.isArray(data.children)) {
    data.children.forEach(child => {
      traverseTree(child, fn);
    });
  }
}
