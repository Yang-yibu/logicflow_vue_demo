export default function registerEnd(lf) {
  lf.register('End', ({ CircleNode, CircleNodeModel, h }) => {
    class EndNode extends CircleNode {
      getIconShape() {
        const attributes = this.getAttributes();
        const { x, y, width, height } = attributes;
        const stroke = '#404040';
        return h(
          'svg',
          {
            x: x - width / 2,
            y: y - height / 2,
            width: 40,
            height: 40,
            viewBox: '0 0 1024 1024',
          },
          h('path', {
            fill: stroke,
            d:
              'M212.992 526.336 212.992 526.336 212.992 526.336 215.04 526.336 212.992 526.336Z',
          }),
          h('path', {
            fill: stroke,
            d:
              'M724.992 296.96 724.992 296.96 296.96 296.96 296.96 724.992 724.992 724.992 724.992 296.96Z',
          }),
        );
      }
      getShape() {
        const attributes = this.getAttributes();
        const { x, y, r, fill, stroke, strokeWidth } = attributes;
        return h('g', {}, [
          h('circle', {
            cx: x,
            cy: y,
            r,
            fill,
            stroke,
            strokeWidth,
          }),
          this.getIconShape(),
        ]);
      }
    }
    class EndModel extends CircleNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 35,
        };
        super(data, graphModel);
      }
      getConnectedSourceRules() {
        const rules = super.getConnectedSourceRules();
        const notAsTarget = {
          message: '终止节点不能作为连线的起点',
          validate: () => false,
        };
        rules.push(notAsTarget);
        return rules;
      }
    }
    return {
      view: EndNode,
      model: EndModel,
    };
  });
}
