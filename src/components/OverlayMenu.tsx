import React from 'react';
import { Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import Overlay from './Overlay';

interface ContextMenuProps {
  visible: boolean;
  style: React.CSSProperties;
  items: {
    key: string;
    name: string;
    onClick: () => void;
  }[];
}

function ContextMenu(props: ContextMenuProps) {
  const { visible, style, items } = props;

  const handleClick = (evt: ClickParam) => {
    const key = evt.key;
    const item = items.find(v => v.key === key);
    if (item && item.onClick) {
      item.onClick();
    }
  };

  const menu = (
    <Overlay style={style} visible={visible}>
      <Menu
        prefixCls="ant-dropdown-menu"
        onClick={handleClick}
        selectable={false}
      >
        {items.map(item => (
          <Menu.Item key={item.key}>{item.name}</Menu.Item>
        ))}
      </Menu>
    </Overlay>
  );
  return menu;
  // return ReactDOM.createPortal(menu, document.body);
}

export default ContextMenu;
