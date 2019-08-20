import { textStyle, expandNodeBox } from '../options';
import { getTextBox } from '../utils/drawText';
import { baseNodeModule } from './baseNode';
import { expandNodeName } from '../nodeShape/expandNode';

export const expandNodeModule = Object.assign({}, baseNodeModule, {
  name: expandNodeName,

  getDefaultData() {
    return {
      shape: this.name,
      label: ''
    };
  },

  getChangeSizeKeys() {
    return ['label'];
  },

  calNodeSize({ label = '' }) {
    const text = String(label).trim() || '空';
    const textBox = getTextBox({
      text,
      lineHeight: textStyle.default.lineHeight
    });
    const { padding } = expandNodeBox;
    const width = textBox.width + padding[1] + padding[3];
    const height = textBox.height + padding[0] + padding[2];

    return { width, height, _label: textBox.value };
  }
});
