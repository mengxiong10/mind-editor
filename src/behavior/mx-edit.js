export default {
  getEvents() {
    return {
      'node:dblclick': 'onDblclick'
    };
  },
  onDblclick(e) {
    const item = e.item;
    const graph = this.graph;
    graph.emit('mx-node-edit', {
      item,
      graph
    });
  }
};
