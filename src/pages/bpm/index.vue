<template>
  <div class="bpm">
    <div class="bpm-nodes">
      <div>NODE 节点</div>
      <div @mousedown.stop="handleCheckbox">
        <el-checkbox :value="checked" /> 测试点击
      </div>

      <el-tree :data="bpmData" :props="defaultProps">
        <template #default="{  data }">
          <div class="tree-node" @mousedown.stop="dragTreeNode(data)">
            {{ data.label }}
          </div>
        </template>
      </el-tree>
    </div>
    <bpm-visual ref="bpmVisual" class="bpm-content"></bpm-visual>
  </div>
</template>

<script>
import BpmVisual from './visual.vue';
import treeData from './data-tree';

export default {
  name: 'BpmEditor',
  components: { BpmVisual },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      checked: false,
      bpmData: treeData,
    };
  },
  methods: {
    handleCheckbox: function() {
      this.checked = !this.checked;
    },
    dragTreeNode: function(node) {
      this.$refs['bpmVisual'].lf.dnd.startDrag({
        type: node.type || 'EngNode',
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
  cursor: pointer;
  user-select: none;
}
.bpm-nodes {
  padding: 10px;
  flex: none;
  width: 350px;
  border-right: 1px solid #ddd;
}
.bpm-content {
  /* padding: 10px; */
  width: 100px;
  flex: 1;
}
</style>
