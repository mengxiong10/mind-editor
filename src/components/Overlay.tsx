import React from 'react';

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  visible: boolean;
  style?: React.CSSProperties;
}

function Overlay(
  { children, visible, style, ...rest }: OverlayProps,
  ref: React.Ref<HTMLDivElement>
) {
  const display = visible ? 'block' : 'none';
  const styleObj = {
    position: 'absolute' as 'absolute',
    display,
    ...style
  };
  return (
    <div style={styleObj} {...rest} ref={ref}>
      {children}
    </div>
  );
}

export default React.forwardRef(Overlay);
