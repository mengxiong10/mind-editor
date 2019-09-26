import React, { useContext, useState, useEffect } from 'react';
import OverlayInput from './components/OverlayInput';
import EditorContext from './EditorContext';

let inputKey: string;

function EditorInput() {
  const editor = useContext(EditorContext);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [style, setStyle] = useState({});

  const handleInputConfirm = (val: string) => {
    editor.updateNode({ [inputKey]: val });
  };

  useEffect(() => {
    editor.setMode(visible ? 'lock' : 'default');
  }, [editor, visible]);

  useEffect(() => {
    editor.on('ed-text-edit', (evt: any) => {
      const { width, height, zoom, x, y } = evt;
      inputKey = evt.key;
      setVisible(true);
      setValue(evt.value);
      setStyle({
        width,
        height,
        left: x,
        top: y,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left'
      });
    });
  }, [editor]);

  return (
    <OverlayInput
      visible={visible}
      value={value}
      style={style}
      onConfirm={handleInputConfirm}
      onCancel={() => setVisible(false)}
    />
  );
}

export default EditorInput;
