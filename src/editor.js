/* eslint-disable class-methods-use-this */
import G6 from '@antv/g6/src/index';
import Hierarchy from '@antv/hierarchy';
import { nodeOptions } from './options';
import { registerExpandNode, ExpandNode } from './nodes/expandNode';
import { registerResultNode, ResultNode } from './nodes/resultNode';
import mxContextmenu from './behavior/mx-contextmenu';
import mxClickSelect from './behavior/mx-click-select';
import mxEdit from './behavior/mx-edit';
import mxResultEdit from './behavior/mx-result-edit';

G6.registerNode(registerExpandNode.name, registerExpandNode);
G6.registerNode(registerResultNode.name, registerResultNode);

G6.registerBehavior('mx-contextmenu', mxContextmenu);
G6.registerBehavior('mx-click-select', mxClickSelect);
G6.registerBehavior('mx-edit', mxEdit);
G6.registerBehavior('mx-result-edit', mxResultEdit);

const nodeClassMap = {
  [registerExpandNode.name]: ExpandNode,
  [registerResultNode.name]: ResultNode
};

const initialData = {
  label: '我是根\n节点\n55555',
  children: [
    {
      label: '测1\n测试'
    },
    {
      shape: 'result-node',
      label: '测试一下哈',
      description: '哈哈哈哈'
    }
  ]
};

function parseData(node) {
  let result;
  if (node.shape === 'result-node') {
    result = new ResultNode(node);
  } else {
    result = new ExpandNode(node);
  }

  if (node.children) {
    result.children = node.children.map(v =>
      parseData({ ...v, parent: result.id })
    );
  }
  return result;
}

const data1 = parseData(initialData);

export class Editor extends G6.TreeGraph {
  constructor({ container }) {
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
            type: 'mx-click-select',
            shouldUpdate(evt) {
              const target = evt.target;
              return target.get('className') !== 'collapse-icon';
            }
          },
          'mx-contextmenu',
          'mx-edit',
          'mx-result-edit',
          'drag-canvas',
          'zoom-canvas'
        ]
      }
    });
    this.currentId = '';
    this.NodeClass = undefined;
    this.read(data1);
    this.moveToCenter();
    this.bindEditorEvent();
  }

  setCurrent(id) {
    this.currentId = id;
    const current = this.findById(this.currentId);
    const shape = current.get('currentShape');
    this.NodeClass = nodeClassMap[shape];
  }

  bindEditorEvent() {
    this.on('mx-node-contextmenu', evt => {
      this.setCurrent(evt.target.get('id'));
    });
    this.on('mx-node-selectchange', evt => {
      this.setCurrent(evt.target.get('id'));
    });
  }

  addNode(label = '条件分支') {
    if (this.currentId) {
      const data = new ExpandNode({ label, parent: this.currentId });
      this.addChild(data, this.currentId);
    }
  }

  deleteNode() {
    if (this.currentId) {
      this.removeChild(this.currentId);
    }
  }

  updateNodeText(key, value) {
    if (this.currentId) {
      const current = this.findById(this.currentId);
      const currentModel = current.getModel();
      if (currentModel && currentModel[key] !== value && this.NodeClass) {
        const newNode = new this.NodeClass({ ...currentModel, [key]: value });
        if (currentModel.parent) {
          const parentModel = this.findDataById(currentModel.parent);
          const index = parentModel.children.findIndex(
            v => v.id === this.currentId
          );
          parentModel.children.splice(index, 1, newNode);
        } else {
          this.data(newNode);
        }
        this.changeData();
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
