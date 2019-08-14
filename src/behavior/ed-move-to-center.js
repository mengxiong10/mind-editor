export default {
  getDefaultCfg() {
    return {
      keyCode: 32
    };
  },
  getEvents() {
    return {
      keydown: 'onKeydown'
    };
  },
  onKeydown(evt) {
    const code = evt.keyCode;
    const graph = this.graph;
    if (code === this.keyCode) {
      graph.moveToCenter();
    }
  }
};
