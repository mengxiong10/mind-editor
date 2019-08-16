/* eslint-disable class-methods-use-this */
import G6 from '@antv/g6/src/index';
import Hierarchy from '@antv/hierarchy';
import { nodeOptions } from './options';
import { levelOptions } from './nodeShape/resultNode';
import { getNodeModule } from './nodeShape';
import { guid } from './utils/base';
import edContextmenu from './behavior/ed-contextmenu';
import edClickSelect from './behavior/ed-click-select';
import edEdit from './behavior/ed-edit';
import edResultEdit from './behavior/ed-result-edit';
import edShortcut from './behavior/ed-shortcut';
import edDragNode from './behavior/ed-drag-node';

G6.registerBehavior('ed-contextmenu', edContextmenu);
G6.registerBehavior('ed-click-select', edClickSelect);
G6.registerBehavior('ed-edit', edEdit);
G6.registerBehavior('ed-result-edit', edResultEdit);
G6.registerBehavior('ed-shortcut', edShortcut);
G6.registerBehavior('ed-drag-node', edDragNode);

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
      edgeStyle: {
        default: nodeOptions.edgeStyle
      },
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
              { keyCode: 35, handler: 'addResultNode' }, // end
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
    this.clipboardData = null;
    this.read(this.parseData(data || defaultData));
    this.moveToCenter();
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
    const nodeModule = getNodeModule(node.shape);
    const result = nodeModule.createNode(node);
    if (result.children) {
      result.children.forEach(v => this.parseData(v, result.id));
    }
    return result;
  }

  setCurrent(id) {
    this.currentId = id;
  }

  addNode(label = '条件分支') {
    if (this.currentId) {
      const nodeModule = getNodeModule('expand-node');
      const data = nodeModule.createNode({
        parent: this.currentId,
        label
      });
      this.addChild(data, this.currentId);
    }
  }

  addResultNode() {
    if (this.currentId) {
      const nodeModule = getNodeModule('result-node');
      const data = nodeModule.createNode({
        parent: this.currentId
      });
      this.addChild(data, this.currentId);
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
        const nodeModule = getNodeModule(currentModel.shape);
        const newModel = nodeModule.updateNode(currentModel, obj);
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
      this.clipboardData = this.currentId;
    }
  }

  pasteNode() {
    if (this.currentId && this.clipboardData) {
      const currentModel = this.findDataById(this.clipboardData);
      if (currentModel) {
        const data = this._cloneNode(currentModel, this.currentId);
        this.addChild(data, this.currentId);
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

export { levelOptions };
