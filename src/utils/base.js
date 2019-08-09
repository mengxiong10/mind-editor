/* eslint-disable no-bitwise */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function traverseTree(parent, callback, getChild, runSelf = false) {
  const children = getChild(parent);
  if (runSelf) {
    callback(parent, null, null);
  }
  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      callback(child, parent, index);
      traverseTree(child, callback, getChild);
    });
  }
}
