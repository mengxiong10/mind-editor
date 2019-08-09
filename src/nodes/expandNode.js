export default function registerExpandNode(G6, nodeOptions) {
  G6.registerNode('expand-node', {
    draw(cfg, group) {
      const paddingValue = nodeOptions.nodeBox.padding;
      const { collapsed, children, label = '' } = cfg;
      const { textStyle, nodeStyle } = nodeOptions;
      const text = label.trim() || '空';
      const attrs = {
        x: paddingValue,
        y: paddingValue,
        text,
        ...textStyle
      };
      const labelObj = group.addShape('text', {
        attrs
      });
      const labelBox = labelObj.getBBox();
      const width = labelBox.maxX + paddingValue;
      const height = Math.ceil(labelBox.maxY + paddingValue);
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
  });
}
