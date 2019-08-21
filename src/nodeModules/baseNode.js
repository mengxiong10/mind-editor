import { guid } from '../utils/base';

export const baseNodeModule = {
  name: 'default',
  // child
  shouldBeAppend() {
    return true;
  },

  // parent
  shouldAddChild() {
    return true;
  },

  getChangeSizeKeys() {
    return [];
  },
  calNodeSize() {
    return {};
  },
  getDefaultData() {
    return {};
  },
  create(data = {}) {
    const defaultData = {
      id: guid(),
      ...this.getDefaultData(),
      ...data
    };
    return Object.assign(defaultData, this.calNodeSize(defaultData));
  },
  update(oldValue, value) {
    const needCalNode = this.getChangeSizeKeys().some(key => {
      return value[key] !== undefined && value[key] !== oldValue[key];
    });
    Object.assign(oldValue, value);
    const size = needCalNode ? this.calNodeSize(oldValue) : {};
    return Object.assign(oldValue, size);
  }
};
