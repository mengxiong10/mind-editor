import React, { useEffect, useRef } from 'react';
import Menu, { ClickParam } from 'antd/es/menu';
import 'antd/es/menu/style/index.css';
import 'antd/es/dropdown/style/index.css';
import Overlay from './Overlay';

export interface OverlayMenuProps {
  placement?: 'bottomLeft' | 'bottomRight';
  visible: boolean;
  style: React.CSSProperties;
  onClose: () => void;
  onSelect: (key: string) => void;
  items: {
    key: string | number;
    name?: string;
    type?: 'Item' | 'Divider';
  }[];
}

function OverlayMenu(props: OverlayMenuProps) {
  const {
    placement = 'bottomLeft',
    visible,
    style,
    items,
    onClose,
    onSelect
  } = props;

  const placementStyle = {
    bottomLeft: {},
    bottomRight: {
      transform: 'translate(-100%)'
    }
  };
  const innerStyle = {
    ...style,
    ...placementStyle[placement]
  };

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (evt: ClickParam) => {
    const key = evt.key;
    onSelect(key);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (evt: Event) => {
      if (ref.current && !ref.current.contains(evt.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const menu = (
    <Overlay style={innerStyle} visible={visible} ref={ref}>
      <Menu
        prefixCls="ant-dropdown-menu"
        onClick={handleClick}
        selectable={false}
      >
        {items.map(item => {
          if (item.type === 'Divider') {
            return <Menu.Divider key={item.key} />;
          }
          return <Menu.Item key={item.key}>{item.name}</Menu.Item>;
        })}
      </Menu>
    </Overlay>
  );
  return menu;
}

export default React.memo(OverlayMenu);
