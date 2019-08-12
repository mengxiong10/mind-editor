import { guid } from '../utils/base';
import { getTextBox } from '../utils/drawText';
import { nodeOptions } from '../options';

export const registerExpandNode = {
  name: 'expand-node',
  // TODO: 开启动画的时候父节点没有重新draw
  draw(cfg, group) {
    const { textStyle, nodeStyle, nodeBox } = nodeOptions;
    const padding = nodeBox.padding;
    const paddingTop = padding[0];
    const paddingLeft = padding[3];
    const { collapsed, children, width, height, _label } = cfg;

    const attrs = {
      x: paddingLeft,
      y: paddingTop + (textStyle.lineHeight - textStyle.fontSize) / 2,
      text: _label,
      ...textStyle
    };
    const labelObj = group.addShape('text', {
      attrs
    });
    group.addShape('rect', {
      attrs: {
        width,
        height,
        x: 0,
        y: 0,
        radius: 4,
        ...nodeStyle
      }
    });
    if (children && children.length) {
      const cr = 7;
      const crPadding = 3;
      const collapseIcon = [
        ['M', width + crPadding, height / 2],
        ['h', (cr - crPadding) * 2]
      ];
      const expandIcon = [
        ...collapseIcon,
        ['M', width + cr, crPadding - cr + height / 2],
        ['v', (cr - crPadding) * 2]
      ];
      group.addShape('circle', {
        attrs: {
          x: width + cr,
          y: height / 2,
          r: cr,
          ...nodeOptions.nodeStyle
        },
        className: 'collapse-icon'
      });
      group.addShape('path', {
        attrs: {
          lineWidth: 2,
          path: collapsed ? collapseIcon : expandIcon,
          stroke: nodeOptions.nodeStyle.stroke
        },
        className: 'collapse-icon'
      });
    }
    labelObj.toFront();
    return group;
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const shapes = group.get('children');
    const rectShape = shapes[0];
    const textShape = shapes[shapes.length - 1];
    if (name === 'selected') {
      if (value) {
        rectShape.attr(nodeOptions.activedNodeStyle);
        textShape.attr(nodeOptions.activedTextStyle);
      } else {
        rectShape.attr(nodeOptions.nodeStyle);
        textShape.attr(nodeOptions.textStyle);
      }
    }
  },
  getAnchorPoints() {
    return [
      [0, 0.5], // 左侧中间
      [1, 0.5] // 右侧中间
    ];
  }
};

export class ExpandNode {
  constructor(data) {
    const { id, parent, children } = data;
    this.id = id || guid();
    this.parent = parent;
    this.children = children;
    this.shape = registerExpandNode.name;
    this.calLabelSize(data);
  }

  calLabelSize(data) {
    const label = data.label || '';
    this.label = label.trim();
    const textBox = getTextBox({
      text: this.label || '空',
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
