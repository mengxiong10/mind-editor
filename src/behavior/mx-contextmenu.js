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
    graph.emit('mx-node-contextmenu', {
      target: item,
      clientX: e.clientX,
      clientY: e.clientY
    });
    graph.setAutoPaint(autoPaint);
    graph.paint();
  }
};
