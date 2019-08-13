/* eslint-disable import/no-unresolved */
import React, {
  useRef,
  useEffect,
  useCallback,
  useReducer,
  Reducer
} from 'react';
import 'antd/dist/antd.css';
import OverlayInput from './OverlayInput';
import OverlayMenu, { OverlayMenuProps } from './OverlayMenu';
import { Editor } from '../editor';
import { menuItemsMap } from './options';

interface TreeEditorProps {}

interface ReducerAction<S> {
  type: 'show' | 'hide';
  payload?: Partial<S>;
}

interface InputState {
  visible: boolean;
  value: string;
  style: { top: number; left: number; width: number };
}

interface MenuState {
  visible: boolean;
  style: { top: number; left: number };
  placement: OverlayMenuProps['placement'];
  type: keyof typeof menuItemsMap;
}

function reducer<S>(state: S, action: ReducerAction<S>) {
  switch (action.type) {
    case 'show':
      return { ...state, visible: true, ...action.payload };
    case 'hide':
      return { ...state, visible: false };
    default:
      throw new Error();
  }
}

type VisibleReducer<S> = Reducer<S, ReducerAction<S>>;

function TreeEditor(props: TreeEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const tempRef = useRef<any>({});
  const [inputState, dispatchInput] = useReducer<VisibleReducer<InputState>>(
    reducer,
    {
      visible: false,
      value: '',
      style: {
        top: 0,
        left: 0,
        width: 0
      }
    }
  );

  const [menuState, dispatchMenu] = useReducer<VisibleReducer<MenuState>>(
    reducer,
    {
      visible: false,
      placement: 'bottomLeft',
      type: 'contextmenu',
      style: {
        top: 0,
        left: 0
      }
    }
  );

  const menuItems = menuItemsMap[menuState.type];

  // 关闭输入框
  const handleInputClose = useCallback(() => {
    dispatchInput({ type: 'hide' });
  }, []);

  // 确定输入框
  const handleInputConfirm = useCallback((val: string) => {
    editorRef.current.updateNode({ [tempRef.current.inputKey]: val }, true);
  }, []);

  // 关闭菜单
  const handleMenuClose = useCallback(() => {
    dispatchMenu({ type: 'hide' });
  }, []);

  const handleMenuSelect = useCallback(
    (key: string) => {
      const item = menuItems.find(v => String(v.key) === key);
      if (item) {
        editorRef.current.emit(item.event, item.value);
      }
    },
    [menuItems]
  );

  useEffect(() => {
    const editor: any = new Editor({ container: editorContainerRef.current });
    editorRef.current = editor;
    editor.on('ed-node-contextmenu', (evt: any) => {
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
    editor.on('ed-text-edit', (evt: any) => {
      const { width, x, y, value, key } = evt;
      tempRef.current.inputKey = key;
      dispatchInput({
        type: 'show',
        payload: {
          value,
          style: {
            width,
            left: x,
            top: y
          }
        }
      });
    });
    editor.on('ed-select-edit', (evt: any) => {
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
    editor.on('rc-add-result-node', () => editor.addResultNode());
    editor.on('rc-delete-node', () => editor.deleteNode());
    editor.on('rc-update-level', (level: number) =>
      editor.updateNode({ level }, false)
    );
  }, []);

  return (
    <div
      ref={editorContainerRef}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%'
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
