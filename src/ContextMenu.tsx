import React, { useState, useEffect, useContext } from 'react';
import OverlayMenu, { OverlayMenuItem } from './components/OverlayMenu';
import EditorContext from './EditorContext';
import { contextMenuItems } from './contextMenuItems';

interface ContextMenuProps {
  items?: OverlayMenuItem[];
  placement?: 'bottomLeft' | 'bottomRight';
  event?: string;
}

function ContextMenu({
  placement = 'bottomLeft',
  event = 'ed-node-contextmenu',
  items = contextMenuItems
}: ContextMenuProps) {
  const editor = useContext(EditorContext);

  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({});

  const handleMenuSelect = (key: string) => {
    const item = items.find(v => String(v.key) === key);
    if (item && typeof item.handler === 'function') {
      item.handler(editor);
    }
  };

  useEffect(() => {
    editor.on(event, (evt: any) => {
      setVisible(true);
      setStyle({ top: evt.y, left: evt.x });
    });
  }, [editor, event]);

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
