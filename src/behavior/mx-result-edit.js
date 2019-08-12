import { Util } from '@antv/g6';
import { nodeOptions } from '../options';

export default {
  getEvents() {
    return {
      'node:click': 'onClick'
    };
  },
  onClick(evt) {
    const item = evt.item;
    if (item.get('currentShape') !== 'result-node') {
      return;
    }
    const shape = evt.target;
    const model = item.getModel();
    const className = shape.get('className');
    if (className === 'label' || className === 'description') {
      this.editText(shape, className, model[className]);
      return;
    }
    if (className === 'forAutoTest') {
    }

    // const box = item.getBBox();
    // const model = item.getModel();
    // const { x, y } = graph.getCanvasByPoint(box.x, box.y);
    // graph.emit('mx-node-edit', {
    //   x,
    //   y,
    //   width: box.width,
    //   height: box.height,
    //   label: model.label
    // });
  },
  editText(shape, key, value) {
    const graph = this.graph;
    const { nodeBox, resultNodeBox } = nodeOptions;
    const { padding } = nodeBox;

    const textWidth =
      resultNodeBox.width -
      resultNodeBox.labelWidth -
      resultNodeBox.padding[1] -
      resultNodeBox.padding[3];

    const bbox = Util.getBBox(shape, shape.getParent());
    const width = textWidth + padding[1] + padding[3];
    const height = bbox.maxY - bbox.minY + padding[0] + padding[2];
    let { x, y } = graph.getCanvasByPoint(bbox.minX, bbox.minY);
    x -= padding[1];
    y -= padding[0];
    graph.emit('mx-text-edit', {
      key,
      value,
      x,
      y,
      width,
      height
    });
  }
};
