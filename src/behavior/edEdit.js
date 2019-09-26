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
    graph.editNode(item);
  }
};
