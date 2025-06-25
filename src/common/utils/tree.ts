/**
 * @description 提取菜单树中的每一项 id
 * @param tree 树
 * @returns 每一项 id 组成的数组
 */
export const extractPathList = (tree: any[]): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const expandedPaths: Array<number | string> = [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      extractPathList(node.children);
    }
    expandedPaths.push(node.id);
  }
  return expandedPaths;
};

/**
 * @description 如果父级下 children 的 length 为 1，删除 children 并自动组建唯一 id
 * @param tree 树
 * @param pathList 每一项的 id 组成的数组
 * @returns 组件唯一 id 后的树
 */
export const deleteChildren = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    if (node.children && node.children.length === 1) delete node.children;
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    node.id = node.pathList.length > 1 ? node.pathList.join("-") : node.pathList[0];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      deleteChildren(node.children, node.pathList);
    }
  }
  return tree;
};

/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的 id 组成的数组
 * @returns 创建层级关系后的树
 */
export const buildHierarchyTree = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      buildHierarchyTree(node.children, node.pathList);
    }
  }
  return tree;
};

/**
 * @description 广度优先遍历，根据唯一 id 找当前节点信息
 * @param tree 树
 * @param id 唯一 id
 * @returns 当前节点信息
 */
export const getNodeById = (tree: any[], id: number | string): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const item = tree.find(node => node.id === id);
  if (item) return item;
  const childrenList = tree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1) as unknown;
  return getNodeById(childrenList as any[], id);
};

/**
 * @description 向当前唯一 id 节点中追加字段
 * @param tree 树
 * @param id 唯一 id
 * @param fields 需要追加的字段
 * @returns 追加字段后的树
 */
export const appendFieldById = (tree: any[], id: number | string, fields: object): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (node.id === id && Object.prototype.toString.call(fields) === "[object Object]") {
      Object.assign(node, fields);
    }
    if (hasChildren) {
      appendFieldById(node.children, id, fields);
    }
  }
  return tree;
};

/**
 * @description 构造树型结构数据
 * @param data 数据源
 * @param id id 字段 默认 id
 * @param parentId 父节点字段，默认 parentId
 * @param children 子节点字段，默认 children
 * @returns 追加字段后的树
 */
export const handleTree = (data: any[], id?: string, parentId?: string, children?: string): any => {
  if (!Array.isArray(data)) {
    console.warn("data must be an array");
    return [];
  }
  const config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children",
  };

  const childrenListMap: any = {};
  const nodeIds: any = {};
  const tree = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: Record<string, any>) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
};
