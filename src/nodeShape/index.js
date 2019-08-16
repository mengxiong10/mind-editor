import G6 from '@antv/g6/src/index';
import { registerExpandNode, expandNodeData } from './expandNode';
import { registerResultNode, resultNodeData } from './resultNode';
import { registerPlaceholderNode } from './placeholderNode';
import { guid } from '../utils/base';

const nodeModules = {};

const defaultNodeModule = {
  createNode(data = {}) {
    const defaultData = {
      id: guid()
    };
    return this.updateNode(defaultData, data);
  },
  updateNode(oldValue, value) {
    return Object.assign(oldValue, value);
  }
};

export const addNodeModule = (name, obj) => {
  nodeModules[name] = obj;
};

export const getNodeModule = name => {
  return nodeModules[name] || defaultNodeModule;
};

addNodeModule(expandNodeData.name, expandNodeData);
addNodeModule(resultNodeData.name, resultNodeData);

G6.registerNode(registerExpandNode.name, registerExpandNode);
G6.registerNode(registerResultNode.name, registerResultNode);
G6.registerNode(registerPlaceholderNode.name, registerPlaceholderNode);
