<template>
  <div class="bpm">
    <div class="bpm-nodes">
      <el-tree
        class="cus-tree tree-show-line1 tree-show-scroll-bar"
        :data="bpmData"
        :props="defaultProps"
      >
        <template #default="{  data }">
          <div class="tree-node" @mousedown.stop="dragTreeNode(data)">
            <span
              class="colorBlock"
              :style="{ background: colorArr[data.pos.length - 1] }"
            ></span>
            <span>{{ data.label }}</span>
          </div>
        </template>
      </el-tree>
    </div>
    <bpm-visual ref="bpmVisual" class="bpm-content"></bpm-visual>
  </div>
</template>

<script>
// import { treeNodeAddProp } from '@/Util/index';
import BpmVisual from './visual.vue';
import treeData from './data-tree';

export default {
  name: 'BpmEditor',
  components: { BpmVisual },
  data() {
    return {
      colorArr: ['#3991E9', '#30B542', '#ECBE24'],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      checked: false,
      bpmData: [],
    };
  },
  mounted: function() {
    this.bpmData = treeData;
  },
  methods: {
    handleCheckbox: function() {
      this.checked = !this.checked;
    },
    dragTreeNode: function(node) {
      this.$refs['bpmVisual'].lf.dnd.startDrag({
        type: 'EngNode_' + (node.pos.length || 1),
        id: 'cus_' + node.id,
        properties: {
          node: node,
          label: node.label,
        },
        text: node.label,
      });
    },
  },
};
</script>

<style>
.bpm {
  width: 100%;
  height: 100%;
  background: #f2f2f2;

  display: flex;
}
.bpm .tree-node {
  display: flex;
  align-items: center;
  padding: 0 4px;
  width: 100%;
  height: 20px;
  cursor: pointer;
  user-select: none;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  background: #f2f2f2;
}
.bpm .tree-node .colorBlock {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  margin-right: 5px;
  background: #dbdbdb;
}

.bpm-nodes {
  padding: 10px;
  flex: none;
  width: 350px;
  border-right: 1px solid #ddd;
  background: #fff;
  overflow: auto;
}

.bpm-content {
  /* padding: 10px; */
  width: 100px;
  flex: 1;
}

.cus-tree .el-tree-node__expand-icon {
  box-sizing: border-box;
  padding: 2px 6px 2px 2px !important;
  color: #4d4d4d;
  font-size: 12px;
  transform: none !important;
}

.cus-tree .el-tree-node__expand-icon:not(.is-leaf)::before {
  border-color: #4d4d4d !important;
}
.cus-tree .el-tree-node__expand-icon.el-icon-caret-right::before {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  padding: 1px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  content: '\e6d9';
}
.cus-tree .el-tree-node__expand-icon.el-icon-caret-right.expanded::before {
  content: '\e6d8';
}
</style>

<style>
.cus-tree .el-tree-node__label {
  font-size: 14px;
}

.cus-tree.tree-show-line1 .el-tree-node__children {
  position: relative;
  padding-left: 24px;
}

.cus-tree.tree-show-line1 .el-tree-node__children::before {
  content: '';
  position: absolute;
  top: 0;
  left: 12px;
  height: 100%;
  border-right: 1px dashed #c0c4cc;
}

.cus-tree.tree-show-line1 .el-tree-node__content {
  position: relative;
  padding-left: 0 !important;
}

.cus-tree.tree-show-line1 .el-tree-node__content::before {
  content: '';
  position: absolute;
  left: -12px;
  width: 12px;
  border-bottom: 1px dashed #c0c4cc;
}

.cus-tree.tree-show-line1 > .el-tree-node > .el-tree-node__content::before {
  border: none;
}

.cus-tree.tree-show-line .el-tree-node {
  position: relative;
}

.cus-tree.tree-show-line .el-tree-node .el-tree-node__children {
  padding-left: 24px;
}

.cus-tree.tree-show-line
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__content {
  padding-left: 0 !important;
}

.cus-tree.tree-show-line .el-tree-node::before,
.cus-tree.tree-show-line .el-tree-node::after {
  content: '';
  position: absolute;
  left: -12px;
}

.cus-tree.tree-show-line .el-tree-node::before {
  border-left: 1px dashed #c0c4cc;
  height: 100%;
  top: 0px;
}

.cus-tree.tree-show-line .el-tree-node::after {
  border-top: 1px dashed #c0c4cc;
  width: 12px;
  top: 12px;
}

.cus-tree.tree-show-line .el-tree-node :last-child::before {
  height: 12px;
}

.cus-tree.tree-show-line > .el-tree-node::before,
.cus-tree.tree-show-line > .el-tree-node::after {
  border: none;
}

.cus-tree.tree-show-line .is-leaf.el-tree-node__expand-icon {
  height: 0;
  padding: 0;
}

.cus-tree.tree-show-line .is-leaf.el-tree-node__expand-icon::after {
  content: '';
  position: absolute;
  border-top: 1px dashed #c0c4cc;
  width: 10px;
  top: -1px;
  left: 0;
}

.cus-tree.tree-show-scroll-bar.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: transparent;
}

.cus-tree.tree-show-scroll-bar.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .cus-tree-node {
  /* background-color: #f0f7ff; */
  background-color: transparent;
}

.cus-tree.tree-show-scroll-bar .el-tree-node__content:hover {
  background: transparent;
}

.cus-tree.tree-show-scroll-bar .el-tree-node__content:hover .cus-tree-node {
  background-color: #f5f7fa;
}

.cus-tree.tree-show-scroll-bar .el-tree-node > .el-tree-node__children {
  overflow: initial;
}
</style>
