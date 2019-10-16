/* eslint-disable class-methods-use-this */
import G6 from '@antv/g6';
import Hierarchy from '@antv/hierarchy';
import { edgeStyle } from './style';
import { getNodeModule } from '../nodeModules';
import { guid } from '../utils/base';
import { registerCustomNode } from '../nodeShape';
import { registerCustomBehavior } from '../behavior';

registerCustomNode(G6);
registerCustomBehavior(G6);

const defaultData = {
  label: '我是根节点'
};

class Editor extends G6.TreeGraph {
  constructor({ container, data }) {
    super({
      container,
      width: container.offsetWidth,
      height: container.offsetHeight,
      animate: false,
      layout: function layout(val) {
        return Hierarchy.compactBox(val, {
          direction: 'LR',
          getId: function getId(d) {
            return d.id;
          },
          getWidth(cfg) {
            return cfg.width;
          },
          getHeight(cfg) {
            return cfg.height;
          },
          getVGap: function getVGap() {
            return 5;
          },
          getHGap: function getHGap() {
            return 40;
          }
        });
      },
      defaultNode: {
        shape: 'expand-node'
      },
      defaultEdge: {
        shape: 'cubic-horizontal'
      },
      edgeStyle,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            shouldBegin(evt) {
              const target = evt.target;
              return target.get('className') === 'collapse-icon';
            }
          },
          {
            type: 'ed-click-select',
            shouldUpdate(evt) {
              const target = evt.target;
              return target.get('className') !== 'collapse-icon';
            }
          },
          {
            type: 'ed-shortcut',
            shortcuts: [
              { keyCode: [45, 9], handler: 'addNode' }, // insert tab
              { keyCode: 46, handler: 'deleteNode' }, // delete
              // {
              //   keyCode: 35,
              //   handler: 'addNode',
              //   arguments: 'result-node'
              // }, // end
              { keyCode: 32, handler: 'moveToCenter' }, // space
              { keyCode: 67, ctrlKey: true, handler: 'cloneNode' }, // ctrl + c
              { keyCode: 86, ctrlKey: true, handler: 'pasteNode' } // ctrl + v
            ]
          },
          'ed-drag-node',
          'ed-contextmenu',
          'ed-edit',
          'ed-result-edit',
          'drag-canvas',
          'zoom-canvas'
        ],
        lock: []
      },
      mode: 'default'
    });
    this.currentId = null;
    this.clipboardId = null;
    this.read(this.parseData(data || defaultData));
    this.moveToCenter();
    // 加入到extendEvents, destroy 的时候 就会 remove
    this.get('eventController').extendEvents.push(this._bindForceEvent());
    if (process.env.NODE_ENV === 'development') {
      window.treeEditor = this;
    }
  }

  // 初始化数据
  parseData(node, parent) {
    node.parent = parent;
    if (!node.shape) {
      node.shape = 'expand-node';
    }
    const result = getNodeModule(node.shape).create(node);
    if (result.children) {
      result.children.forEach(v => this.parseData(v, result.id));
    }
    return result;
  }

  setCurrent(id) {
    if (this.currentId === id) {
      return;
    }
    const autoPaint = this.get('autoPaint');
    this.setAutoPaint(false);
    if (this.currentId) {
      const oldItem = this.findById(this.currentId);
      if (oldItem) {
        this.setItemState(oldItem, 'selected', false);
      }
    }
    if (id) {
      const item = this.findById(id);
      if (item) {
        this.setItemState(item, 'selected', true);
      }
    }
    this.currentId = id;
    this.setAutoPaint(autoPaint);
    this.paint();
  }

  shouldAddChild(data, parentData) {
    const parentModule = getNodeModule(parentData.shape);
    const dataModule = getNodeModule(data.shape);
    return (
      parentModule.shouldAddChild(data) && dataModule.shouldBeAppend(parentData)
    );
  }

  addChildWithValidate(data, parent) {
    const parentData = this.findDataById(parent);
    if (!this.shouldAddChild(data, parentData)) {
      return false;
    }
    if (!parentData.children) {
      parentData.children = [];
    }
    parentData.children.push(data);
    this.changeData();
    return true;
  }

  addNode(shape = 'expand-node') {
    if (this.currentId) {
      const data = getNodeModule(shape).create({
        parent: this.currentId
      });
      const success = this.addChildWithValidate(data, this.currentId);
      if (success) {
        this.setCurrent(data.id);
        this.editNode();
      }
    }
  }

  deleteNode() {
    if (this.currentId) {
      const id = this.currentId;
      this.setCurrent(null);
      this.removeChild(id);
    }
  }

  updateNode(obj) {
    const id = obj.id || this.currentId;
    if (id) {
      const currentModel = this.findDataById(id);
      if (currentModel) {
        const oldWidth = currentModel.width;
        const oldHeight = currentModel.height;
        const newModel = getNodeModule(currentModel.shape).update(
          currentModel,
          obj
        );
        const { width, height } = newModel;
        if (width !== oldWidth || height !== oldHeight) {
          this.changeData();
        } else {
          this.update(id, newModel);
        }
        this.emit('after-update-node', newModel);
      }
    }
  }

  editNode(item) {
    item = item || this.findById(this.currentId);
    const model = item.getModel();
    const { x, y } = this.getCanvasByPoint(model.x, model.y);
    const zoom = this.getZoom();
    this.emit('ed-text-edit', {
      x,
      y,
      zoom,
      width: model.width,
      height: model.height,
      key: 'label',
      value: model.label
    });
  }

  couldDelete() {
    if (!this.currentId) {
      return false;
    }
    const data = this.findDataById(this.currentId);
    return data && !!data.parent;
  }

  couldClone() {
    return !!this.currentId;
  }

  couldPaste() {
    return (
      this.currentId && this.clipboardId && this.findDataById(this.clipboardId)
    );
  }

  cloneNode() {
    if (this.couldClone()) {
      this.clipboardId = this.currentId;
    }
  }

  pasteNode() {
    if (this.couldPaste()) {
      const currentModel = this.findDataById(this.clipboardId);
      const data = this._cloneNode(currentModel, this.currentId);
      this.addChildWithValidate(data, this.currentId);
    }
  }

  _cloneNode(node, parent) {
    const result = { ...node, id: guid(), parent };
    if (Array.isArray(result.children)) {
      result.children = result.children.map(v => this._cloneNode(v, result.id));
    }
    return result;
  }

  _bindForceEvent() {
    let timer;
    const windowForceResizeEvent = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.forceFit();
      }, 200);
    };
    return G6.Util.addEventListener(window, 'resize', windowForceResizeEvent);
  }

  forceFit() {
    const container = this.get('container');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.changeSize(width, height);
  }

  moveToCenter() {
    const tree = this;
    const width = tree.get('width');
    const height = tree.get('height');
    const viewCenter = {
      x: width / 2,
      y: height / 2
    };
    const group = tree.get('group');
    group.resetMatrix();
    const bbox = group.getBBox();
    const groupCenter = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };
    tree.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
  }
}

export default Editor;
