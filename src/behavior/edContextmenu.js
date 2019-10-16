export default {
  getEvents() {
    return {
      'node:contextmenu': 'onContextmenu'
    };
  },
  onContextmenu(e) {
    const self = this;
    const item = e.item;
    const graph = self.graph;
    graph.setCurrent(item.get('id'));
    graph.emit('ed-node-contextmenu', {
      graph,
      target: item,
      x: e.canvasX,
      y: e.canvasY
    });
  }
};
