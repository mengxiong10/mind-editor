import { OverlayMenuItem } from './components/OverlayMenu';

export const getContextMenuItems = (editor: any): OverlayMenuItem[] => {
  return [
    {
      name: '标记为通过',
      key: 'success',
      handler: editor.updateNode.bind(editor, { status: 1 })
    },
    {
      name: '标记为不通过',
      key: 'fail',
      handler: editor.updateNode.bind(editor, { status: 2 })
    },
    {
      name: '标记为受阻',
      key: 'block',
      handler: editor.updateNode.bind(editor, { status: 3 })
    },
    {
      name: '标记为重测',
      key: 'retest',
      handler: editor.updateNode.bind(editor, { status: 4 })
    },
    { type: 'Divider', key: 'divider' },
    {
      name: '新增子条件',
      key: 'add-node',
      handler: editor.addNode.bind(editor)
    },
    {
      name: '新增条件',
      key: 'add-sibling',
      handler: editor.addSibling.bind(editor)
    },
    {
      name: '删除节点',
      key: 'delete-node',
      disabled: !editor.couldDelete(),
      handler: editor.deleteNode.bind(editor)
    },
    { type: 'Divider', key: 'divider1' },
    {
      name: '复制',
      key: 'copy-node',
      disabled: !editor.couldClone(),
      handler: editor.cloneNode.bind(editor)
    },
    {
      name: '粘贴',
      key: 'paste-node',
      disabled: !editor.couldPaste(),
      handler: editor.pasteNode.bind(editor)
    }
  ];
};
