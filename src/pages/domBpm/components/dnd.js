/**
 * @param {number} distance
 * @param {number} gridSize
 * @returns
 */
function snapToGrid(distance, gridSize) {
  // 保证 x, y 的值为 gridSize 的整数倍
  return gridSize * Math.round(distance / gridSize) || distance;
}

/**
 * @typedef NewNodeConfig
 * @property {string} type 节点类型
 * @property {string} label 显示文字
 * @property {{}=} properties 携带属性
 */

/**
 * @class Dnd
 */
export default class Dnd {
  /** @type {NewNodeConfig} */
  nodeConfig = null;
  /** 流程图实例 */
  lfIns = null;
  /** 拖拽生成的临时虚拟节点 */
  fakerNode = null;
  /**
   * @constructor
   */
  constructor(params) {
    const { options, lfIns } = params;
    this.lfIns = lfIns;
    this.option = options;
  }
  clientToLocalPoint({ x, y }) {
    const gridSize = this.lfIns.gridSize;
    const position = this.lfIns.getPointByClient({ x, y });
    const { x: x1, y: y1 } = position.canvasOverlayPosition;
    return { x: snapToGrid(x1, gridSize), y: snapToGrid(y1, gridSize) };
  }

  /** @type {NewNodeConfig} */
  startDrag(nodeConfig) {
    this.nodeConfig = nodeConfig;
    window.document.addEventListener('mouseup', this.stopDrag);
  }
  stopDrag() {
    this.nodeConfig = null;
    window.document.removeEventListener('mouseup', this.stopDrag);
  }
  /** 拖拽进入流程图区域 */
  dragEnter(e) {
    if (!this.nodeConfig || this.fakerNode) return;

    this.fakerNode = this.lfIns.createFakerNode({
      ...this.nodeConfig,
      ...this.clientToLocalPoint({ x: e.clientX, y: e.clientY }),
    });
  }
  /** 离开流程图区域 */
  onDragOver(e) {
    e.preventDefault();
    if (this.fakerNode) {
      const { x, y } = this.clientToLocalPoint({ x: e.clientX, y: e.clientY });
      this.fakerNode.moveTo(x, y);

      // const nodeData = this.fakerNode.getData();
      // this.lf.setNodeSnapLine(nodeData);
      // this.lf.eventCenter.emit(EventType.NODE_DND_DRAG, { data: nodeData });
    }
    return false;
  }
  onDragLeave = () => {
    if (this.fakerNode) {
      this.lf.removeNodeSnapLine();
      this.lf.graphModel.removeFakerNode();
      this.fakerNode = null;
    }
  };
  onDrop = e => {
    if (!this.lf.graphModel || !e || !this.nodeConfig) {
      return;
    }
    const currentNode = this.lf.addNode({
      ...this.nodeConfig,
      ...this.clientToLocalPoint({ x: e.clientX, y: e.clientY }),
    });
    e.preventDefault();
    e.stopPropagation();
    this.nodeConfig = null;
    this.lf.removeNodeSnapLine();
    this.lf.graphModel.removeFakerNode();
    this.fakerNode = null;

    const nodeData = currentNode.getData();
    this.lf.eventCenter.emit(EventType.NODE_DND_ADD, { data: nodeData });
  };
}
