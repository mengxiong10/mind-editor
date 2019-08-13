import { nodeOptions } from '../options';

export default {
  getEvents() {
    return {
      'node:dblclick': 'onDblclick'
    };
  },
  // 普通节点编辑
  onDblclick(e) {
    const item = e.item;
    if (item.get('currentShape') !== 'expand-node') {
      return;
    }
    const graph = this.graph;
    const box = item.getBBox();
    const model = item.getModel();
    const { x, y } = graph.getCanvasByPoint(box.x, box.y);

    graph.emit('ed-text-edit', {
      x,
      y,
      width: box.width,
      height: box.height,
      key: 'label',
      value: model.label
    });
  }
};
