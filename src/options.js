export const activeColor = '#1890ff';

// 边的样式
export const edgeStyle = {
  default: {
    stroke: '#a3b1bf'
  }
};

// 节点的样式
export const nodeStyle = {
  default: {
    stroke: '#a3b1bf',
    fill: '#fff'
  },
  active: {
    stroke: activeColor
  }
};

// 文字的样式
export const textStyle = {
  default: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAlign: 'left',
    textBaseline: 'top',
    lineHeight: 12 * 1.5,
    fill: '#666'
  },
  active: {
    fill: activeColor
  }
};

// 普通节点的模型
export const expandNodeBox = {
  padding: [5, 12, 5, 12]
};

// 结果节点的模型
export const resultNodeBox = {
  width: 300,
  padding: [5, 12, 5, 12],
  itemMargin: 10,
  labelWidth: 72
};

// 占位节点样式 (拖动)
export const placeholderNodeStyle = {
  fill: '#91D5FF'
};

// 拖拽节点样式
export const delegateStyle = {
  fill: '#F3F9FF',
  fillOpacity: 0.5,
  stroke: '#1890FF',
  strokeOpacity: 0.9,
  lineDash: [4, 4],
  radius: 4
};
