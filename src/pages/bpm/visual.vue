<template>
  <div class="bpm-container">
    <div id="bpm-ins" class="bpm-visual" />
    <Control
      v-if="lf"
      class="bpm-control"
      :lf="lf"
      @catData="catData"
    ></Control>
  </div>
</template>

<script>
import LogicFlow from '@logicflow/core';
import * as registerNode from './components/registerNode';
import Control from '@/components/LFComponents/Control.vue';

import data from './data-init-graph';
// import { Snapshot } from '@logicflow/extension';

export default {
  name: 'BpmVisual',
  components: { Control },
  data: function() {
    return {
      lf: null,
      config: {
        background: {
          color: '#f7f9ff',
        },
        grid: {
          type: 'mesh',
          size: 10,
          visible: true,
          config: {
            color: '#ababab80', // 网格颜色
            // thickness: 10, // 网格线宽度
          },
        },
        keyboard: {
          enabled: true,
        },
        style: {
          rect: {
            radius: 6,
          },
          edgeText: {
            // 边文本样式
            background: {
              fill: '#fff',
            },
          },
        },
        edgeTextDraggable: true,
        guards: {
          beforeClone() {
            // 是否允许拷贝
            // console.log('beforeClone', data);
            return false;
          },
          beforeDelete(data) {
            // 可以根据 data 数据判断是否允许删除，允许返回 true,不允许返回 false
            console.log('beforeDelete', data);
            return true;
          },
        },
      },
      checkedNode: [],
    };
  },
  mounted: function() {
    // 导出包含有 HTML 元素有问题
    // LogicFlow.use(Snapshot);

    const lf = new LogicFlow({
      ...this.config,
      container: document.querySelector('#bpm-ins'),
    });
    this.lf = lf;

    console.log(lf);

    lf.setTheme({
      circle: {
        r: 20,
        stroke: '#000000',
        outlineColor: '#88f',
        strokeWidth: 1,
      },
    });

    registerNode.registerStart(lf);
    registerNode.registerEnd(lf);
    registerNode.registerEngNode(lf, {
      checkedNode: this.checkedNode,
      onChecked: (e, properties) => {
        if (this.checkedNode.indexOf(properties.node.id) > -1) {
          //
        }
      },
    });

    lf.render(data);

    lf.on('connection:not-allowed', data => {
      this.$message({
        type: 'error',
        message: data.msg,
      });
    });
  },

  methods: {
    catData() {
      let graphData = this.lf.getGraphData();
      this.graphData = graphData;
      console.log('catData: ', graphData);
    },
  },
};
</script>

<style>
.bpm-container {
  position: relative;
}
.bpm-control {
  position: absolute;
  top: 10px;
  right: 10px;
}
.bpm-visual {
  width: 100%;
  height: 100%;
}
.bpm-visual g[cus-flag='cusEngNode'] foreignObject {
  overflow: visible;
}
.bpm-visual g[cus-flag='cusEngNode'] .lf-element-text {
  display: none;
}
</style>
