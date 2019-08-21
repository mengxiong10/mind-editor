import edContextmenu from './edContextmenu';
import edClickSelect from './edClickSelect';
import edEdit from './edEdit';
import edResultEdit from './edResultEdit';
import edShortcut from './edShortcut';
import edDragNode from './edDragNode';

export function registerCustomBehavior(G6) {
  G6.registerBehavior('ed-contextmenu', edContextmenu);
  G6.registerBehavior('ed-click-select', edClickSelect);
  G6.registerBehavior('ed-edit', edEdit);
  G6.registerBehavior('ed-result-edit', edResultEdit);
  G6.registerBehavior('ed-shortcut', edShortcut);
  G6.registerBehavior('ed-drag-node', edDragNode);
}
