/* eslint-disable import/no-unresolved */
import React, { useRef, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import OverlayInput from './OverlayInput';
import OverlayMenu from './OverlayMenu';
import { Editor } from '../editor';

interface TreeEditorProps {}

function TreeEditor(props: TreeEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const tempRef = useRef<any>({});
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

  const handleDeleteNode = () => {
    editorRef.current.deleteNode();
    setContextMenuVisible(false);
  };

  const contextMenuItems = [
    { name: '新增条件', key: 'addNode', onClick: handleAddNode },
    { name: '删除节点', key: 'deleteNode', onClick: handleDeleteNode }
  ];

  const hideInput = () => {
    setInputVisible(false);
  };

  const handleInputConfirm = (val: string) => {
    editorRef.current.updateNodeText(tempRef.current.inputKey, val);
    hideInput();
  };

  useEffect(() => {
    editorRef.current = new Editor({ container: editorContainerRef.current });
    editorRef.current.on('mx-node-contextmenu', (evt: any) => {
      setContextMenuVisible(true);
      setContextMenuPosition({ top: evt.canvasY, left: evt.canvasX });
    });
    editorRef.current.on('mousedown', () => {
      setContextMenuVisible(false);
    });
    editorRef.current.on('mx-text-edit', (evt: any) => {
      const { width, x, y, value, key } = evt;
      tempRef.current.inputKey = key;
      setInputVisible(true);
      setInputValue(value);
      setInputPosition({ left: x, top: y, width });
    });
  }, []);

  return (
    <div
      ref={editorContainerRef}
      style={{
        position: 'relative',
        height: '100%',
        width: '500px',
        margin: '200px auto 30px',
        border: '1px solid skyblue'
      }}
    >
      <OverlayMenu
        style={contextMenuPosition}
        visible={contextMenuVisible}
        items={contextMenuItems}
      />
      <OverlayInput
        style={inputPosition}
        visible={inputVisible}
        value={inputValue}
        onConfirm={handleInputConfirm}
        onCancel={hideInput}
      />
    </div>
  );
}

export default TreeEditor;
