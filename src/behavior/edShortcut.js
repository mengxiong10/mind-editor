export default {
  getDefaultCfg() {
    return {
      //  { keyCode: [45, 9], handler: 'addNode' }
      shortcuts: []
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
    const item = this.shortcuts.find(v => {
      const matchKey = Array.isArray(v.keyCode)
        ? v.keyCode.indexOf(code) !== -1
        : v.keyCode === code;
      return (
        matchKey &&
        (typeof v.ctrlKey !== 'boolean' || v.ctrlKey === evt.ctrlKey)
      );
    });
    if (item && item.handler) {
      if (typeof item.handler === 'string' && graph[item.handler]) {
        evt.preventDefault();
        const args = [].concat(item.arguments);
        graph[item.handler](...args);
      } else if (typeof item.handler === 'function') {
        evt.preventDefault();
        item.handler.call(graph);
      }
    }
  }
};
