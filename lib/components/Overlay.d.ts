import React from 'react';
interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    visible: boolean;
    style?: React.CSSProperties;
}
declare const _default: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
