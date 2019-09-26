export default {
  getEvents() {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick'
    };
  },
  onClick(e) {
    const self = this;
    const item = e.item;
    const graph = self.graph;
    graph.setCurrent(item.get('id'));
  },
  onCanvasClick() {
    const graph = this.graph;
    graph.setCurrent(null);
  }
};
