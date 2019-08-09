import { guid } from './utils/base';
import { sliceText } from './utils/drawText';
import { nodeOptions } from './options';

export function getSizeFromLabel(label = '') {
  let text = label.trim() || '空';
  const result = sliceText({ text });
  text = result.map(v => v.text).join('\n');
  const textWidth = Math.max(...result.map(v => v.width));
  const padding = nodeOptions.nodeBox.padding;
  const lineHeight = nodeOptions.textStyle.lineHeight;
  const fontSize = nodeOptions.textStyle.fontSize;
  const width = textWidth + 2 * padding;
  const height = (result.length - 1) * lineHeight + fontSize + 2 * padding;
  return { width, height, text };
}

export function getNewNode({ label, id, ...rest }) {
  const size = getSizeFromLabel(label);
  return {
    ...rest,
    ...size,
    id: id || guid(),
    label
  };
}
