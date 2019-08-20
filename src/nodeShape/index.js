import { registerExpandNode } from './expandNode';
import { registerResultNode } from './resultNode';
import { registerPlaceholderNode } from './placeholderNode';

export function registerCustomNode(G6) {
  G6.registerNode(registerExpandNode.name, registerExpandNode);
  G6.registerNode(registerResultNode.name, registerResultNode);
  G6.registerNode(registerPlaceholderNode.name, registerPlaceholderNode);
}
