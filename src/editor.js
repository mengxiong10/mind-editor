/* eslint-disable class-methods-use-this */
import G6 from '@antv/g6/src/index';
import Hierarchy from '@antv/hierarchy';
import { nodeOptions } from './options';
import { registerExpandNode, ExpandNode } from './nodes/expandNode';
import {
  registerResultNode,
  ResultNode,
  levelOptions
} from './nodes/resultNode';
import edContextmenu from './behavior/ed-contextmenu';
import edClickSelect from './behavior/ed-click-select';
import edEdit from './behavior/ed-edit';
import edResultEdit from './behavior/ed-result-edit';
import edMoveToCenter from './behavior/ed-move-to-center';

G6.registerNode(registerExpandNode.name, registerExpandNode);
G6.registerNode(registerResultNode.name, registerResultNode);

G6.registerBehavior('ed-contextmenu', edContextmenu);
G6.registerBehavior('ed-click-select', edClickSelect);
G6.registerBehavior('ed-edit', edEdit);
G6.registerBehavior('ed-result-edit', edResultEdit);
G6.registerBehavior('ed-move-to-center', edMoveToCenter);

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
          'ed-move-to-center',
          'ed-contextmenu',
          'ed-edit',
          'ed-result-edit',
          'drag-canvas',
          'zoom-canvas'
        ],
        lock: []
      }
    });
    this.currentId = '';
    this.read(this.parseData(data || defaultData));
    this.moveToCenter();
    this.bindKeyboardEvent();
  }

  // 初始化数据
  parseData(node) {
    let result;
    if (node.shape === 'result-node') {
      result = new ResultNode(node);
    } else {
      result = new ExpandNode(node);
    }

    if (node.children) {
      result.children = node.children.map(v =>
        this.parseData({ ...v, parent: result.id })
      );
    }
    return result;
  }

  setCurrent(id) {
    this.currentId = id;
  }

  bindKeyboardEvent() {
    const keyMap = {
      '45': this.addNode, // insert
      '9': this.addNode, // tab
      '46': this.deleteNode, // delete
      '35': this.addResultNode // end
    };
    this.on('keydown', evt => {
      const code = evt.keyCode;
      if (keyMap[code]) {
        evt.preventDefault();
        keyMap[code].call(this);
      }
    });
  }

  addNode(label = '条件分支') {
    if (this.currentId) {
      const data = new ExpandNode({ label, parent: this.currentId });
      this.addChild(data, this.currentId);
    }
  }

  addResultNode() {
    if (this.currentId) {
      const data = new ResultNode({ parent: this.currentId });
      this.addChild(data, this.currentId);
    }
  }

  deleteNode() {
    if (this.currentId) {
      this.removeChild(this.currentId);
    }
  }

  updateNode(obj, updatePosition = false) {
    if (this.currentId) {
      const currentModel = this.findDataById(this.currentId);
      if (currentModel) {
        let hasChange = false;
        Object.keys(obj).forEach(key => {
          if (obj[key] !== currentModel[key]) {
            currentModel[key] = obj[key];
            hasChange = true;
          }
        });
        if (!hasChange) {
          return;
        }
        if (updatePosition) {
          currentModel.calNodeSize();
          this.changeData();
        } else {
          this.findById(this.currentId).set('model', { ...currentModel });
          this.refresh();
        }
      }
    }
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
