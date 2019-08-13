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
import mxContextmenu from './behavior/ed-contextmenu';
import mxClickSelect from './behavior/ed-click-select';
import mxEdit from './behavior/ed-edit';
import mxResultEdit from './behavior/ed-result-edit';

G6.registerNode(registerExpandNode.name, registerExpandNode);
G6.registerNode(registerResultNode.name, registerResultNode);

G6.registerBehavior('ed-contextmenu', mxContextmenu);
G6.registerBehavior('ed-click-select', mxClickSelect);
G6.registerBehavior('ed-edit', mxEdit);
G6.registerBehavior('ed-result-edit', mxResultEdit);

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
          'ed-contextmenu',
          'ed-edit',
          'ed-result-edit',
          'drag-canvas',
          'zoom-canvas'
        ]
      }
    });
    this.currentId = '';
    this.read(this.parseData(data || defaultData));
    this.moveToCenter();
    this.bindEditorEvent();
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

  bindEditorEvent() {
    this.on('ed-node-contextmenu', evt => {
      this.setCurrent(evt.target.get('id'));
    });
    this.on('ed-node-selectchange', evt => {
      this.setCurrent(evt.target.get('id'));
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
