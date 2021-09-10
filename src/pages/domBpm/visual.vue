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
          <foreignObject width="100%" height="100%">
            自定义文件
          </foreignObject>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import TransformModel from './transformModel';
import { StepDrag } from './drag';

export default {
  name: 'BpmVisual',
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

<style>
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
</style>
