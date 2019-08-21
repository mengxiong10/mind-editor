import { Util } from '@antv/g6';
import { resultNodeBox } from '../style';

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
    } else if (className === 'level') {
      this.editSelect(shape, className, model[className]);
    } else if (className === 'forAutoTest') {
      this.graph.updateNode({ [className]: !model.forAutoTest });
    }
  },
  editSelect(shape, key, value) {
    const graph = this.graph;
    const bbox = Util.getBBox(shape, shape.getParent());
    const { x, y } = graph.getCanvasByPoint(bbox.maxX, bbox.maxY);
    graph.emit('ed-select-edit', {
      key,
      value,
      x,
      y
    });
  },
  editText(shape, key, value) {
    const graph = this.graph;
    const { padding, labelWidth } = resultNodeBox;

    const textWidth =
      resultNodeBox.width - labelWidth - padding[1] - padding[3];

    const bbox = Util.getBBox(shape, shape.getParent());
    const width = textWidth + padding[1] + padding[3];
    const height = bbox.maxY - bbox.minY + padding[0] + padding[2];
    let { x, y } = graph.getCanvasByPoint(bbox.minX, bbox.minY);
    x -= padding[1];
    y -= padding[0];
    graph.emit('ed-text-edit', {
      key,
      value,
      x,
      y,
      width,
      height
    });
  }
};
