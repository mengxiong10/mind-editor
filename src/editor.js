/* eslint-disable class-methods-use-this */
import G6 from '@antv/g6/src/index';
import Hierarchy from '@antv/hierarchy';
import { nodeOptions } from './options';
import registerExpandNode from './nodes/expandNode';
import mxContextmenu from './behavior/mx-contextmenu';
import mxClickSelect from './behavior/mx-click-select';
import mxEdit from './behavior/mx-edit';
import { getNewNode, getLabelObj } from './treeNode';

registerExpandNode(G6, nodeOptions);

G6.registerBehavior('mx-contextmenu', mxContextmenu);
G6.registerBehavior('mx-click-select', mxClickSelect);
G6.registerBehavior('mx-edit', mxEdit);

const initialData = {
  label: '我是根\n节点\n55555',
  children: [
    {
      label: '测1\n测试'
    }
  ]
};

function parseData(root) {
  const result = getNewNode(root);

  if (root.children) {
    result.children = root.children.map(v =>
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
      animate: true,
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
          'drag-canvas',
          'zoom-canvas'
        ]
      }
    });
    this.currentId = '';
    this.read(data1);
    this.moveToCenter();
    this.bindEditorEvent();
  }

  bindEditorEvent() {
    this.on('mx-node-contextmenu', evt => {
      this.currentId = evt.target.get('id');
    });
    this.on('mx-node-selectchange', evt => {
      this.currentId = evt.target.get('id');
    });
  }

  addNode(label = '') {
    if (this.currentId) {
      const data = getNewNode({ label, parent: this.currentId });
      this.addChild(data, this.currentId);
    }
  }

  updateCurrentLabel(label) {
    if (this.currentId) {
      const current = this.findById(this.currentId);
      const currentModel = current.getModel();
      if (current && currentModel.label !== label) {
        const newNode = { ...currentModel, ...getLabelObj(label) };
        if (currentModel.parent) {
          const parentModel = this.findDataById(currentModel.parent);
          const index = parentModel.children.findIndex(
            v => v.id === this.currentId
          );
          parentModel.children.splice(index, 1, newNode);
        } else {
          this.data(newNode);
        }
        this.set('animate', false);
        this.changeData();
        this.set('animate', true);
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
