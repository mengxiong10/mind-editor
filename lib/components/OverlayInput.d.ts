import React from 'react';
import 'antd/es/input/style/index.css';
interface OverlayInputProps {
    visible: boolean;
    style: React.CSSProperties;
    value: string;
    onConfirm: (val: string) => void;
    onCancel: () => void;
}
declare function OverlayInput(props: OverlayInputProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof OverlayInput>;
export default _default;
