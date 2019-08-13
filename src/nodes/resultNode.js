import { getTextBox } from '../utils/drawText';
import { nodeOptions } from '../options';
import { TreeNode } from './expandNode';

// 0, 1, 2, 3
export const levelOptions = ['无', '低', '中', '高'];

export const registerResultNode = {
  name: 'result-node',
  draw(cfg, group) {
    const { _description, _label, forAutoTest, level, width, height } = cfg;
    const { textStyle, nodeStyle, resultNodeBox } = nodeOptions;
    const lineHeight = textStyle.lineHeight;
    const labelWidth = resultNodeBox.labelWidth;
    const padding = resultNodeBox.padding;
    const paddingTop = padding[0];
    const paddingLeft = padding[3];
    const marginBottom = resultNodeBox.itemMargin;

    const descTop =
      paddingTop + (textStyle.lineHeight - textStyle.fontSize) / 2;

    const labelTop =
      _description.split('\n').length * lineHeight + marginBottom + descTop;

    const autoTestTop =
      _label.split('\n').length * lineHeight + marginBottom + labelTop;

    const textShape = {
      descriptionLabel: {
        attrs: {
          x: paddingLeft,
          y: descTop,
          text: '描述：'
        }
      },
      descriptionValue: {
        attrs: {
          x: labelWidth + paddingLeft,
          y: descTop,
          text: _description
        },
        cfg: {
          className: 'description'
        }
      },
      expectedResultLabel: {
        attrs: {
          x: paddingLeft,
          y: labelTop,
          text: '预期结果：'
        }
      },
      expectedResultValue: {
        attrs: {
          x: labelWidth + paddingLeft,
          y: labelTop,
          text: _label
        },
        cfg: {
          className: 'label'
        }
      },
      autoTestValue: {
        attrs: {
          x: paddingLeft,
          y: autoTestTop,
          text: `自动化测试：${forAutoTest ? '是' : '否'}`
        },
        cfg: {
          className: 'forAutoTest'
        }
      },
      levelValue: {
        attrs: {
          x: labelWidth + paddingLeft + 16 + 20,
          y: autoTestTop,
          text: `优先级: ${levelOptions[level]}`
        },
        cfg: {
          className: 'level'
        }
      }
    };

    const rect = group.addShape('rect', {
      attrs: {
        width,
        height,
        x: 0,
        y: 0,
        radius: 4,
        ...nodeStyle
      }
    });

    Object.keys(textShape).forEach(key => {
      const { attrs, cfg: cfgData } = textShape[key];
      group.addShape('text', {
        attrs: {
          ...textStyle,
          ...attrs
        },
        ...cfgData
      });
    });

    return rect;
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const shapes = group.get('children');
    const rectShape = shapes[0];
    if (name === 'selected') {
      if (value) {
        rectShape.attr(nodeOptions.activedNodeStyle);
      } else {
        rectShape.attr(nodeOptions.nodeStyle);
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

export class ResultNode extends TreeNode {
  constructor(data) {
    super(data);
    this.label = data.label || '';
    this.description = data.description || '';
    this.forAutoTest = data.forAutoTest || false;
    this.level = data.level || 0;
    this.shape = registerResultNode.name;
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
