<template>
  <div class="bpm-container">
    <div id="bpm-ins" class="bpm-visual">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        name="canvas-overlay"
        :class="{ dragging: isDragging }"
        @mousedown="mouseDownHandler"
        @mousewheel="zoomHandler"
      >
        <g :transform="transformStyle.transform">
          <foreignObject :width="nodesBox.width" :height="nodesBox.height">
            <div style="width: 100%; height: 100%;">
              <div id="nodes" class="bpm-node-box">
                <eng-node v-for="l1 in bpmData" :key="l1.id" v-bind="l1.prop" class="level-1">
                  <eng-node v-for="l2 in l1.children" :key="l2.id" v-bind="l2.prop" class="level-2">
                    <eng-node v-for="l3 in l2.children" :key="l3.id" v-bind="l3.prop" class="level-3"></eng-node>
                  </eng-node>
                </eng-node>
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import TransformModel from './components/transformModel';
import { StepDrag } from './components/drag';
import EngNode from './components/engNode.vue';
import { treeNodeAddProp } from '@/Util';
import dataTree from './data-tree';

/** 流程图区域 */
export default {
  name: 'BpmVisual',
  components: { EngNode },
  data: function() {
    return {
      gridSize: 1,
      editConfig: {
        // 不允许移动画布
        stopMoveGraph: false,
        // 不允许缩放画布
        stopZoomGraph: false,
      },

      isDragging: false,
      /** TransformModel */
      transformMatrix: new TransformModel(),
      // stepDrag: new StepDrag(),
      nodesBox: { width: '100%', height: '100%' },
      bpmData: [],
      // bpmData: [
      //   { id: 1, label: '开始', type: 'level_1' },
      //   {
      //     id: 2,
      //     label: '机柜安装',
      //     type: 'level_1',
      //     children: [
      //       {
      //         id: '2-1',
      //         label: '机柜线路整理',
      //         type: 'level_2',
      //         children: [
      //           { id: '2-1-1', label: '安装-1', type: 'level_3' },
      //           { id: '2-1-2', label: '安装-2', type: 'level_3' },
      //           { id: '2-1-3', label: '安装-3', type: 'level_3' },
      //         ],
      //       },
      //       { id: '2-2', label: '机柜设备上架', type: 'level_2' },
      //       { id: '2-3', label: '机柜线路测试', type: 'level_2' },
      //     ],
      //   },
      //   {
      //     id: 3,
      //     label: '设备调试',
      //     type: 'level_1',
      //     children: [{ id: '3-1', label: '设备调试', type: 'level_2' }],
      //   },
      //   { id: 4, label: '结束', type: 'level_1' },
      // ],
    };
  },
  computed: {
    rootEl: function() {
      return this.$el;
    },
    transformStyle: function() {
      const { SCALE_X, SKEW_Y, SKEW_X, SCALE_Y, TRANSLATE_X, TRANSLATE_Y } = this.transformMatrix;

      const matrixString = [SCALE_X, SKEW_Y, SKEW_X, SCALE_Y, TRANSLATE_X, TRANSLATE_Y].join(',');
      return {
        transform: `matrix(${matrixString})`,
        transformOrigin: 'left top',
      };
    },
  },
  mounted: function() {
    this.stepDrag = new StepDrag({
      onDragging: this.onDragging,
      onDragEnd: this.onDragEnd,
      step: this.gridSize,
    });

    this.bpmData = treeNodeAddProp(dataTree, { childrenProp: 'children', initPos: [] }, (node, pos) => {
      let newNode = {
        id: node.id,
        label: node.label,
        pos: pos,
        type: 'level_' + pos.length,
        className: 'level_' + pos.length,
      };
      node.prop = newNode;
      return node;
    });
    this.$nextTick(() => {
      let nodeBox = document.getElementById('nodes').getBoundingClientRect();
      this.nodesBox = { width: nodeBox.width + 40, height: nodeBox.height + 60 };
    });
  },

  methods: {
    onDragging({ deltaX, deltaY }) {
      this.isDragging = true;
      const { transformMatrix, editConfig } = this;

      if (editConfig.stopMoveGraph) {
        return;
      }
      transformMatrix.TRANSLATE_X += deltaX;
      transformMatrix.TRANSLATE_Y += deltaY;
    },
    onDragEnd() {
      this.isDragging = false;
    },
    mouseDownHandler: function(ev) {
      const {
        editConfig,
        transformMatrix: { SCALE_X },
      } = this;

      // 允许移动画布
      if (!editConfig.stopMoveGraph) {
        this.stepDrag.setStep(this.gridSize * SCALE_X);
        this.stepDrag.handleMouseDown(ev);
      }
    },
    zoomHandler: function(ev) {
      const { editConfig } = this;
      // const { deltax: eX, deltaY: eY } = ev;
      if (!editConfig.stopZoomGraph) {
        ev.preventDefault();
        const position = this.getPointByClient({ x: ev.clientX, y: ev.clientY });
        const { x, y } = position.canvasOverlayPosition;
        this.transformMatrix.zoom(ev.deltaY < 0, [x, y]);
      }
    },

    /**
     * 因为流程图所在的位置可以是页面任何地方
     * 当内部事件需要获取触发事件时，其相对于画布左上角的位置
     * 需要事件触发位置减去画布相对于client的位置
     * @param {{x: number, y: number, [key: string]: unknown}}
     */
    getPointByClient({ x: x1, y: y1 }) {
      const bbox = this.rootEl.getBoundingClientRect();
      const domOverlayPosition = {
        x: x1 - bbox.left,
        y: y1 - bbox.top,
      };
      const [x, y] = this.transformMatrix.HtmlPointToCanvasPoint([domOverlayPosition.x, domOverlayPosition.y]);
      return {
        domOverlayPosition,
        canvasOverlayPosition: {
          x,
          y,
        },
      };
    },
  },
};
</script>

<style lang="less">
.bpm-container {
  position: relative;
}
.bpm-visual {
  width: 100%;
  height: 100%;
}

.bpm-visual .dragging {
  cursor: grabbing;
}

.bpm-node-box {
  display: flex;
  padding: 20px 30px;

  & .level-node {
    position: relative;
    &::before {
      content: '';
      border-bottom: 1px solid #999;
      position: absolute;
    }
    &.level-2,
    &.level-3 {
      & > .line {
        position: absolute;
        border-left: 1px solid #999;
      }
      // 有 children 包裹是 1，没有是 3
      &:nth-child(1) > .line {
        border-top: 1px solid #999;
      }
    }

    &.level-1 {
      margin: 0 30px;

      &::before {
        width: 70%;
        left: 100%;
        top: 13px;
      }
      &:last-child::before {
        display: none;
      }
    }
    &.level-2 {
      margin-top: 30px;

      & > .line {
        width: 25px;
        height: calc(100% + 30px);
        top: -42px;
        left: -25px;
      }

      &::before {
        width: 25px;
        right: 100%;
        top: 6px;
      }
      &:last-child > .line {
        height: 48px;
      }
    }
    &.level-3 {
      margin-top: 10px;
      margin-left: 20px;

      & > .line {
        width: 15px;
        height: calc(100% + 10px);
        left: -35px;
        top: -15px;
      }

      &::before {
        width: 35px;
        right: 100%;
        top: 14px;
      }
      &:last-child > .line {
        height: 31px;
      }
    }
  }
}
</style>
