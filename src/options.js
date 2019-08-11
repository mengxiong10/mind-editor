export const defaultOptions = {
  animate: false,
  hGap: 20,
  vGap: 10,
  disabled: false
};

const activeColor = '#1890ff';

export const nodeOptions = {
  activeColor,
  nodeBox: {
    padding: [5, 12, 5, 12]
  },
  edgeStyle: {
    stroke: '#a3b1bf'
  },
  nodeStyle: {
    stroke: '#a3b1bf',
    fill: '#fff'
  },
  activedNodeStyle: {
    stroke: '#fff',
    fill: activeColor
  },
  textStyle: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAlign: 'left',
    textBaseline: 'top',
    lineHeight: 12 * 1.5,
    fill: '#666'
  },
  activedTextStyle: {
    fill: '#fff'
  },
  activedResultNodeStyle: {
    stroke: activeColor,
    fill: '#fff'
  },
  placeholderNodeStyle: {
    fill: '#91D5FF'
  }
};
