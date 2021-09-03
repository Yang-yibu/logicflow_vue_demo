export const treeNodeAddProp = (
  tree,
  { childrenProp = 'nodes', initPos = [0] },
  processNode,
) => {
  let childrenNode = (dataTree, parentPos) => {
    return dataTree.map((item, index) => {
      let pos = parentPos.concat(index);

      item = typeof processNode === 'function' && processNode(item, pos);

      if (item[childrenProp] && item[childrenProp].length) {
        return {
          ...item,
          [childrenProp]: childrenNode(item[childrenProp], pos),
        };
      }

      return { ...item };
    });
  };

  return childrenNode(tree, initPos);
};
