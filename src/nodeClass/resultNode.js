import { getTextBox } from '../utils/drawText';
import { nodeOptions } from '../options';
import { TreeNode } from './treeNode';
import { resultNodeName } from '../nodeShape/resultNode';

export class ResultNode extends TreeNode {
  constructor(data = {}) {
    super(data);
    this.label = data.label || '';
    this.description = data.description || '';
    this.forAutoTest = data.forAutoTest || false;
    this.level = data.level || 0;
    this.shape = resultNodeName;
    this.calNodeSize();
  }

  calNodeSize() {
    const label = (this.label || '').trim();
    const description = (this.description || '').trim();
    const { lineHeight } = nodeOptions.textStyle;
    const {
      width,
      labelWidth,
      padding,
      itemMargin
    } = nodeOptions.resultNodeBox;
    const maxTextWidth = width - labelWidth - padding[1] - padding[3];
    const textBoxs = [label, description].map(v =>
      getTextBox({
        lineHeight,
        maxWidth: maxTextWidth,
        text: v || '空'
      })
    );
    const textHeight = textBoxs.reduce((acc, cur) => acc + cur.height, 0);
    const height =
      textHeight +
      textBoxs.length * itemMargin +
      lineHeight +
      padding[0] +
      padding[2];
    this.width = width;
    this.height = height;
    this._label = textBoxs[0].value;
    this._description = textBoxs[1].value;
  }
}
