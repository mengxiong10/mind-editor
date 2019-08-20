import { baseNodeModule } from './baseNode';
import { expandNodeModule } from './expandNode';
import { resultNodeModule } from './resultNode';

const nodeModules = {};

// 注册节点操作
export const addNodeModule = obj => {
  if (!obj.name) {
    // eslint-disable-next-line no-console
    console.warn('nodeModule need a name');
    return;
  }
  nodeModules[obj.name] = obj;
};

// 获取节点的操作
export const getNodeModule = name => {
  return nodeModules[name] || baseNodeModule;
};

addNodeModule(baseNodeModule);
addNodeModule(expandNodeModule);
addNodeModule(resultNodeModule);
