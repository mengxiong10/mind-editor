import edContextmenu from './ed-contextmenu';
import edClickSelect from './ed-click-select';
import edEdit from './ed-edit';
import edResultEdit from './ed-result-edit';
import edShortcut from './ed-shortcut';
import edDragNode from './ed-drag-node';

export function registerCustomBehavior(G6) {
  G6.registerBehavior('ed-contextmenu', edContextmenu);
  G6.registerBehavior('ed-click-select', edClickSelect);
  G6.registerBehavior('ed-edit', edEdit);
  G6.registerBehavior('ed-result-edit', edResultEdit);
  G6.registerBehavior('ed-shortcut', edShortcut);
  G6.registerBehavior('ed-drag-node', edDragNode);
}
