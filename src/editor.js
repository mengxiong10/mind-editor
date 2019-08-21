/* eslint-disable class-methods-use-this */
import G6 from '@antv/g6/src/index';
import Hierarchy from '@antv/hierarchy';
import { edgeStyle } from './style';
import { getNodeModule } from './nodeModules';
import { guid } from './utils/base';
import { registerCustomNode } from './nodeShape';
import { registerCustomBehavior } from './behavior';

registerCustomNode(G6);
registerCustomBehavior(G6);

const defaultData = {
  label: '我是根节点'
};

export class Editor extends G6.TreeGraph {
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
              {
                keyCode: 35,
                handler: 'addNode',
                arguments: 'result-node'
              }, // end
              { keyCode: 32, handler: 'moveToCenter' }, // space
              { keyCode: 67, ctrlKey: true, handler: 'cloneNode' }, // ctrl + c
              { keyCode: 86, ctrlKey: true, handler: 'pasteNode' } // ctrl + v
            ]
          },
          {
            type: 'ed-drag-node'
          },
          'ed-contextmenu',
          'ed-edit',
          'ed-result-edit',
          'drag-canvas',
          'zoom-canvas'
        ],
        lock: []
      }
    });
    this.currentId = null;
    this.clipboardId = null;
    this.read(this.parseData(data || defaultData));
    this.moveToCenter();
    // 加入到extendEvents, destroy 的时候 就会 remove
    this.get('eventController').extendEvents.push(this._bindForceEvent());
    if (process.env.NODE_ENV === 'development') {
      window.tree = this;
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
    this.currentId = id;
  }

  shouldAddChild(data, parentData) {
    const parentModule = getNodeModule(parentData.shape);
    const dataModule = getNodeModule(data.shape);
    return (
      parentModule.shouldAddChild(data) && dataModule.shouldBeInsert(parentData)
    );
  }

  addChildWithValidate(data, parent) {
    const parentData = this.findDataById(parent);
    if (!this.shouldAddChild(data, parentData)) {
      return;
    }
    if (!parentData.children) {
      parentData.children = [];
    }
    parentData.children.push(data);
    this.changeData();
  }

  addNode(shape = 'expand-node') {
    if (this.currentId) {
      const data = getNodeModule(shape).create({
        parent: this.currentId
      });
      this.addChildWithValidate(data, this.currentId);
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
    if (this.currentId) {
      const currentModel = this.findDataById(this.currentId);
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
          this.update(this.currentId, newModel);
        }
      }
    }
  }

  cloneNode() {
    if (this.currentId) {
      this.clipboardId = this.currentId;
    }
  }

  pasteNode() {
    if (this.currentId && this.clipboardId) {
      const currentModel = this.findDataById(this.clipboardId);
      if (currentModel) {
        const data = this._cloneNode(currentModel, this.currentId);
        this.addChildWithValidate(data, this.currentId);
      }
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
