<template>
  <div class="eng-node">
    <span class="bpm-checkbox" @mousedown.stop="selectNode">
      <el-checkbox :value="checked" />
    </span>
    <span>{{ label }}</span>
    <i class="bpm-info el-icon-finished"></i>

    <el-tooltip
      effect="dark"
      content="Bottom Left 提示文字"
      placement="bottom-start"
    >
      <i class="bpm-more el-icon-info" @mousedown.stop></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'EngNodeHtml',
  props: {
    label: { type: String, default: '' },
    checked: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  mounted: function() {
    // 会频繁触发
    // eslint-disable-next-line no-debugger
    // debugger
    // console.log('engNode-mounted');
  },
  methods: {
    selectNode: function() {
      this.$emit('change-checkbox', !this.checked);
    },
  },
};
</script>

<style>
.eng-node {
  position: relative;
  display: flex;
  align-items: center;
  /* padding: 5px 10px; */
  padding: 5px 35px;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  box-sizing: border-box;
}

.eng-node .bpm-checkbox {
  position: absolute;
  left: 10px;
}
.eng-node .bpm-info {
  position: absolute;
  right: 10px;
  color: #52C41A;
}
.eng-node .bpm-more {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5px;
  font-size: 20px;
  transform: translate(105%, 5px);
  cursor: pointer;
}
</style>
