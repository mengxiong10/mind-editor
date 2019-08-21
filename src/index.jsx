/* eslint-disable import/no-unresolved */
import React, { useRef, useEffect, useCallback, useReducer } from 'react';
import 'antd/dist/antd.css';
import OverlayInput from './components/OverlayInput';
import OverlayMenu from './components/OverlayMenu';
import { Editor } from './editor';
import { menuItemsMap } from './option';

function reducer(state, action) {
  switch (action.type) {
    case 'show':
      return { ...state, visible: true, ...action.payload };
    case 'hide':
      return { ...state, visible: false };
    default:
      throw new Error();
  }
}

function TreeEditor(props) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const tempRef = useRef({});
  const [inputState, dispatchInput] = useReducer(reducer, {
    visible: false,
    value: '',
    style: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  });

  const [menuState, dispatchMenu] = useReducer(reducer, {
    visible: false,
    placement: 'bottomLeft',
    type: 'contextmenu',
    style: {
      top: 0,
      left: 0
    }
  });

  const menuItems = menuItemsMap[menuState.type];

  // 关闭输入框
  const handleInputClose = useCallback(() => {
    editorRef.current.setMode('default');
    dispatchInput({ type: 'hide' });
  }, []);

  // 确定输入框
  const handleInputConfirm = useCallback(val => {
    editorRef.current.updateNode({ [tempRef.current.inputKey]: val });
  }, []);

  // 关闭菜单
  const handleMenuClose = useCallback(() => {
    dispatchMenu({ type: 'hide' });
  }, []);

  const handleMenuSelect = useCallback(
    key => {
      const item = menuItems.find(v => String(v.key) === key);
      if (item) {
        editorRef.current.emit(item.event, item.value);
      }
    },
    [menuItems]
  );

  useEffect(() => {
    const editor = new Editor({ container: editorContainerRef.current });
    editorRef.current = editor;
    editor.on('ed-node-contextmenu', evt => {
      dispatchMenu({
        type: 'show',
        payload: {
          type: 'contextmenu',
          placement: 'bottomLeft',
          style: {
            top: evt.y,
            left: evt.x
          }
        }
      });
    });
    editor.on('ed-text-edit', evt => {
      const { width, height, zoom, x, y, value, key } = evt;
      tempRef.current.inputKey = key;
      editor.setMode('lock');
      dispatchInput({
        type: 'show',
        payload: {
          value,
          style: {
            width,
            height,
            left: x,
            top: y,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left'
          }
        }
      });
    });
    editor.on('ed-select-edit', evt => {
      dispatchMenu({
        type: 'show',
        payload: {
          type: evt.key,
          placement: 'bottomRight',
          style: {
            top: evt.y,
            left: evt.x
          }
        }
      });
    });
    editor.on('rc-add-node', () => editor.addNode());
    editor.on('rc-add-result-node', () => editor.addNode('result-node'));
    editor.on('rc-delete-node', () => editor.deleteNode());
    editor.on('rc-update-level', level => {
      editor.updateNode({ level });
    });
    editor.on('rc-mark', status => {
      editor.updateNode({ status });
    });
  }, []);

  return (
    <div
      ref={editorContainerRef}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <OverlayMenu
        {...menuState}
        items={menuItems}
        onSelect={handleMenuSelect}
        onClose={handleMenuClose}
      />
      <OverlayInput
        {...inputState}
        onConfirm={handleInputConfirm}
        onCancel={handleInputClose}
      />
    </div>
  );
}

export default TreeEditor;
