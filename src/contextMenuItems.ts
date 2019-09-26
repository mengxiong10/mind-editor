import { OverlayMenuItem } from './components/OverlayMenu';

export const contextMenuItems: OverlayMenuItem[] = [
  {
    name: '标记为通过',
    key: 'success',
    handler: (editor: any) => editor.updateNode({ status: 1 })
  },
  {
    name: '标记为不通过',
    key: 'fail',
    handler: (editor: any) => editor.updateNode({ status: 2 })
  },
  {
    name: '标记为受阻',
    key: 'block',
    handler: (editor: any) => editor.updateNode({ status: 3 })
  },
  {
    name: '标记为重测',
    key: 'retest',
    handler: (editor: any) => editor.updateNode({ status: 4 })
  },
  { type: 'Divider', key: 'divider' },
  {
    name: '新增条件',
    key: 'add-node',
    handler: (editor: any) => editor.addNode()
  },
  {
    name: '删除节点',
    key: 'delete-node',
    handler: (editor: any) => editor.deleteNode()
  }
];
