import { Util } from '@antv/g6';

module.exports = {
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
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selected = graph.findAllByState('node', 'selected');
    Util.each(selected, node => {
      if (node !== item) {
        graph.setItemState(node, 'selected', false);
      }
    });
    if (!item.hasState('selected') && self.shouldUpdate.call(self, e)) {
      graph.setItemState(item, 'selected', true);
      graph.emit('mx-node-selectchange', { target: item, select: true });
    }
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },
  onCanvasClick() {
    const graph = this.graph;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selected = graph.findAllByState('node', 'selected');
    Util.each(selected, node => {
      graph.setItemState(node, 'selected', false);
    });
    graph.paint();
    graph.setAutoPaint(autoPaint);
  }
};
