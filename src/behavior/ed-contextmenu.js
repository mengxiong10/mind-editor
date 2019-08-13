import { Util } from '@antv/g6';

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
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selected = graph.findAllByState('node', 'selected');
    Util.each(selected, node => {
      if (node !== item) {
        graph.setItemState(node, 'selected', false);
      }
    });
    graph.setItemState(item, 'selected', true);
    graph.emit('ed-node-contextmenu', {
      target: item,
      x: e.canvasX,
      y: e.canvasY
    });
    graph.setAutoPaint(autoPaint);
    graph.paint();
  }
};
