import { nodeStyle } from './style';

export const contextMenuItems = [
  { name: '标记为通过', key: 'success', event: 'rc-mark', value: 1 },
  { name: '标记为不通过', key: 'fail', event: 'rc-mark', value: 2 },
  { name: '标记为受阻', key: 'block', event: 'rc-mark', value: 3 },
  { name: '标记为重测', key: 'retest', event: 'rc-mark', value: 4 },
  { type: 'Divider', key: 'divider' },
  { name: '新增条件', key: 'add-node', event: 'rc-add-node' },
  { name: '新增结果', key: 'add-result-node', event: 'rc-add-result-node' },
  { name: '删除节点', key: 'delete-node', event: 'rc-delete-node' }
];

export const statusStyleOptions = [
  nodeStyle.default,
  { fill: '#dcf3d0', stroke: '#53c400' },
  { fill: 'rgba(220,104,83,0.2)', stroke: 'rgba(246,155,155,1)' },
  { fill: 'rgba(172,172,172,0.2)', stroke: 'rgba(185,185,185,1)' },
  { fill: 'rgba(255,182,77,0.2)', stroke: 'rgba(255,182,77,1)' }
];

export const levelOptions = ['无', '低', '中', '高'];

export const levelMenuItems = levelOptions.map((v, i) => ({
  name: v,
  key: i,
  value: i,
  event: 'rc-update-level'
}));

export const menuItemsMap = {
  level: levelMenuItems,
  contextmenu: contextMenuItems
};
