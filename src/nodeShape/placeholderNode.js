import { placeholderNodeStyle } from '../style';

export const placeholderNodeName = 'placeholder-node';

export const registerPlaceholderNode = {
  name: placeholderNodeName,
  // TODO: 开启动画的时候父节点没有重新draw
  draw(cfg, group) {
    const { width, height } = cfg;

    group.addShape('rect', {
      attrs: {
        width,
        height,
        x: 0,
        y: 0,
        radius: 4,
        ...placeholderNodeStyle
      }
    });
    return group;
  },
  getAnchorPoints() {
    return [
      [0, 0.5], // 左侧中间
      [1, 0.5] // 右侧中间
    ];
  }
};
