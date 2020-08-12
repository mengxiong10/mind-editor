export default {
  getEvents() {
    return {
      'canvas:drag': 'onDrag',
      'canvas:dragend': 'onDragend',
      'node-drag': 'onDrag',
      'node-dragend': 'onDragend'
    };
  },
  onDrag() {
    const el = this.graph.get('canvas').get('el');
    el.style.cursor = '-webkit-grabbing';
  },
  onDragend() {
    const el = this.graph.get('canvas').get('el');
    el.style.cursor = 'default';
  }
};
