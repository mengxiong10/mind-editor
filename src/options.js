const activeColor = '#1890ff';

export const nodeOptions = {
  activeColor,
  edgeStyle: {
    stroke: '#a3b1bf'
  },
  nodeBox: {
    // node padding 也是 input 的 padding
    padding: [5, 12, 5, 12]
  },
  nodeStyle: {
    stroke: '#a3b1bf',
    fill: '#fff'
  },
  activedNodeStyle: {
    stroke: activeColor
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
    fill: activeColor
  },
  resultNodeBox: {
    width: 300,
    padding: [5, 12, 5, 12],
    itemMargin: 10,
    labelWidth: 72
  },
  activedResultNodeStyle: {
    stroke: activeColor,
    fill: '#fff'
  },
  placeholderNodeStyle: {
    fill: '#91D5FF'
  }
};
