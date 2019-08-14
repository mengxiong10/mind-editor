import { levelOptions } from '../editor';

interface MenuItem {
  name?: string;
  key: string | number;
  event?: string;
  type?: 'Item' | 'Divider';
  value?: any;
}

export const contextMenuItems: MenuItem[] = [
  { name: '标记为通过', key: 'success', event: 'rc-mark', value: 1 },
  { name: '标记为不通过', key: 'fail', event: 'rc-mark', value: 2 },
  { name: '标记为受阻', key: 'block', event: 'rc-mark', value: 3 },
  { name: '标记为重测', key: 'retest', event: 'rc-mark', value: 4 },
  { type: 'Divider', key: 'divider' },
  { name: '新增条件', key: 'add-node', event: 'rc-add-node' },
  { name: '新增结果', key: 'add-result-node', event: 'rc-add-result-node' },
  { name: '删除节点', key: 'delete-node', event: 'rc-delete-node' }
];

export const levelMenuItems: MenuItem[] = levelOptions.map(
  (v: string, i: number) => ({
    name: v,
    key: i,
    value: i,
    event: 'rc-update-level'
  })
);

export const menuItemsMap = {
  level: levelMenuItems,
  contextmenu: contextMenuItems
};
