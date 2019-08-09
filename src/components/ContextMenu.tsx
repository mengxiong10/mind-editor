import React from 'react';
import ReactDOM from 'react-dom';
import { Menu } from 'antd';
import { FunctionKeys } from 'utility-types';

interface ContextMenuProps {
  visible: boolean;
  left: number;
  top: number;
  onAddNode: () => void;
}

function ContextMenu(props: ContextMenuProps) {
  const { visible, left, top } = props;
  const style = {
    display: visible ? 'block' : 'none',
    top,
    left
  };

  const handleClick = ({ key }: { key: string }) => {
    if (typeof props[key as FunctionKeys<ContextMenuProps>] === 'function') {
      props[key as FunctionKeys<ContextMenuProps>]();
    }
  };

  const menu = (
    <div
      style={{
        position: 'fixed',
        ...style
      }}
    >
      <Menu
        prefixCls="ant-dropdown-menu"
        onClick={handleClick}
        selectable={false}
      >
        <Menu.Item key="onAddNode">新增条件</Menu.Item>
        <Menu.Item key="2">新增哈哈</Menu.Item>
        <Menu.Item key="delete">3rd menu item</Menu.Item>
      </Menu>
    </div>
  );
  return ReactDOM.createPortal(menu, document.body);
}

export default ContextMenu;
