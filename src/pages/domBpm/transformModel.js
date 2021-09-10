/**
 * TransformModel
 */
export default class TransformModel {
  constructor() {
    Object.assign(this, {
      MINI_SCALE_SIZE: 0.2,
      MAX_SCALE_SIZE: 16,
      SCALE_X: 1,
      SCALE_Y: 1,
      SKEW_X: 0,
      SKEW_Y: 0,
      TRANSLATE_X: 0,
      TRANSLATE_Y: 0,
      ZOOM_SIZE: 0.04,
    });
  }

  setZoomMiniSize(size) {
    this.MINI_SCALE_SIZE = size;
  }
  setZoomMaxSize(size) {
    this.MAX_SCALE_SIZE = size;
  }
  /**
   * 将最外层graph上的点基于缩放转换为canvasOverlay层上的点。
   * @param {[number, number]} param0 HTML点
   */
  HtmlPointToCanvasPoint([x, y]) {
    return [
      (x - this.TRANSLATE_X) / this.SCALE_X,
      (y - this.TRANSLATE_Y) / this.SCALE_Y,
    ];
  }
  resetZoom() {
    this.SCALE_X = 1;
    this.SCALE_Y = 1;
  }
  zoom(isZoomIn = false, point = []) {
    const size = isZoomIn ? this.ZOOM_SIZE : -this.ZOOM_SIZE;
    if (size < 0 && this.SCALE_X <= this.MINI_SCALE_SIZE) {
      return false;
    }
    if (size > 0 && this.SCALE_X >= this.MAX_SCALE_SIZE) {
      return false;
    }
    this.SCALE_X += size;
    this.SCALE_Y += size;
    if (point) {
      this.TRANSLATE_X -= size * point[0];
      this.TRANSLATE_Y -= size * point[1];
    }
    return true;
  }
}
