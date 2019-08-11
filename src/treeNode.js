import { guid } from './utils/base';
import { sliceText } from './utils/drawText';
import { nodeOptions } from './options';

export function getLabelObj(label = '') {
  let text = label.trim() || '空';
  const result = sliceText({ text });
  text = result.map(v => v.text).join('\n');
  const textWidth = Math.max(...result.map(v => v.width));
  const padding = nodeOptions.nodeBox.padding;
  const lineHeight = nodeOptions.textStyle.lineHeight;
  const width = textWidth + padding[1] + padding[3];
  const height = result.length * lineHeight + padding[0] + padding[2];
  return { width, height, text, label };
}

export function getNewNode({ label, id, ...rest }) {
  const size = getLabelObj(label);
  return {
    ...rest,
    ...size,
    id: id || guid(),
    label
  };
}
