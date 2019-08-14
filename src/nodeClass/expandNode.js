import { TreeNode } from './treeNode';
import { expandNodeName } from '../nodeShape/expandNode';
import { getTextBox } from '../utils/drawText';
import { nodeOptions } from '../options';

export class ExpandNode extends TreeNode {
  constructor(data = {}) {
    super(data);
    this.label = data.label || '';
    this.shape = expandNodeName;
    this.calNodeSize();
  }

  calNodeSize() {
    const text = (this.label || '').trim() || '空';
    const textBox = getTextBox({
      text,
      lineHeight: nodeOptions.textStyle.lineHeight
    });
    const padding = nodeOptions.nodeBox.padding;
    const width = textBox.width + padding[1] + padding[3];
    const height = textBox.height + padding[0] + padding[2];
    this.width = width;
    this.height = height;
    // 绘制使用
    this._label = textBox.value;
  }
}
