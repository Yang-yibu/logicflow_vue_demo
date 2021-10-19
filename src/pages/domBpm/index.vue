<template>
  <div class="bpm">
    <div class="bpm-nodes">
      <el-tree
        id="jsDragSource"
        class="cus-tree tree-show-line1 tree-show-scroll-bar"
        :data="bpmData"
        :props="defaultProps"
      >
        <template #default="{  data }">
          <div
            class="tree-node"
            :id="'source_' + data.id"
            @mouseover="mouseoverHandle(data)"
            @mouseout="mouseoutHandle(data)"
          >
            <span class="colorBlock" :style="{ background: colorArr[data.pos.length - 1] }"></span>
            <span style="flex: 1;">{{ data.label }}</span>
          </div>
        </template>
      </el-tree>
    </div>
    <bpm-visual ref="bpmVisual" class="bpm-content" :bpmData="bpmData"></bpm-visual>
  </div>
</template>

<script>
import BpmVisual from './visual.vue';
import treeData from '../bpm/data-tree';
import { treeNodeAddProp } from '@/Util';
import Sortable from 'sortablejs';

export default {
  name: 'DOMBpmEditor',
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
      fakerNode: null,
    };
  },
  mounted: function() {
    let tree = treeData;
    tree = [
      {
        id: 2,
        pid: -1,
        label: '机柜安装',
        type: 'level_1',
        children: [
          {
            id: '2-1',
            label: '机柜线路整理',
            type: 'level_2',
            pid: 2,
            children: [
              { id: '2-1-1', pid: '2-1', label: '安装-1', type: 'level_3' },
              { id: '2-1-2', pid: '2-1', label: '安装-2', type: 'level_3' },
              { id: '2-1-3', pid: '2-1', label: '安装-3', type: 'level_3' },
            ],
          },
          { id: '2-2', pid: 2, label: '机柜设备上架', type: 'level_2' },
          { id: '2-3', pid: 2, label: '机柜线路测试', type: 'level_2' },
        ],
      },
      {
        id: 3,
        pid: -1,
        label: '设备调试',
        type: 'level_1',
        children: [{ id: '3-1', pid: 3, label: '设备调试', type: 'level_2' }],
      },
    ];

    this.bpmData = treeNodeAddProp(tree, { childrenProp: 'children', initPos: [] }, (node, pos) => {
      let newNode = {
        id: 'node_' + node.id,
        s_id: node.id,
        pid: node.pid,
        label: node.label,
        pos: pos,
        type: 'level_' + pos.length,
        className: 'level_' + pos.length,
      };
      node.pos = pos;
      node.prop = newNode;

      return node;
    });
  },
  methods: {
    handleCheckbox: function() {
      this.checked = !this.checked;
    },

    mouseoutHandle: function(node) {
      let fakerNode = node.prop;
      let sourceDom = document.getElementById('source_' + fakerNode.s_id);
      let targetDom;
      if (node.pid == -1) {
        targetDom = document.getElementById('nodes');
      } else {
        // .level-node-children
        targetDom = document.getElementById('node_' + node.id).parentElement;
      }
      console.log('destroy')
      sourceDom.sourceIns.destroy();
      sourceDom.removeAttribute('data-drap');
      sourceDom.sourceIns = null;
      targetDom.targetIns.destroy();
      targetDom.removeAttribute('data-drap');
      targetDom.targetIns = null;
    },
    mouseoverHandle: function(node) {
      let fakerNode = node.prop;
      let sourceDom = document.getElementById('source_' + fakerNode.s_id);
      sourceDom.sourceIns = new Sortable(sourceDom, {
        group: {
          name: 'shared',
          pull: 'clone',
          put: false,
        },
        // draggable: '.tree-node',
        animation: 150,
        sort: false,
        onEnd: function(/**Event*/ evt) {
          let copyEl = evt.item;
          let prevEl = copyEl.previousElementSibling;
          console.log('mouseoverHandle: ', copyEl, prevEl);

          // evt.newIndex;
          console.log(evt.newIndex);
        },
      });
      sourceDom.setAttribute('data-drap', 1);

      let targetDom;
      if (node.pid == -1) {
        targetDom = document.getElementById('nodes');
      } else {
        // targetDom = document.getElementById('node_' + node.pid).getElementsByClassName('level-node-children');
        // .level-node-children
        targetDom = document.getElementById('node_' + node.id).parentElement;
      }
      targetDom.targetIns = new Sortable(targetDom, {
        group: 'shared',
        animation: 150,
      });
      targetDom.setAttribute('data-drap', 1);
    },

    dragTreeNode: function(node) {
      let fakerNode = node.prop;
      this.fakerNode = fakerNode;

      this.$nextTick(() => {
        this.sourceIns = new Sortable(document.getElementById('source_' + fakerNode.s_id), {
          group: {
            name: 'shared',
            pull: 'clone',
            put: false,
          },
          // draggable: '.tree-node',
          animation: 150,
          sort: false,
          onEnd: function(/**Event*/ evt) {
            let copyEl = evt.item;
            let prevEl = copyEl.previousElementSibling;
            console.log('dragTreeNode:', copyEl, prevEl);

            // evt.newIndex;
            console.log(evt.newIndex);
          },
        });

        let targetDom;
        if (node.pid == -1) {
          targetDom = document.getElementById('nodes');
        } else {
          // targetDom = document.getElementById('node_' + node.pid).getElementsByClassName('level-node-children');
          targetDom = document.getElementById('node_' + node.id).parentElement;
        }
        this.targetIns = new Sortable(targetDom, {
          group: {
            name: 'shared',
            pull: 'clone',
          },
          animation: 150,
        });
      });

      // let curNode = { children: this.bpmData };
      // node.chainLabel = [];
      // node.pos.map((item, index) => {
      //   if (index < node.pos.length - 1) {
      //     curNode = curNode.children[item];
      //     node.chainLabel.push(curNode.label);
      //   }
      // });
      // node.chainLabel = node.chainLabel.join(' -> ');
    },
  },
};
</script>

