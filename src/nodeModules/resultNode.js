import { textStyle, resultNodeBox } from '../options';
import { getTextBox } from '../utils/drawText';
import { baseNodeModule } from './baseNode';
import { resultNodeName } from '../nodeShape/resultNode';

export const resultNodeModule = Object.assign({}, baseNodeModule, {
  name: resultNodeName,

  getDefaultData() {
    return {
      shape: this.name,
      label: '',
      description: '',
      forAutoTest: false,
      level: 0
    };
  },

  getChangeSizeKeys() {
    return ['label', 'description'];
  },

  calNodeSize({ label = '', description = '' }) {
    const labelText = String(label).trim();
    const descriptionText = String(description).trim();
    const { lineHeight } = textStyle.default;
    const { width, labelWidth, padding, itemMargin } = resultNodeBox;
    const maxTextWidth = width - labelWidth - padding[1] - padding[3];
    const textBoxs = [labelText, descriptionText].map(v =>
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
    return {
      width,
      height,
      _label: textBoxs[0].value,
      _description: textBoxs[1].value
    };
  }
});
