declare module '@antv/g6*' {
  export default G6;
}

declare module '@antv/hierarchy' {}

declare namespace G6 {
  class TreeGraph {
    constructor(data: any);
    get<T = any>(key: string): T;
    findDataById(id: string): any;
    changeData(): void;
    update(id: string, data: any): void;
    removeChild(id: string): void;
  }

  function registerNode(name: string, cfg: any): void;
  function registerEdge(name: string, cfg: any): void;

  const Util: any;
}
