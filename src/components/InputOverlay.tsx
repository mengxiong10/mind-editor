import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect
} from 'react';
import ReactDOM from 'react-dom';
import TextArea from 'antd/es/input/TextArea';

interface ContextMenuProps {
  visible: boolean;
  left: number;
  top: number;
  width: number;
  value: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
}

function ContextMenu(props: ContextMenuProps) {
  const { visible, left, top, width, value } = props;
  const textareaRef = useRef<TextArea>(null);
  const cancelledRef = useRef<boolean>(false);
  const [innerValue, setInnerValue] = useState(value);
  const style = {
    display: visible ? 'block' : 'none',
    top,
    left,
    width
  };

  const handleConfirm = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.shiftKey || evt.ctrlKey) {
      evt.preventDefault();
      textareaRef.current!.blur();
    }
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.keyCode === 27) {
      setInnerValue(value);
      cancelledRef.current = true;
      props.onCancel();
    }
  };

  const handleBlur = () => {
    if (!cancelledRef.current) {
      props.onConfirm(innerValue);
    }
    cancelledRef.current = false;
  };

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    if (visible) {
      textareaRef.current!.focus();
    }
  }, [visible]);

  const content = (
    <div
      style={{
        position: 'fixed',
        ...style
      }}
    >
      <TextArea
        style={{ fontSize: '12px' }}
        ref={textareaRef}
        autosize
        value={innerValue}
        onChange={evt => setInnerValue(evt.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onPressEnter={handleConfirm}
        onBlur={handleBlur}
      />
    </div>
  );
  return ReactDOM.createPortal(content, document.body);
}

export default ContextMenu;