<style lang="less">
.tree-node {
  position: relative;
}
#dropFakerNode {
  position: absolute;
  top: 0;
  left: 0;
}

.bpm {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  display: flex;

  .tree-node {
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

    .colorBlock {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      margin-right: 5px;
      background: #dbdbdb;
    }
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

  .cus-tree {
    .el-tree-node__expand-icon {
      box-sizing: border-box;
      padding: 2px 6px 2px 2px !important;
      font-size: 12px;
      transform: none !important;
    }

    .el-tree-node__expand-icon:not(.is-leaf)::before {
      border-color: #4d4d4d !important;
      color: #4d4d4d;
    }

    .el-tree-node__expand-icon.el-icon-caret-right::before {
      display: inline-block;
      border: 1px solid transparent;
      text-align: center;
      padding: 1px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      content: '\e6d9';
    }
    .el-tree-node__expand-icon.el-icon-caret-right.expanded::before {
      content: '\e6d8';
    }
  }
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

.cus-tree.tree-show-line .el-tree-node .el-tree-node__children .el-tree-node__content {
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

.cus-tree.tree-show-scroll-bar.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: transparent;
}

.cus-tree.tree-show-scroll-bar.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .cus-tree-node {
  /* background-color: #f0f7ff; */
  background-color: transparent;
}

.cus-tree.tree-show-scroll-bar .el-tree-node__content:hover,
.cus-tree.tree-show-scroll-bar .el-tree-node__content:focus {
  background: transparent;
}

.cus-tree.tree-show-scroll-bar .el-tree-node__content:hover .cus-tree-node,
.cus-tree.tree-show-scroll-bar .el-tree-node__content:focus .cus-tree-node {
  background-color: #f5f7fa;
}

.cus-tree.tree-show-scroll-bar .el-tree-node > .el-tree-node__children {
  overflow: initial;
}
</style>
