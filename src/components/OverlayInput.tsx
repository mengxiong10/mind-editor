import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import TextArea from 'antd/es/input/TextArea';
import Overlay from './Overlay';

interface OverlayInputProps {
  visible: boolean;
  style: React.CSSProperties;
  value: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
}

function OverlayInput(props: OverlayInputProps) {
  const { visible, style, value } = props;
  const textareaRef = useRef<TextArea>(null);
  const cancelledRef = useRef<boolean>(false);
  const [innerValue, setInnerValue] = useState(value);

  const handleKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    // Esc
    if (evt.keyCode === 27) {
      setInnerValue(value);
      cancelledRef.current = true;
      textareaRef.current!.blur();
    } else if (evt.keyCode === 13) {
      if (evt.ctrlKey) {
        setInnerValue(v => `${v}\n`);
      }
      if (!evt.ctrlKey && !evt.shiftKey) {
        evt.preventDefault();
        textareaRef.current!.blur();
      }
    }
  };

  const handleBlur = () => {
    if (!cancelledRef.current) {
      props.onConfirm(innerValue);
    }
    props.onCancel();
    cancelledRef.current = false;
  };

  useEffect(() => {
    if (visible) {
      setInnerValue(value);
      textareaRef.current!.focus();
    }
  }, [value, visible]);

  const content = (
    <Overlay style={style} visible={visible}>
      <TextArea
        style={{
          fontSize: '12px',
          lineHeight: 1.5,
          overflow: 'hidden'
        }}
        ref={textareaRef}
        autosize
        value={innerValue}
        onChange={evt => setInnerValue(evt.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </Overlay>
  );
  return content;
}

export default React.memo(OverlayInput);
