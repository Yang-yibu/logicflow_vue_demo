const noop = () => undefined;
const DOC = window.document;
const LEFT_MOUSE_BUTTON_CODE = 0;

/**
 * 拖拽的时候，按照指定step进行
 * - 因为在绘制的过程中因为放大缩小，移动的真实的step则是变化的。
 */
export class StepDrag {
  onDragStart = null;
  onDragging = null;
  onDragEnd = null;
  isStopPropagation = false;
  isDragging = false;
  startX = 0;
  startY = 0;
  sumDeltaX = 0;
  sumDeltaY = 0;
  startTime = 0;
  /** 是否为拖拽 */
  isDrag = false;

  constructor({
    onDragStart = noop,
    onDragging = noop,
    onDragEnd = noop,
    eventType = '',
    eventCenter = null,
    step = 1,
    isStopPropagation = true,
    model = null,
  }) {
    Object.assign(this, {
      onDragStart,
      onDragging,
      onDragEnd,
      eventType,
      eventCenter,
      step,
      isStopPropagation,
      model,
    });
  }
  /** @param {number} step */
  setStep(step) {
    this.step = step;
  }
  /** @param {MouseEvent} e */
  handleMouseDown = e => {
    if (e.button !== LEFT_MOUSE_BUTTON_CODE) return;
    if (this.isStopPropagation) e.stopPropagation();
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    DOC.addEventListener('mousemove', this.handleMouseMove, false);
    DOC.addEventListener('mouseup', this.handleMouseUp, false);
    this.onDragStart({ event: e });
    // const elementData = this.model?.getData();
    // this.eventCenter?.emit(EventType[`${this.eventType}_MOUSEDOWN`], { e, data: elementData });
    // this.eventCenter?.emit(EventType[`${this.eventType}_DRAGSTART`], { e, data: elementData });
    this.startTime = new Date().getTime();
  };
  /** @param {MouseEvent} e */
  handleMouseMove = e => {
    if (this.isStopPropagation) e.stopPropagation();

    if (!this.isDragging) return;
    this.sumDeltaX += e.clientX - this.startX;
    this.sumDeltaY += e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;
    if (Math.abs(this.sumDeltaX) > this.step || Math.abs(this.sumDeltaY) > this.step) {
      const remainderX = this.sumDeltaX % this.step;
      const remainderY = this.sumDeltaY % this.step;
      const deltaX = this.sumDeltaX - remainderX;
      const deltaY = this.sumDeltaY - remainderY;
      this.sumDeltaX = remainderX;
      this.sumDeltaY = remainderY;
      this.onDragging({ deltaX, deltaY, event: e });

      // const elementData = this.model?.getData();
      // this.eventCenter?.emit(EventType[`${this.eventType}_MOUSEMOVE`], { e, data: elementData });
      // this.eventCenter?.emit(EventType[`${this.eventType}_DRAG`], { e, data: elementData });

      this.isDrag = true;
    }
  };
  /** @param {MouseEvent} e */
  handleMouseUp = e => {
    if (this.isStopPropagation) e.stopPropagation();
    this.isDragging = false;
    DOC.removeEventListener('mousemove', this.handleMouseMove, false);
    DOC.removeEventListener('mouseup', this.handleMouseUp, false);
    this.onDragEnd({ event: e });

    // const elementData = this.model?.getData();
    // this.eventCenter?.emit(EventType[`${this.eventType}_MOUSEUP`], { e, data: elementData });

    // 区分mouseup和drop, 在触发click事件的时候，会触发mouseup事件，但是不会触发drop事件。
    // 以200ms判断不太合理，改成只要触发了drag, 那必定会触发drop
    if (this.isDrag) {
      // this.eventCenter?.emit(EventType[`${this.eventType}_DROP`], { e, data: elementData });
      this.isDrag = false;
    }
  };
}
