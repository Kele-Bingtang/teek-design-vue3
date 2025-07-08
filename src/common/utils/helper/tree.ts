import { isArray, isObject } from "../core";

/**
 * 提取树结构中所有节点的 id 列表（深度优先）
 *
 * @param tree 树结构
 * @returns 所有节点 id 组成的数组
 */
export const extractPathList = (tree: Recordable[]): (string | number)[] => {
  if (!isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }

  const result: (string | number)[] = [];

  const traverse = (nodes: Recordable[], parentPath: (string | number)[] = []) => {
    for (const node of nodes) {
      const currentPath = [...parentPath, node.id];
      result.push(node.id);
      if (node.children?.length) traverse(node.children, currentPath);
    }
  };

  traverse(tree);

  return result;
};

/**
 * 如果某节点 children 长度为 1，则删除 children 并生成唯一 pathId
 *
 * @param tree 树结构
 * @returns 新的树结构（不可变）
 */
export const deleteChildren = (tree: Recordable[]): Recordable[] => {
  if (!isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }

  const traverse = (nodes: Recordable[], pathList: (string | number)[] = []): Recordable[] =>
    nodes.map((node, index) => {
      const currentPath = [...pathList, index];
      const hasSingleChild = node.children?.length === 1;

      const updatedNode = { ...node };
      if (hasSingleChild) updatedNode.children = undefined;

      updatedNode.parentId = pathList.length ? pathList[pathList.length - 1] : null;
      updatedNode.pathList = currentPath;
      updatedNode.id = currentPath.join("-");

      if (updatedNode.children?.length) updatedNode.children = traverse(updatedNode.children, currentPath);

      return updatedNode;
    });

  return traverse(tree);
};

/**
 * 获取树中指定 id 的节点
 *
 * @param tree 树结构
 * @param id 节点唯一标识
 * @returns 匹配的节点或 undefined
 */
export const getNodeById = (tree: Recordable[], id: string | number): Recordable | undefined => {
  if (!isArray(tree)) return undefined;

  const queue = [...tree];

  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;

    if (node.id === id) return node;

    if (node.children?.length) {
      queue.push(...node.children);
    }
  }

  return undefined;
};

/**
 * 向指定 id 的节点添加字段
 *
 * @param tree 树结构
 * @param id 节点唯一标识
 * @param fields 要添加的字段对象
 * @returns 新的树结构（不可变）
 */
export const appendFieldById = (tree: Recordable[], id: string | number, fields: Recordable): Recordable[] => {
  if (!isArray(tree)) return [];

  const traverse = (nodes: Recordable[]): Recordable[] =>
    nodes.map(node => {
      const updatedNode = { ...node };

      if (updatedNode.id === id && isObject(fields)) Object.assign(updatedNode, fields);

      if (updatedNode.children?.length) updatedNode.children = traverse(updatedNode.children);

      return updatedNode;
    });

  return traverse(tree);
};

/**
 * 将扁平数据转换为树形结构
 *
 * @param data 数据源
 * @param id 字段名，默认 'id'
 * @param parentId 父节点字段名，默认 'parentId'
 * @param children 子节点字段名，默认 'children'
 * @returns 树形结构数据
 */
export const handleTree = (
  data: Recordable[],
  id: string = "id",
  parentId: string = "parentId",
  children: string = "children"
): Recordable[] => {
  if (!isArray(data)) {
    console.warn("data must be an array");
    return [];
  }

  const map = new Map<string | number, Recordable>();
  const rootNodes: Recordable[] = [];

  // 构建映射表
  for (const item of data) map.set(item[id], { ...item });

  // 构建父子关系
  for (const item of data) {
    const pid = item[parentId];
    const node = map.get(item[id])!;

    if (pid && map.has(pid)) {
      const parent = map.get(pid)!;
      parent[children] = parent[children] || [];
      parent[children].push(node);
    } else rootNodes.push(node);
  }

  return rootNodes;
};
