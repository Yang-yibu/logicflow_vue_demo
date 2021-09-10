<template>
  <div class="eng-node lf-node" :style="{ border: conf.border, ...conf.font }">
    <span
      class="bpm-checkbox cus-checkbox"
      :class="{ 'is-checked': checked }"
      :style="{
        color: conf.color,
        background: checked ? conf.color : conf.color + '33',
      }"
      @mousedown.stop="selectNode"
    >
      <span class="cus-checkbox_inner"></span>
    </span>
    <span class="bpm-label">{{ label }}</span>
    <i class="bpm-info el-icon-finished"></i>

    <el-popover placement="top-start" title="节点信息" width="200" trigger="click" content="" @show="tipShow">
      <i slot="reference" class="bpm-more el-icon-warning-outline" @mousedown.stop></i>

      <div class="node-tip">
        <div class="node-tip_li">
          <span class="node-tip_label">名称</span>
          <span>{{ label }}</span>
        </div>
        <div class="node-tip_li">
          <span class="node-tip_label">父节点</span><span>{{ tipData.chainLabel }}</span>
        </div>
        <div class="node-tip_li">
          <span class="node-tip_label">节点库</span><span>{{ tipData.node_bz }}</span>
        </div>
        <div class="node-tip_li">
          <span class="node-tip_label">本模板</span><span>{{ tipData.tpl_node_bz }}</span>
        </div>
      </div>
    </el-popover>
    <!-- <el-tooltip
      effect="dark"
      content="Bottom Left 提示文字"
      placement="bottom-start"
    >
      <i class="bpm-more el-icon-warning-outline" @mousedown.stop></i>
    </el-tooltip> -->
  </div>
</template>

<script>
export default {
  name: 'EngNodeHtml',
  props: {
    label: { type: String, default: '' },
    checked: { type: Boolean, default: false },
    conf: { type: Object, default: () => ({}) },
    tipShowFn: { type: Function },
  },
  data() {
    return {
      tipData: {},
    };
  },
  mounted: function() {
    // 会频繁触发
    // eslint-disable-next-line no-debugger
    // debugger
    // console.log('engNode-mounted', this);
  },
  methods: {
    selectNode: function() {
      this.$emit('change-checkbox', !this.checked);
    },
    tipShow: function() {
      // this.$emit('tip-show')
      this.tipData = this.tipShowFn() || {};
    },
  },
};
</script>

<style lang="less">
.lf-node {
  .eng-node {
    position: relative;
    display: flex;
    align-items: center;
    /* padding: 5px 10px; */
    padding: 5px 28px;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .eng-node .bpm-checkbox {
    position: absolute;
    left: 8px;
  }
  .eng-node .bpm-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .eng-node .bpm-info {
    position: absolute;
    right: 8px;
    color: #52c41a;
  }

  .node-tip_li {
    display: flex;
  }
  .node-tip_li .node-tip_label {
    flex: none;
    width: 4em;
    text-align-last: justify;
  }
  .node-tip_li .node-tip_label::after {
    display: inline-block;
    content: '：';
  }

  .eng-node .bpm-more {
    position: absolute;
    bottom: -8px;
    right: 0;
    padding: 3px 5px;
    font-size: 15px;
    transform: translate(105%, 5px);
    cursor: pointer;
    color: #999;
  }

  .cus-checkbox {
    display: inline-block;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    color: #3991e9;
    border: 1px solid currentColor;
    cursor: pointer;
    border-radius: 2px;
  }
  .cus-checkbox_inner {
    display: block;
    widows: 100%;
    height: 100%;
  }

  .cus-checkbox.is-checked .cus-checkbox_inner::after {
    transform: rotate(45deg) scaleY(1);
  }
  .cus-checkbox_inner::after {
    box-sizing: content-box;
    content: '';
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    transition: transform 0.15s ease-in 0.05s;
    transform-origin: center;
  }
}
</style>
