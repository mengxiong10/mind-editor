import React from 'react';

interface OverlayProps {
  children: React.ReactNode;
  visible: boolean;
  style?: React.CSSProperties;
}

function Overlay({ children, visible, style }: OverlayProps) {
  const display = visible ? 'block' : 'none';
  const styleObj = {
    position: 'absolute' as 'absolute',
    display,
    ...style
  };
  return <div style={styleObj}>{children}</div>;
}

export default Overlay;
