import React, { Component } from 'react';
import OverlayInput from './components/OverlayInput';
import OverlayMenu from './components/OverlayMenu';
import { Editor } from './editor';
import { menuItemsMap } from './option';

class TreeEditor extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.inputKey = '';
    this.containerRef = React.createRef();
    this.state = {
      inputState: {
        visible: false,
        value: '',
        style: {}
      },
      menuState: {
        visible: false,
        placement: 'bottomLeft',
        items: [],
        style: {}
      }
    };
  }

  componentDidMount() {
    const editor = new Editor({ container: this.containerRef.current });
    this.editor = editor;
    // 编辑
    editor.on('ed-text-edit', evt => {
      const { width, height, zoom, x, y, value, key } = evt;
      this.inputKey = key;
      this.showInput({
        value,
        style: {
          width,
          height,
          left: x,
          top: y,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }
      });
    });
    // 上下文菜单
    editor.on('ed-node-contextmenu', evt => {
      this.showMenu({
        items: menuItemsMap.contextmenu,
        placement: 'bottomLeft',
        style: {
          top: evt.y,
          left: evt.x
        }
      });
    });
    // 下拉框编辑
    editor.on('ed-select-edit', evt => {
      this.showMenu({
        items: menuItemsMap[evt.key],
        placement: 'bottomRight',
        style: {
          top: evt.y,
          left: evt.x
        }
      });
    });
  }

  showInput = obj => {
    this.editor.setMode('lock');
    this.setState(prevState => {
      return {
        inputState: {
          ...prevState.inputState,
          ...obj,
          visible: true
        }
      };
    });
  };

  hideInput = () => {
    this.editor.setMode('default');
    this.setState(prevState => {
      return {
        inputState: {
          ...prevState.inputState,
          visible: false
        }
      };
    });
  };

  showMenu = obj => {
    this.setState(prevState => {
      return {
        menuState: {
          ...prevState.menuState,
          ...obj,
          visible: true
        }
      };
    });
  };

  hideMenu = () => {
    this.setState(prevState => {
      return {
        menuState: {
          ...prevState.menuState,
          visible: false
        }
      };
    });
  };

  handleMenuSelect = key => {
    const menuItems = this.state.menuState.items;
    const item = menuItems.find(v => String(v.key) === key);
    if (item && item.handler && this.editor[item.handler]) {
      const args = [].concat(item.arguments);
      this.editor[item.handler](...args);
    }
  };

  handleInputConfirm = val => {
    this.editor.updateNode({ [this.inputKey]: val });
  };

  render() {
    const { menuState, inputState } = this.state;
    // const { children } = this.props;
    return (
      <div
        ref={this.containerRef}
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* {children} */}
        <OverlayMenu
          {...menuState}
          onSelect={this.handleMenuSelect}
          onClose={this.hideMenu}
        />
        <OverlayInput
          {...inputState}
          onConfirm={this.handleInputConfirm}
          onCancel={this.hideInput}
        />
      </div>
    );
  }
}

export default TreeEditor;
