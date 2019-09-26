import React from 'react';
import 'antd/es/menu/style/index.css';
import 'antd/es/dropdown/style/index.css';
export interface OverlayMenuItem {
    key: string | number;
    name?: string;
    type?: 'Item' | 'Divider';
    handler?: (editor?: any) => void;
}
export interface OverlayMenuProps {
    placement?: 'bottomLeft' | 'bottomRight';
    visible: boolean;
    style: React.CSSProperties;
    onClose: () => void;
    onSelect: (key: string) => void;
    items: OverlayMenuItem[];
}
declare function OverlayMenu(props: OverlayMenuProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof OverlayMenu>;
export default _default;
