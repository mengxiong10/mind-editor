import React, { useState, useEffect, useContext } from 'react';
import OverlayMenu, { OverlayMenuItem } from './components/OverlayMenu';
import EditorContext from './EditorContext';
import { getContextMenuItems } from './contextMenuItems';

interface ContextMenuProps {
  placement?: 'bottomLeft' | 'bottomRight';
}

function ContextMenu({ placement = 'bottomLeft' }: ContextMenuProps) {
  const editor = useContext(EditorContext);

  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({});
  const [items, setItems] = useState<OverlayMenuItem[]>([]);

  const handleMenuSelect = (key: string) => {
    const item = items.find(v => String(v.key) === key);
    if (item && typeof item.handler === 'function') {
      item.handler();
    }
  };

  useEffect(() => {
    const currentMode = editor.getCurrentMode();
    const nextMode = visible ? 'lock' : 'default';
    if (currentMode !== nextMode) {
      editor.setMode(nextMode);
    }
  }, [editor, visible]);

  useEffect(() => {
    editor.on('ed-node-contextmenu', (evt: any) => {
      setVisible(true);
      setStyle({ top: evt.y, left: evt.x });
      setItems(getContextMenuItems(editor));
    });
  }, [editor]);

  return (
    <OverlayMenu
      style={style}
      visible={visible}
      placement={placement}
      items={items}
      onSelect={handleMenuSelect}
      onClose={() => setVisible(false)}
    />
  );
}

export default ContextMenu;
