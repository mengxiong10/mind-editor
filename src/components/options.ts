import { levelOptions } from '../editor';

interface MenuItem {
  name: string;
  key: string | number;
  event: string;
  value?: any;
}

export const contextMenuItems: MenuItem[] = [
  { name: '新增条件', key: 'rc-add-node', event: 'rc-add-node' },
  { name: '新增结果', key: 'rc-add-result-node', event: 'rc-add-result-node' },
  { name: '删除节点', key: 'rc-delete-node', event: 'rc-delete-node' }
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
