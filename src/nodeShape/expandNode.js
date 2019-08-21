import { nodeStyle, textStyle, expandNodeBox } from '../style';
import { statusStyleOptions } from '../option';

export const statusOptions = [
  { name: '未测', type: 'notest', value: 0, style: nodeStyle.default },
  {
    name: '通过',
    type: 'success',
    value: 1,
    style: { fill: '#dcf3d0', stroke: '#53c400' }
  },
  {
    name: '失败',
    type: 'fail',
    value: 2,
    style: { fill: 'rgba(220,104,83,0.2)', stroke: 'rgba(246,155,155,1)' }
  },
  {
    name: '受阻',
    type: 'block',
    value: 3,
    style: { fill: 'rgba(172,172,172,0.2)', stroke: 'rgba(185,185,185,1)' }
  },
  {
    name: '重测',
    type: 'retest',
    value: 4,
    style: { fill: 'rgba(255,182,77,0.2)', stroke: 'rgba(255,182,77,1)' }
  }
];

const getRectStyle = (status = 0) => {
  return statusStyleOptions[status] || nodeStyle.default;
};

export const expandNodeName = 'expand-node';

export const registerExpandNode = {
  name: expandNodeName,
  // TODO: 开启动画的时候父节点没有重新draw
  draw(cfg, group) {
    const { padding } = expandNodeBox;
    const paddingTop = padding[0];
    const paddingLeft = padding[3];
    const { collapsed, children, width, height, _label, status } = cfg;

    const textAttrs = {
      x: paddingLeft,
      y:
        paddingTop +
        (textStyle.default.lineHeight - textStyle.default.fontSize) / 2,
      text: _label,
      ...textStyle.default
    };

    const labelObj = group.addShape('text', {
      attrs: textAttrs
    });

    const rectStyle = getRectStyle(status);
    group.addShape('rect', {
      attrs: {
        width,
        height,
        x: 0,
        y: 0,
        radius: 4,
        ...rectStyle
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
          ...nodeStyle.default
        },
        className: 'collapse-icon'
      });
      group.addShape('path', {
        attrs: {
          lineWidth: 2,
          path: collapsed ? collapseIcon : expandIcon,
          stroke: nodeStyle.default.stroke
        },
        className: 'collapse-icon'
      });
    }
    labelObj.toFront();
    return group;
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const model = item.getModel();
    const shapes = group.get('children');
    const rectShape = shapes[0];
    // const textShape = shapes[shapes.length - 1];
    if (name === 'selected') {
      if (value) {
        rectShape.attr(nodeStyle.active);
      } else {
        rectShape.attr(getRectStyle(model.status));
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
