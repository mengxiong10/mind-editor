import { guid } from '../utils/base';

export class TreeNode {
  constructor(data = {}) {
    const { id, parent, children } = data;
    this.id = id || guid();
    this.parent = parent;
    this.children = children;
  }
}
