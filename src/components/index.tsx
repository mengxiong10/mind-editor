/* eslint-disable import/no-unresolved */
import React, { useRef, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import ContextMenu from './ContextMenu';
import InputOverlay from './InputOverlay';
import { Editor } from '../editor';

interface TreeEditorProps {}

function TreeEditor(props: TreeEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0
  });
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [inputPosition, setInputPosition] = useState({
    top: 0,
    left: 0,
    width: 0
  });

  const handleAddNode = () => {
    editorRef.current.addNode();
    setContextMenuVisible(false);
  };

  const hideInput = () => {
    setInputVisible(false);
  };

  const handleInputConfirm = (val: string) => {
    editorRef.current.updateCurrentLabel(val);
    hideInput();
  };

  useEffect(() => {
    editorRef.current = new Editor({ container: editorContainerRef.current });
    editorRef.current.on('mx-node-contextmenu', (ev: any) => {
      const { clientX, clientY } = ev;
      setContextMenuVisible(true);
      setContextMenuPosition({ top: clientY, left: clientX });
    });
    editorRef.current.on('mousedown', () => {
      setContextMenuVisible(false);
    });
    editorRef.current.on('mx-node-edit', (evt: any) => {
      const { graph, item } = evt;
      const box = item.getBBox();
      const model = item.getModel();
      const { x, y } = graph.getClientByPoint(box.x, box.y);
      setInputVisible(true);
      setInputValue(model.label);
      setInputPosition({ left: x, top: y, width: box.width });
    });
  }, []);

  return (
    <div
      style={{
        height: '100%',
        width: '500px',
        margin: '200px auto 30px',
        border: '1px solid skyblue'
      }}
    >
      <ContextMenu
        {...contextMenuPosition}
        visible={contextMenuVisible}
        onAddNode={handleAddNode}
      />
      <InputOverlay
        {...inputPosition}
        visible={inputVisible}
        value={inputValue}
        onConfirm={handleInputConfirm}
        onCancel={hideInput}
      />
      <div style={{ height: '100%' }} ref={editorContainerRef} />
    </div>
  );
}

export default TreeEditor;
